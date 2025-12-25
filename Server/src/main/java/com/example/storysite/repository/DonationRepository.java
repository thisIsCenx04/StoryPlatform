package com.example.storysite.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.storysite.entity.Donation;

@Repository
public interface DonationRepository extends JpaRepository<Donation, UUID> {
}
