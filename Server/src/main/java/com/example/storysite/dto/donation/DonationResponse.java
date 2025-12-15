package com.example.storysite.dto.donation;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

import com.example.storysite.entity.DonationStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DonationResponse {
    private UUID id;
    private String donorName;
    private BigDecimal amount;
    private String currency;
    private String message;
    private String paymentMethod;
    private String paymentTxnId;
    private DonationStatus status;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
