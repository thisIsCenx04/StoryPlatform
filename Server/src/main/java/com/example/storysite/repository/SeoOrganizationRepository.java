package com.example.storysite.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.storysite.entity.SeoOrganization;

@Repository
public interface SeoOrganizationRepository extends JpaRepository<SeoOrganization, UUID> {
    Optional<SeoOrganization> findFirstByOrderByCreatedAtDesc();
}
