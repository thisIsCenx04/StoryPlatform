package com.example.storysite.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.storysite.entity.StorySummarySection;

@Repository
public interface StorySummarySectionRepository extends JpaRepository<StorySummarySection, UUID> {
    List<StorySummarySection> findByStoryIdOrderBySortOrderAsc(UUID storyId);
    void deleteByStoryId(UUID storyId);
}
