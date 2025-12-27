package com.example.storysite.service;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.storysite.entity.Category;
import com.example.storysite.entity.SeoArticle;
import com.example.storysite.entity.SeoBreadcrumbItem;
import com.example.storysite.entity.SeoBreadcrumbList;
import com.example.storysite.entity.SeoOrganization;
import com.example.storysite.entity.SiteSettings;
import com.example.storysite.entity.Story;
import com.example.storysite.repository.CategoryRepository;
import com.example.storysite.repository.SeoArticleRepository;
import com.example.storysite.repository.SeoBreadcrumbItemRepository;
import com.example.storysite.repository.SeoBreadcrumbListRepository;
import com.example.storysite.repository.SeoOrganizationRepository;
import com.example.storysite.repository.SiteSettingsRepository;
import com.example.storysite.repository.StoryCategoryRepository;

@Service
public class SeoContentService {
    private static final int META_DESCRIPTION_LIMIT = 160;

    private final SeoOrganizationRepository seoOrganizationRepository;
    private final SeoArticleRepository seoArticleRepository;
    private final SeoBreadcrumbListRepository seoBreadcrumbListRepository;
    private final SeoBreadcrumbItemRepository seoBreadcrumbItemRepository;
    private final StoryCategoryRepository storyCategoryRepository;
    private final CategoryRepository categoryRepository;
    private final SiteSettingsRepository siteSettingsRepository;

    private final String baseUrl;

    public SeoContentService(SeoOrganizationRepository seoOrganizationRepository, SeoArticleRepository seoArticleRepository,
            SeoBreadcrumbListRepository seoBreadcrumbListRepository, SeoBreadcrumbItemRepository seoBreadcrumbItemRepository,
            StoryCategoryRepository storyCategoryRepository, CategoryRepository categoryRepository,
            SiteSettingsRepository siteSettingsRepository,
            @Value("${app.site.base-url:http://localhost:5173}") String baseUrl) {
        this.seoOrganizationRepository = seoOrganizationRepository;
        this.seoArticleRepository = seoArticleRepository;
        this.seoBreadcrumbListRepository = seoBreadcrumbListRepository;
        this.seoBreadcrumbItemRepository = seoBreadcrumbItemRepository;
        this.storyCategoryRepository = storyCategoryRepository;
        this.categoryRepository = categoryRepository;
        this.siteSettingsRepository = siteSettingsRepository;
        this.baseUrl = baseUrl == null ? "http://localhost:5173" : baseUrl.trim();
    }

    @Transactional
    public void upsertStorySeo(Story story) {
        if (story == null) return;
        SeoOrganization organization = ensureOrganization();
        List<String> categoryNames = resolveCategoryNames(story.getId());
        String canonicalUrl = buildCanonicalUrl(story.getSlug());

        SeoArticle article = seoArticleRepository.findByStoryId(story.getId()).orElseGet(SeoArticle::new);
        article.setStory(story);
        article.setCanonicalUrl(canonicalUrl);
        article.setHeadline(story.getTitle());
        article.setMetaDescription(trimDescription(story.getShortDescription()));
        article.setMetaKeywords(categoryNames);
        article.setImageUrl(story.getCoverImageUrl());
        article.setDatePublished(story.getPublishedAt() != null ? story.getPublishedAt() : story.getCreatedAt());
        article.setDateModified(story.getUpdatedAt());
        article.setAuthorName(story.getAuthorName());
        article.setPublisherOrganization(organization);
        article.setArticleSection(categoryNames.isEmpty() ? null : categoryNames.get(0));
        article.setArticleTags(categoryNames);
        seoArticleRepository.save(article);

        upsertBreadcrumb(story, canonicalUrl);
    }

    @Transactional
    public SeoOrganization ensureOrganization() {
        return seoOrganizationRepository.findFirstByOrderByCreatedAtDesc().orElseGet(this::createDefaultOrganization);
    }

    private SeoOrganization createDefaultOrganization() {
        SiteSettings settings = siteSettingsRepository.findById((short) 1).orElseGet(() -> {
            SiteSettings s = new SiteSettings();
            s.setId((short) 1);
            s.setSiteName("StorySite");
            return siteSettingsRepository.save(s);
        });
        SeoOrganization organization = new SeoOrganization();
        organization.setName(settings.getSiteName() == null ? "StorySite" : settings.getSiteName());
        organization.setLegalName(organization.getName());
        organization.setUrl(trimTrailingSlash(baseUrl));
        return seoOrganizationRepository.save(organization);
    }

    private void upsertBreadcrumb(Story story, String canonicalUrl) {
        SeoBreadcrumbList list = seoBreadcrumbListRepository.findTopByPageTypeAndPageRefId("story", story.getId())
                .orElseGet(SeoBreadcrumbList::new);
        list.setPageType("story");
        list.setPageRefId(story.getId());
        list.setCanonicalUrl(canonicalUrl);
        SeoBreadcrumbList saved = seoBreadcrumbListRepository.save(list);

        seoBreadcrumbItemRepository.deleteByBreadcrumbListId(saved.getId());
        seoBreadcrumbItemRepository.flush();
        List<SeoBreadcrumbItem> items = new ArrayList<>();
        items.add(buildBreadcrumbItem(saved, 1, "Trang chủ", trimTrailingSlash(baseUrl)));
        items.add(buildBreadcrumbItem(saved, 2, story.getTitle(), canonicalUrl));
        seoBreadcrumbItemRepository.saveAll(items);
    }

    private SeoBreadcrumbItem buildBreadcrumbItem(SeoBreadcrumbList list, int position, String name, String url) {
        SeoBreadcrumbItem item = new SeoBreadcrumbItem();
        item.setBreadcrumbList(list);
        item.setPosition(position);
        item.setName(name);
        item.setItemUrl(url);
        return item;
    }

    private List<String> resolveCategoryNames(UUID storyId) {
        List<UUID> categoryIds = storyCategoryRepository.findCategoryIdsByStoryId(storyId);
        if (categoryIds == null || categoryIds.isEmpty()) {
            return List.of();
        }
        return categoryRepository.findAllById(categoryIds).stream()
                .map(Category::getName)
                .filter(name -> name != null && !name.isBlank())
                .toList();
    }

    private String buildCanonicalUrl(String slug) {
        String base = trimTrailingSlash(baseUrl);
        String safeSlug = slug == null ? "" : slug.trim();
        return base + "/stories/" + safeSlug;
    }

    private String trimTrailingSlash(String value) {
        if (value == null || value.isBlank()) return "";
        return value.endsWith("/") ? value.substring(0, value.length() - 1) : value;
    }

    private String trimDescription(String text) {
        if (text == null) return null;
        String cleaned = text.replaceAll("\\s+", " ").trim();
        if (cleaned.length() <= META_DESCRIPTION_LIMIT) {
            return cleaned;
        }
        return cleaned.substring(0, META_DESCRIPTION_LIMIT).trim();
    }
}
