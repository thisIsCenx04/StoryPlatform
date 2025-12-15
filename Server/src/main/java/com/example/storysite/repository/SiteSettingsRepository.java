package com.example.storysite.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.storysite.entity.SiteSettings;

@Repository
public interface SiteSettingsRepository extends JpaRepository<SiteSettings, Short> {
}
