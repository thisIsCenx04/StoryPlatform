package com.example.storysite.service.payment;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.storysite.config.PaymentProperties;
import com.example.storysite.dto.payment.PaymentCheckoutRequest;
import com.example.storysite.dto.payment.PaymentCheckoutResponse;
import com.example.storysite.entity.Donation;
import com.example.storysite.entity.DonationStatus;
import com.example.storysite.service.DonationService;
import com.example.storysite.service.payment.PaymentModels.PaymentInitiation;
import com.example.storysite.service.payment.PaymentModels.PaymentResult;

@Service
public class PaymentService {

    private final PaymentProperties paymentProperties;
    private final DonationService donationService;
    private final MomoPaymentClient momoPaymentClient;
    private final VnpayPaymentClient vnpayPaymentClient;
    private final PaypalPaymentClient paypalPaymentClient;

    public PaymentService(PaymentProperties paymentProperties,
            DonationService donationService,
            MomoPaymentClient momoPaymentClient,
            VnpayPaymentClient vnpayPaymentClient,
            PaypalPaymentClient paypalPaymentClient) {
        this.paymentProperties = paymentProperties;
        this.donationService = donationService;
        this.momoPaymentClient = momoPaymentClient;
        this.vnpayPaymentClient = vnpayPaymentClient;
        this.paypalPaymentClient = paypalPaymentClient;
    }

    public PaymentCheckoutResponse checkout(PaymentCheckoutRequest request, String clientIp) {
        String provider = normalizeProvider(request.getPaymentMethod());
        Donation donation = donationService.createPendingDonation(
                request.getDonorName(),
                request.getAmount(),
                request.getCurrency(),
                request.getMessage(),
                provider);

        PaymentInitiation initiation;
        switch (provider) {
            case "MOMO" -> initiation = momoPaymentClient.createPayment(donation);
            case "BANK" -> initiation = vnpayPaymentClient.createPayment(donation, clientIp);
            case "PAYPAL" -> initiation = paypalPaymentClient.createPayment(donation);
            default -> throw new IllegalArgumentException("Unsupported payment method: " + provider);
        }

        if (initiation.providerTxnId() != null && !initiation.providerTxnId().isBlank()) {
            donationService.updatePayment(donation.getId(), DonationStatus.PENDING, initiation.providerTxnId());
        }

        return PaymentCheckoutResponse.builder()
                .donationId(donation.getId())
                .paymentUrl(initiation.paymentUrl())
                .provider(initiation.provider())
                .build();
    }

    public String handleMomoReturn(Map<String, String> params) {
        PaymentResult result = momoPaymentClient.parseReturn(params);
        donationService.updatePayment(result.donationId(), result.status(), result.paymentTxnId());
        return buildRedirectUrl(result);
    }

    public Map<String, Object> handleMomoNotify(Map<String, Object> payload) {
        PaymentResult result = momoPaymentClient.parseNotify(payload);
        donationService.updatePayment(result.donationId(), result.status(), result.paymentTxnId());
        return Map.of("message", "success", "resultCode", 0);
    }

    public String handleVnpayReturn(Map<String, String> params) {
        PaymentResult result = vnpayPaymentClient.parseReturn(params);
        donationService.updatePayment(result.donationId(), result.status(), result.paymentTxnId());
        return buildRedirectUrl(result);
    }

    public Map<String, String> handleVnpayNotify(Map<String, String> params) {
        PaymentResult result = vnpayPaymentClient.parseReturn(params);
        donationService.updatePayment(result.donationId(), result.status(), result.paymentTxnId());
        return Map.of("RspCode", "00", "Message", "OK");
    }

    public String handlePaypalReturn(String token) {
        PaymentResult result = paypalPaymentClient.captureOrder(token);
        donationService.updatePayment(result.donationId(), result.status(), result.paymentTxnId());
        return buildRedirectUrl(result);
    }

    public String handlePaypalCancel(String token) {
        PaymentResult result = paypalPaymentClient.cancelOrder(token);
        donationService.updatePayment(result.donationId(), result.status(), result.paymentTxnId());
        return buildRedirectUrl(result);
    }

    private String normalizeProvider(String value) {
        return value == null ? "" : value.trim().toUpperCase(Locale.ROOT);
    }

    private String buildRedirectUrl(PaymentResult result) {
        String status = result.status() == DonationStatus.SUCCESS ? "success" : "fail";
        String message = result.message() == null ? "" : result.message();
        String baseUrl = paymentProperties.getClientBaseUrl();
        String encodedMessage = URLEncoder.encode(message, StandardCharsets.UTF_8);
        return baseUrl + "/donate?status=" + status
                + "&donationId=" + result.donationId()
                + "&method=" + result.provider()
                + "&message=" + encodedMessage;
    }

    static BigDecimal normalizeAmount(BigDecimal amount) {
        return amount.setScale(0, RoundingMode.HALF_UP);
    }
}
