package com.example.storysite.service.payment;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.storysite.config.PaymentProperties;
import com.example.storysite.entity.Donation;
import com.example.storysite.entity.DonationStatus;
import com.example.storysite.service.payment.PaymentModels.PaymentInitiation;
import com.example.storysite.service.payment.PaymentModels.PaymentResult;
import com.example.storysite.util.PaymentSignatureUtil;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class MomoPaymentClient {

    private final PaymentProperties paymentProperties;
    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate = new RestTemplate();

    public MomoPaymentClient(PaymentProperties paymentProperties, ObjectMapper objectMapper) {
        this.paymentProperties = paymentProperties;
        this.objectMapper = objectMapper;
    }

    public PaymentInitiation createPayment(Donation donation) {
        PaymentProperties.Momo momo = paymentProperties.getMomo();
        validateEnabled(momo.isEnabled(), "MoMo is disabled");

        String partnerCode = momo.getPartnerCode();
        String accessKey = momo.getAccessKey();
        String secretKey = momo.getSecretKey();
        validateConfigured(partnerCode, "MoMo partner code is missing");
        validateConfigured(accessKey, "MoMo access key is missing");
        validateConfigured(secretKey, "MoMo secret key is missing");

        String orderId = donation.getId().toString();
        String requestId = orderId;
        String orderInfo = "Donation " + orderId;
        String redirectUrl = paymentProperties.getServerBaseUrl() + momo.getReturnPath();
        String ipnUrl = paymentProperties.getServerBaseUrl() + momo.getIpnPath();
        String requestType = "captureWallet";
        String extraData = "";
        BigDecimal amount = PaymentService.normalizeAmount(donation.getAmount());

        String rawSignature = "accessKey=" + accessKey
                + "&amount=" + amount.toPlainString()
                + "&extraData=" + extraData
                + "&ipnUrl=" + ipnUrl
                + "&orderId=" + orderId
                + "&orderInfo=" + orderInfo
                + "&partnerCode=" + partnerCode
                + "&redirectUrl=" + redirectUrl
                + "&requestId=" + requestId
                + "&requestType=" + requestType;

        String signature = PaymentSignatureUtil.hmacSha256(secretKey, rawSignature);

        Map<String, Object> payload = new HashMap<>();
        payload.put("partnerCode", partnerCode);
        payload.put("partnerName", "StorySite");
        payload.put("storeId", "StorySite");
        payload.put("requestId", requestId);
        payload.put("amount", amount.toPlainString());
        payload.put("orderId", orderId);
        payload.put("orderInfo", orderInfo);
        payload.put("redirectUrl", redirectUrl);
        payload.put("ipnUrl", ipnUrl);
        payload.put("lang", "vi");
        payload.put("requestType", requestType);
        payload.put("extraData", extraData);
        payload.put("signature", signature);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(momo.getEndpoint(), entity, String.class);

        Map<String, Object> body = readBody(response.getBody());
        Object resultCode = body.get("resultCode");
        if (resultCode instanceof Number && ((Number) resultCode).intValue() == 0) {
            String payUrl = String.valueOf(body.get("payUrl"));
            return new PaymentInitiation(payUrl, orderId, "MOMO");
        }
        throw new IllegalStateException("MoMo payment request failed: " + body.getOrDefault("message", "unknown"));
    }

    public PaymentResult parseReturn(Map<String, String> params) {
        String orderId = params.getOrDefault("orderId", "");
        UUID donationId = UUID.fromString(orderId);
        String requestId = params.getOrDefault("requestId", "");
        String resultCode = params.getOrDefault("resultCode", "");
        String message = params.getOrDefault("message", "");
        String signature = params.getOrDefault("signature", "");
        if (!signature.isBlank() && !isSignatureValid(params, signature)) {
            return new PaymentResult(donationId, DonationStatus.FAILED, orderId, "MOMO", "Invalid signature");
        }
        DonationStatus status = "0".equals(resultCode) ? DonationStatus.SUCCESS : DonationStatus.FAILED;
        String paymentTxnId = params.getOrDefault("transId", orderId);
        if (paymentTxnId.isBlank()) {
            paymentTxnId = requestId.isBlank() ? orderId : requestId;
        }
        return new PaymentResult(donationId, status, paymentTxnId, "MOMO", message);
    }

    public PaymentResult parseNotify(Map<String, Object> payload) {
        String orderId = String.valueOf(payload.getOrDefault("orderId", ""));
        UUID donationId = UUID.fromString(orderId);
        String resultCode = String.valueOf(payload.getOrDefault("resultCode", ""));
        DonationStatus status = "0".equals(resultCode) ? DonationStatus.SUCCESS : DonationStatus.FAILED;
        String paymentTxnId = String.valueOf(payload.getOrDefault("transId", orderId));
        return new PaymentResult(donationId, status, paymentTxnId, "MOMO", String.valueOf(payload.getOrDefault("message", "")));
    }

    private boolean isSignatureValid(Map<String, String> params, String signature) {
        PaymentProperties.Momo momo = paymentProperties.getMomo();
        if (momo.getSecretKey() == null || momo.getSecretKey().isBlank()) {
            return true;
        }
        String rawSignature = "accessKey=" + momo.getAccessKey()
                + "&amount=" + params.getOrDefault("amount", "")
                + "&extraData=" + params.getOrDefault("extraData", "")
                + "&orderId=" + params.getOrDefault("orderId", "")
                + "&orderInfo=" + params.getOrDefault("orderInfo", "")
                + "&orderType=" + params.getOrDefault("orderType", "")
                + "&partnerCode=" + params.getOrDefault("partnerCode", "")
                + "&payType=" + params.getOrDefault("payType", "")
                + "&requestId=" + params.getOrDefault("requestId", "")
                + "&responseTime=" + params.getOrDefault("responseTime", "")
                + "&resultCode=" + params.getOrDefault("resultCode", "")
                + "&transId=" + params.getOrDefault("transId", "");
        String expected = PaymentSignatureUtil.hmacSha256(momo.getSecretKey(), rawSignature);
        return expected.equals(signature);
    }

    private Map<String, Object> readBody(String body) {
        try {
            if (body == null || body.isBlank()) {
                return Map.of();
            }
            return objectMapper.readValue(body, Map.class);
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to parse MoMo response", ex);
        }
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
