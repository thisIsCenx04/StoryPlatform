package com.example.storysite.service;

import java.time.OffsetDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.text.Normalizer;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.storysite.dto.story.StoryRequest;
import com.example.storysite.dto.story.StoryResponse;
import com.example.storysite.dto.story.StorySummarySectionDto;
import com.example.storysite.entity.Category;
import com.example.storysite.entity.Story;
import com.example.storysite.entity.StoryCategory;
import com.example.storysite.entity.StorySummarySection;
import com.example.storysite.exception.BadRequestException;
import com.example.storysite.exception.ResourceNotFoundException;
import com.example.storysite.mapper.StoryMapper;
import com.example.storysite.repository.CategoryRepository;
import com.example.storysite.repository.StoryCategoryRepository;
import com.example.storysite.repository.StoryRepository;
import com.example.storysite.repository.StorySummarySectionRepository;

@Service
public class StoryService {

    private final StoryRepository storyRepository;
    private final StorySummarySectionRepository summarySectionRepository;
    private final StoryCategoryRepository storyCategoryRepository;
    private final CategoryRepository categoryRepository;
    private final StoryMapper storyMapper;

    public StoryService(StoryRepository storyRepository, StorySummarySectionRepository summarySectionRepository,
            StoryCategoryRepository storyCategoryRepository, CategoryRepository categoryRepository,
            StoryMapper storyMapper) {
        this.storyRepository = storyRepository;
        this.summarySectionRepository = summarySectionRepository;
        this.storyCategoryRepository = storyCategoryRepository;
        this.categoryRepository = categoryRepository;
        this.storyMapper = storyMapper;
    }

    public List<StoryResponse> listPublic(Boolean hot, Boolean recommended) {
        List<Story> stories;
        if (Boolean.TRUE.equals(hot)) {
            stories = storyRepository.findByHotTrue();
        } else if (Boolean.TRUE.equals(recommended)) {
            stories = storyRepository.findByRecommendedTrue();
        } else {
            stories = storyRepository.findAll();
        }
        return stories.stream().map(this::toResponseWithSections).toList();
    }

    public StoryResponse getBySlug(String slug) {
        Story story = storyRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Story not found"));
        return toResponseWithSections(story);
    }

    public List<StoryResponse> listByCategorySlug(String slug) {
        return storyRepository.findDistinctByCategoriesCategorySlug(slug)
                .stream()
                .map(this::toResponseWithSections)
                .toList();
    }

    public List<StoryResponse> listAdmin() {
        return storyRepository.findAll().stream().map(this::toResponseWithSections).toList();
    }

    public StoryResponse getAdminById(UUID id) {
        Story story = storyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Story not found"));
        return toResponseWithSections(story);
    }

    @Transactional
    public Long trackView(String slug) {
        int updated = storyRepository.incrementViewCountBySlug(slug);
        if (updated == 0) {
            throw new ResourceNotFoundException("Story not found");
        }
        return storyRepository.findViewCountBySlug(slug).orElse(0L);
    }

    @Transactional
    public StoryResponse create(StoryRequest request) {
        String slug = generateUniqueSlug(request.getSlug(), request.getTitle(), null);
        Story story = storyMapper.toEntity(request);
        story.setSlug(slug);
        if (request.isRecommended()) {
            story.setRecommendedAt(OffsetDateTime.now());
        }
        Story saved = storyRepository.save(story);
        handleCategories(saved, request.getCategoryIds());
        handleSummarySections(saved, request.getSummarySections());
        return toResponseWithSections(saved);
    }

    @Transactional
    public StoryResponse update(UUID id, StoryRequest request) {
        Story story = storyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Story not found"));
        String slug = generateUniqueSlug(request.getSlug(), request.getTitle(), story.getId());
        story.setSlug(slug);
        story.setTitle(request.getTitle());
        story.setCoverImageUrl(request.getCoverImageUrl());
        story.setAuthorName(request.getAuthorName());
        story.setShortDescription(request.getShortDescription());
        story.setStoryStatus(request.getStoryStatus());
        story.setTotalChapters(request.getTotalChapters());
        story.setHot(request.isHot());
        story.setRecommended(request.isRecommended());
        story.setRecommendedAt(request.isRecommended() ? OffsetDateTime.now() : null);

        Story saved = storyRepository.save(story);

        handleCategories(saved, request.getCategoryIds());
        handleSummarySections(saved, request.getSummarySections());

        return toResponseWithSections(saved);
    }

    @Transactional
    public void delete(UUID id) {
        Story story = storyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Story not found"));
        storyCategoryRepository.deleteByStoryId(story.getId());
        summarySectionRepository.deleteByStoryId(story.getId());
        storyRepository.delete(story);
    }

    private void handleCategories(Story story, List<UUID> categoryIds) {
        storyCategoryRepository.deleteByStoryId(story.getId());
        story.getCategories().clear();
        if (categoryIds != null) {
            for (UUID catId : categoryIds) {
                Category category = categoryRepository.findById(catId)
                        .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
                StoryCategory link = new StoryCategory();
                link.setId(new StoryCategory.StoryCategoryId(story.getId(), category.getId()));
                link.setStory(story);
                link.setCategory(category);
                storyCategoryRepository.save(link);
                story.getCategories().add(link);
            }
        }
    }

    private void handleSummarySections(Story story, List<StorySummarySectionDto> summarySections) {
        summarySectionRepository.deleteByStoryId(story.getId());
        summarySectionRepository.flush();
        if (summarySections != null) {
            List<StorySummarySection> entities = normalizeSections(summarySections, story);
            summarySectionRepository.saveAll(entities);
        }
    }

    private StoryResponse toResponseWithSections(Story story) {
        StoryResponse response = storyMapper.toResponse(story);
        List<StorySummarySectionDto> sections = summarySectionRepository.findByStoryIdOrderBySortOrderAsc(story.getId())
                .stream()
                .map(storyMapper::toDto)
                .toList();
        response.setSummarySections(sections);
        response.setCategoryIds(storyCategoryRepository.findCategoryIdsByStoryId(story.getId()));
        return response;
    }

    public List<StorySummarySectionDto> getSummary(UUID storyId) {
        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new ResourceNotFoundException("Story not found"));
        return summarySectionRepository.findByStoryIdOrderBySortOrderAsc(story.getId())
                .stream()
                .map(storyMapper::toDto)
                .toList();
    }

    @Transactional
    public List<StorySummarySectionDto> updateSummary(UUID storyId, List<StorySummarySectionDto> sections) {
        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new ResourceNotFoundException("Story not found"));
        summarySectionRepository.deleteByStoryId(story.getId());
        summarySectionRepository.flush();
        if (sections != null) {
            List<StorySummarySection> entities = normalizeSections(sections, story);
            summarySectionRepository.saveAll(entities);
        }
        return getSummary(storyId);
    }

    private String generateUniqueSlug(String requestedSlug, String title, UUID currentId) {
        String base = (requestedSlug == null || requestedSlug.isBlank()) ? toSlug(title) : requestedSlug.trim().toLowerCase();
        if (base.isBlank()) {
            base = "story";
        }
        String slug = base;
        int counter = 1;
        while (true) {
            var existing = storyRepository.findBySlug(slug);
            if (existing.isEmpty() || (currentId != null && existing.get().getId().equals(currentId))) {
                return slug;
            }
            slug = base + "-" + counter;
            counter++;
        }
    }

    private String toSlug(String input) {
        if (input == null) return "";
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        String withoutDiacritics = Pattern.compile("\\p{M}+").matcher(normalized).replaceAll("");
        return withoutDiacritics.trim()
                .toLowerCase()
                .replaceAll("\\s+", "-")
                .replaceAll("-{2,}", "-")
                .replaceAll("^-+|-+$", "");
    }

    private List<StorySummarySection> normalizeSections(List<StorySummarySectionDto> sections, Story story) {
        AtomicInteger counter = new AtomicInteger(1);
        return sections.stream()
                .sorted(Comparator.comparing(StorySummarySectionDto::getSortOrder, Comparator.nullsLast(Integer::compareTo)))
                .map(dto -> {
                    StorySummarySection section = storyMapper.toEntity(dto);
                    section.setId(null);
                    section.setSortOrder(counter.getAndIncrement());
                    section.setStory(story);
                    return section;
                })
                .toList();
    }
}
