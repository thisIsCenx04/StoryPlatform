package com.example.storysite.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.storysite.entity.SeoBreadcrumbList;

@Repository
public interface SeoBreadcrumbListRepository extends JpaRepository<SeoBreadcrumbList, UUID> {
    Optional<SeoBreadcrumbList> findTopByPageTypeAndPageRefId(String pageType, UUID pageRefId);
    Optional<SeoBreadcrumbList> findTopByCanonicalUrl(String canonicalUrl);
}
