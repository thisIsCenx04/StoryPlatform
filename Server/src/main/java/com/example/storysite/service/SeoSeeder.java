package com.example.storysite.service;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.storysite.repository.StoryRepository;

@Component
public class SeoSeeder implements CommandLineRunner {
    private final SeoContentService seoContentService;
    private final StoryRepository storyRepository;

    public SeoSeeder(SeoContentService seoContentService, StoryRepository storyRepository) {
        this.seoContentService = seoContentService;
        this.storyRepository = storyRepository;
    }

    @Override
    public void run(String... args) {
        seoContentService.ensureOrganization();
        storyRepository.findAll().forEach(seoContentService::upsertStorySeo);
    }
}
