package com.example.storysite.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.storysite.dto.seo.SeoArticleDto;
import com.example.storysite.dto.seo.SeoBreadcrumbListDto;
import com.example.storysite.dto.seo.SeoOrganizationDto;
import com.example.storysite.entity.SeoArticle;
import com.example.storysite.entity.SeoBreadcrumbList;
import com.example.storysite.exception.ResourceNotFoundException;
import com.example.storysite.mapper.SeoMapper;
import com.example.storysite.repository.SeoArticleRepository;
import com.example.storysite.repository.SeoBreadcrumbItemRepository;
import com.example.storysite.repository.SeoBreadcrumbListRepository;
import com.example.storysite.repository.SeoOrganizationRepository;

@Service
public class SeoService {

    private final SeoOrganizationRepository seoOrganizationRepository;
    private final SeoArticleRepository seoArticleRepository;
    private final SeoBreadcrumbListRepository seoBreadcrumbListRepository;
    private final SeoBreadcrumbItemRepository seoBreadcrumbItemRepository;
    private final SeoMapper seoMapper;

    public SeoService(SeoOrganizationRepository seoOrganizationRepository, SeoArticleRepository seoArticleRepository,
            SeoBreadcrumbListRepository seoBreadcrumbListRepository, SeoBreadcrumbItemRepository seoBreadcrumbItemRepository,
            SeoMapper seoMapper) {
        this.seoOrganizationRepository = seoOrganizationRepository;
        this.seoArticleRepository = seoArticleRepository;
        this.seoBreadcrumbListRepository = seoBreadcrumbListRepository;
        this.seoBreadcrumbItemRepository = seoBreadcrumbItemRepository;
        this.seoMapper = seoMapper;
    }

    public SeoOrganizationDto getOrganization() {
        return seoOrganizationRepository.findFirstByOrderByCreatedAtDesc()
                .map(seoMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));
    }

    public SeoArticleDto getArticleByStorySlug(String slug) {
        SeoArticle article = seoArticleRepository.findByStorySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("SEO article not found"));
        return seoMapper.toDto(article);
    }

    public SeoBreadcrumbListDto getBreadcrumb(String pageType, UUID refId, String canonicalUrl) {
        SeoBreadcrumbList list = null;
        if (pageType != null && refId != null) {
            list = seoBreadcrumbListRepository.findTopByPageTypeAndPageRefId(pageType, refId).orElse(null);
        }
        if (list == null && canonicalUrl != null) {
            list = seoBreadcrumbListRepository.findTopByCanonicalUrl(canonicalUrl)
                    .orElseThrow(() -> new ResourceNotFoundException("Breadcrumb not found"));
        }
        if (list == null) {
            throw new ResourceNotFoundException("Breadcrumb not found");
        }
        var items = seoBreadcrumbItemRepository.findByBreadcrumbListIdOrderByPositionAsc(list.getId());
        return seoMapper.toDtoWithItems(list, items);
    }
}
