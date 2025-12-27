package com.example.storysite.service.payment;

import java.math.BigDecimal;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.storysite.config.PaymentProperties;
import com.example.storysite.entity.Donation;
import com.example.storysite.entity.DonationStatus;
import com.example.storysite.service.payment.PaymentModels.PaymentInitiation;
import com.example.storysite.service.payment.PaymentModels.PaymentResult;
import com.example.storysite.service.DonationService;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class PaypalPaymentClient {

    private final PaymentProperties paymentProperties;
    private final ObjectMapper objectMapper;
    private final DonationService donationService;
    private final HttpClient httpClient = HttpClient.newHttpClient();

    public PaypalPaymentClient(PaymentProperties paymentProperties, ObjectMapper objectMapper, DonationService donationService) {
        this.paymentProperties = paymentProperties;
        this.objectMapper = objectMapper;
        this.donationService = donationService;
    }

    public PaymentInitiation createPayment(Donation donation) {
        PaymentProperties.Paypal paypal = paymentProperties.getPaypal();
        validateEnabled(paypal.isEnabled(), "PayPal is disabled");
        validateConfigured(paypal.getClientId(), "PayPal client ID is missing");
        validateConfigured(paypal.getClientSecret(), "PayPal client secret is missing");

        String accessToken = fetchAccessToken(paypal);
        String returnUrl = paymentProperties.getServerBaseUrl() + paypal.getReturnPath();
        String cancelUrl = paymentProperties.getServerBaseUrl() + paypal.getCancelPath();
        BigDecimal amount = donation.getAmount();

        Map<String, Object> payload = Map.of(
                "intent", "CAPTURE",
                "purchase_units", List.of(Map.of(
                        "reference_id", donation.getId().toString(),
                        "amount", Map.of(
                                "currency_code", donation.getCurrency(),
                                "value", amount.toPlainString()),
                        "description", "Donation " + donation.getId())),
                "application_context", Map.of(
                        "return_url", returnUrl,
                        "cancel_url", cancelUrl,
                        "brand_name", "StorySite"));

        String responseBody = sendJsonRequest(paypal.getBaseUrl() + "/v2/checkout/orders", accessToken, payload);
        Map<String, Object> response = readBody(responseBody);
        String orderId = String.valueOf(response.get("id"));
        String approveUrl = extractApproveUrl(response);
        if (approveUrl == null || approveUrl.isBlank()) {
            throw new IllegalStateException("PayPal approval link missing");
        }
        return new PaymentInitiation(approveUrl, orderId, "PAYPAL");
    }

    public PaymentResult captureOrder(String orderId) {
        PaymentProperties.Paypal paypal = paymentProperties.getPaypal();
        String accessToken = fetchAccessToken(paypal);
        String responseBody = sendJsonRequest(paypal.getBaseUrl() + "/v2/checkout/orders/" + orderId + "/capture",
                accessToken, Map.of());
        Map<String, Object> response = readBody(responseBody);
        String status = String.valueOf(response.get("status"));
        UUID donationId = resolveDonationId(response);
        DonationStatus donationStatus = "COMPLETED".equalsIgnoreCase(status) ? DonationStatus.SUCCESS : DonationStatus.FAILED;
        return new PaymentResult(donationId, donationStatus, orderId, "PAYPAL", status);
    }

    public PaymentResult cancelOrder(String orderId) {
        UUID donationId = resolveDonationIdByTxn(orderId);
        return new PaymentResult(donationId, DonationStatus.FAILED, orderId, "PAYPAL", "CANCELLED");
    }

    private String fetchAccessToken(PaymentProperties.Paypal paypal) {
        try {
            String auth = paypal.getClientId() + ":" + paypal.getClientSecret();
            String basicAuth = Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(paypal.getBaseUrl() + "/v1/oauth2/token"))
                    .header("Authorization", "Basic " + basicAuth)
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .POST(HttpRequest.BodyPublishers.ofString("grant_type=client_credentials"))
                    .build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 300) {
                throw new IllegalStateException("PayPal token error: " + response.body());
            }
            Map<String, Object> body = readBody(response.body());
            return String.valueOf(body.get("access_token"));
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to fetch PayPal access token", ex);
        }
    }

    private String sendJsonRequest(String url, String accessToken, Map<String, Object> payload) {
        try {
            String json = objectMapper.writeValueAsString(payload);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Authorization", "Bearer " + accessToken)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 300) {
                throw new IllegalStateException("PayPal request error: " + response.body());
            }
            return response.body();
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to call PayPal API", ex);
        }
    }

    private Map<String, Object> readBody(String body) {
        try {
            return objectMapper.readValue(body, Map.class);
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to parse PayPal response", ex);
        }
    }

    private String extractApproveUrl(Map<String, Object> response) {
        Object links = response.get("links");
        if (!(links instanceof Iterable<?> iterable)) {
            return null;
        }
        for (Object link : iterable) {
            if (link instanceof Map<?, ?> map) {
                if ("approve".equals(map.get("rel"))) {
                    return String.valueOf(map.get("href"));
                }
            }
        }
        return null;
    }

    private UUID resolveDonationId(Map<String, Object> response) {
        Object purchaseUnits = response.get("purchase_units");
        if (purchaseUnits instanceof List<?> list && !list.isEmpty()) {
            Object unit = list.get(0);
            if (unit instanceof Map<?, ?> map) {
                Object ref = map.get("reference_id");
                if (ref != null) {
                    return UUID.fromString(ref.toString());
                }
            }
        }
        return resolveDonationIdByTxn(String.valueOf(response.get("id")));
    }

    private UUID tryResolveDonationId(String value) {
        try {
            return UUID.fromString(value);
        } catch (Exception ex) {
            return null;
        }
    }

    private UUID resolveDonationIdByTxn(String orderId) {
        UUID parsed = tryResolveDonationId(orderId);
        if (parsed != null) {
            return parsed;
        }
        return donationService.findByPaymentTxnId(orderId).getId();
    }

    private void validateEnabled(boolean enabled, String message) {
        if (!enabled) {
            throw new IllegalStateException(message);
        }
    }

    private void validateConfigured(String value, String message) {
        if (value == null || value.isBlank()) {
            throw new IllegalStateException(message);
        }
    }
}
