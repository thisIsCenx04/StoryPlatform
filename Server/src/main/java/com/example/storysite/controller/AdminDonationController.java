package com.example.storysite.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.storysite.dto.donation.DonationResponse;
import com.example.storysite.entity.DonationStatus;
import com.example.storysite.service.DonationService;

@RestController
@RequestMapping("/api/admin/donations")
@PreAuthorize("hasRole('ADMIN')")
public class AdminDonationController {

    private final DonationService donationService;

    public AdminDonationController(DonationService donationService) {
        this.donationService = donationService;
    }

    @GetMapping
    public ResponseEntity<List<DonationResponse>> list() {
        return ResponseEntity.ok(donationService.listAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<DonationResponse> updateStatus(@PathVariable UUID id,
            @RequestParam DonationStatus status) {
        return ResponseEntity.ok(donationService.updateStatus(id, status));
    }
}
