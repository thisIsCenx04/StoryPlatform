package com.example.storysite.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.storysite.entity.SeoBreadcrumbItem;

@Repository
public interface SeoBreadcrumbItemRepository extends JpaRepository<SeoBreadcrumbItem, UUID> {
    List<SeoBreadcrumbItem> findByBreadcrumbListIdOrderByPositionAsc(UUID breadcrumbListId);
}
