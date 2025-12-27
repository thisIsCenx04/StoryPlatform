package com.example.storysite.service.payment;

import java.util.UUID;

import com.example.storysite.entity.DonationStatus;

public final class PaymentModels {

    private PaymentModels() {
    }

    public record PaymentInitiation(String paymentUrl, String providerTxnId, String provider) {
    }

    public record PaymentResult(UUID donationId, DonationStatus status, String paymentTxnId, String provider,
            String message) {
    }
}
