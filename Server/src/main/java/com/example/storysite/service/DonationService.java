package com.example.storysite.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.storysite.dto.donation.DonationRequest;
import com.example.storysite.dto.donation.DonationResponse;
import com.example.storysite.entity.Donation;
import com.example.storysite.entity.DonationStatus;
import com.example.storysite.exception.ResourceNotFoundException;
import com.example.storysite.mapper.DonationMapper;
import com.example.storysite.repository.DonationRepository;

import java.math.BigDecimal;

@Service
public class DonationService {

    private final DonationRepository donationRepository;
    private final DonationMapper donationMapper;

    public DonationService(DonationRepository donationRepository, DonationMapper donationMapper) {
        this.donationRepository = donationRepository;
        this.donationMapper = donationMapper;
    }

    public DonationResponse create(DonationRequest request) {
        Donation donation = donationMapper.toEntity(request);
        if (donation.getStatus() == null) {
            donation.setStatus(DonationStatus.PENDING);
        }
        Donation saved = donationRepository.save(donation);
        return donationMapper.toResponse(saved);
    }

    public List<DonationResponse> listAll() {
        return donationRepository.findAll().stream()
                .map(donationMapper::toResponse)
                .toList();
    }

    public DonationResponse updateStatus(UUID id, DonationStatus status) {
        Donation donation = donationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found"));
        donation.setStatus(status);
        donationRepository.save(donation);
        return donationMapper.toResponse(donation);
    }

    public Donation createPendingDonation(String donorName, BigDecimal amount, String currency, String message, String paymentMethod) {
        Donation donation = Donation.builder()
                .donorName(donorName)
                .amount(amount)
                .currency(currency)
                .message(message)
                .paymentMethod(paymentMethod)
                .status(DonationStatus.PENDING)
                .build();
        return donationRepository.save(donation);
    }

    public Donation updatePayment(UUID id, DonationStatus status, String paymentTxnId) {
        Donation donation = donationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found"));
        donation.setStatus(status);
        if (paymentTxnId != null && !paymentTxnId.isBlank()) {
            donation.setPaymentTxnId(paymentTxnId);
        }
        return donationRepository.save(donation);
    }

    public Donation findByPaymentTxnId(String paymentTxnId) {
        return donationRepository.findByPaymentTxnId(paymentTxnId)
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found"));
    }
}
