package com.example.storysite.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Data;

@Data
@Component
@ConfigurationProperties(prefix = "app.payment")
public class PaymentProperties {

    private String clientBaseUrl = "http://localhost:5173";
    private String serverBaseUrl = "http://localhost:8080";

    private Momo momo = new Momo();
    private Vnpay vnpay = new Vnpay();
    private Paypal paypal = new Paypal();

    @Data
    public static class Momo {
        private boolean enabled;
        private String endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
        private String partnerCode;
        private String accessKey;
        private String secretKey;
        private String returnPath = "/api/payments/momo/return";
        private String ipnPath = "/api/payments/momo/notify";
    }

    @Data
    public static class Vnpay {
        private boolean enabled;
        private String endpoint = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        private String tmnCode;
        private String hashSecret;
        private String returnPath = "/api/payments/vnpay/return";
        private String ipnPath = "/api/payments/vnpay/notify";
    }

    @Data
    public static class Paypal {
        private boolean enabled;
        private String baseUrl = "https://api-m.sandbox.paypal.com";
        private String clientId;
        private String clientSecret;
        private String returnPath = "/api/payments/paypal/return";
        private String cancelPath = "/api/payments/paypal/cancel";
    }
}
