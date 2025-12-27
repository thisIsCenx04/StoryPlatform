package com.example.storysite.dto.payment;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentCheckoutResponse {
    private UUID donationId;
    private String paymentUrl;
    private String provider;
}
