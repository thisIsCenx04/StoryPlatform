package com.example.storysite.dto.donation;

import java.math.BigDecimal;

import com.example.storysite.entity.DonationStatus;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DonationRequest {

    @NotBlank
    @Size(max = 150)
    private String donorName;

    @NotNull
    @DecimalMin(value = "0.01")
    private BigDecimal amount;

    @NotBlank
    @Size(max = 3)
    private String currency;

    @Size(max = 500)
    private String message;

    @Size(max = 50)
    private String paymentMethod;

    @Size(max = 100)
    private String paymentTxnId;

    private DonationStatus status;
}
