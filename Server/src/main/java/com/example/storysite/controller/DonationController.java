package com.example.storysite.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.storysite.dto.donation.DonationRequest;
import com.example.storysite.dto.donation.DonationResponse;
import com.example.storysite.service.DonationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/donations")
public class DonationController {

    private final DonationService donationService;

    public DonationController(DonationService donationService) {
        this.donationService = donationService;
    }

    @PostMapping
    public ResponseEntity<DonationResponse> donate(@Valid @RequestBody DonationRequest request) {
        return ResponseEntity.ok(donationService.create(request));
    }
}
