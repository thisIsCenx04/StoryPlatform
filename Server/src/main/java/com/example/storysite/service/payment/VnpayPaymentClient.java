package com.example.storysite.service.payment;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import java.math.RoundingMode;

import org.springframework.stereotype.Service;

import com.example.storysite.config.PaymentProperties;
import com.example.storysite.entity.Donation;
import com.example.storysite.entity.DonationStatus;
import com.example.storysite.service.payment.PaymentModels.PaymentInitiation;
import com.example.storysite.service.payment.PaymentModels.PaymentResult;
import com.example.storysite.util.PaymentSignatureUtil;

@Service
public class VnpayPaymentClient {

    private static final DateTimeFormatter VNPAY_TIME = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

    private final PaymentProperties paymentProperties;

    public VnpayPaymentClient(PaymentProperties paymentProperties) {
        this.paymentProperties = paymentProperties;
    }

    public PaymentInitiation createPayment(Donation donation, String clientIp) {
        PaymentProperties.Vnpay vnpay = paymentProperties.getVnpay();
        validateEnabled(vnpay.isEnabled(), "VNPay is disabled");
        validateConfigured(vnpay.getTmnCode(), "VNPay TMN code is missing");
        validateConfigured(vnpay.getHashSecret(), "VNPay hash secret is missing");

        String txnRef = uuidToTxnRef(donation.getId());
        BigDecimal amount = donation.getAmount().multiply(BigDecimal.valueOf(100));
        String createDate = OffsetDateTime.now().format(VNPAY_TIME);
        String expireDate = OffsetDateTime.now().plusMinutes(15).format(VNPAY_TIME);
        String returnUrl = paymentProperties.getServerBaseUrl() + vnpay.getReturnPath();
        String ipnUrl = paymentProperties.getServerBaseUrl() + vnpay.getIpnPath();

        Map<String, String> params = new LinkedHashMap<>();
        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", vnpay.getTmnCode());
        params.put("vnp_Amount", amount.setScale(0, RoundingMode.HALF_UP).toPlainString());
        params.put("vnp_CurrCode", "VND");
        params.put("vnp_TxnRef", txnRef);
        params.put("vnp_OrderInfo", "Donation " + donation.getId());
        params.put("vnp_OrderType", "other");
        params.put("vnp_Locale", "vn");
        params.put("vnp_ReturnUrl", returnUrl);
        params.put("vnp_IpAddr", clientIp == null || clientIp.isBlank() ? "127.0.0.1" : clientIp);
        params.put("vnp_CreateDate", createDate);
        params.put("vnp_ExpireDate", expireDate);
        params.put("vnp_IpnUrl", ipnUrl);

        String query = buildQuery(params);
        String hashData = buildHashData(params);
        String secureHash = PaymentSignatureUtil.hmacSha512(vnpay.getHashSecret(), hashData);
        String paymentUrl = vnpay.getEndpoint() + "?" + query + "&vnp_SecureHash=" + secureHash;

        return new PaymentInitiation(paymentUrl, txnRef, "BANK");
    }

    public PaymentResult parseReturn(Map<String, String> params) {
        PaymentProperties.Vnpay vnpay = paymentProperties.getVnpay();
        String secureHash = params.getOrDefault("vnp_SecureHash", "");
        String responseCode = params.getOrDefault("vnp_ResponseCode", "");
        String txnRef = params.getOrDefault("vnp_TxnRef", "");
        UUID donationId = txnRefToUuid(txnRef);

        if (!secureHash.isBlank()) {
            Map<String, String> filtered = params.entrySet().stream()
                    .filter(entry -> !entry.getKey().equalsIgnoreCase("vnp_SecureHash")
                            && !entry.getKey().equalsIgnoreCase("vnp_SecureHashType"))
                    .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
            String hashData = buildHashData(filtered);
            String expected = PaymentSignatureUtil.hmacSha512(vnpay.getHashSecret(), hashData);
            if (!expected.equalsIgnoreCase(secureHash)) {
                return new PaymentResult(donationId, DonationStatus.FAILED, txnRef, "BANK", "Invalid signature");
            }
        }

        DonationStatus status = "00".equals(responseCode) ? DonationStatus.SUCCESS : DonationStatus.FAILED;
        return new PaymentResult(donationId, status, txnRef, "BANK", params.getOrDefault("vnp_Message", ""));
    }

    private String buildQuery(Map<String, String> params) {
        return params.entrySet().stream()
                .sorted(Comparator.comparing(Map.Entry::getKey))
                .map(entry -> entry.getKey() + "=" + urlEncode(entry.getValue()))
                .collect(Collectors.joining("&"));
    }

    private String buildHashData(Map<String, String> params) {
        return params.entrySet().stream()
                .sorted(Comparator.comparing(Map.Entry::getKey))
                .map(entry -> entry.getKey() + "=" + urlEncode(entry.getValue()))
                .collect(Collectors.joining("&"));
    }

    private String urlEncode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
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

    private String uuidToTxnRef(UUID id) {
        return id.toString().replace("-", "");
    }

    private UUID txnRefToUuid(String txnRef) {
        String value = txnRef.replace("-", "");
        if (value.length() != 32) {
            throw new IllegalArgumentException("Invalid VNPay transaction reference");
        }
        String uuid = value.substring(0, 8) + "-" + value.substring(8, 12) + "-" + value.substring(12, 16) + "-"
                + value.substring(16, 20) + "-" + value.substring(20);
        return UUID.fromString(uuid);
    }
}
