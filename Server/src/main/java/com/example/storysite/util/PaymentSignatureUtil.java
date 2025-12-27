package com.example.storysite.util;

import java.nio.charset.StandardCharsets;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

public final class PaymentSignatureUtil {

    private PaymentSignatureUtil() {
    }

    public static String hmacSha256(String key, String data) {
        return hmac("HmacSHA256", key, data);
    }

    public static String hmacSha512(String key, String data) {
        return hmac("HmacSHA512", key, data);
    }

    private static String hmac(String algorithm, String key, String data) {
        try {
            Mac mac = Mac.getInstance(algorithm);
            mac.init(new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), algorithm));
            byte[] raw = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(raw.length * 2);
            for (byte b : raw) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to sign payment request", ex);
        }
    }
}
