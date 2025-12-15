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
}
