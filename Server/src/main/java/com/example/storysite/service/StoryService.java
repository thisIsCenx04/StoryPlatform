package com.example.storysite.service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

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

    @Transactional
    public StoryResponse create(StoryRequest request) {
        if (storyRepository.findBySlug(request.getSlug()).isPresent()) {
            throw new BadRequestException("Slug đã tồn tại");
        }
        Story story = storyMapper.toEntity(request);
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
        if (!story.getSlug().equals(request.getSlug()) && storyRepository.findBySlug(request.getSlug()).isPresent()) {
            throw new BadRequestException("Slug đã tồn tại");
        }
        story.setSlug(request.getSlug());
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
        if (categoryIds != null) {
            for (UUID catId : categoryIds) {
                Category category = categoryRepository.findById(catId)
                        .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
                StoryCategory link = new StoryCategory();
                link.setId(new StoryCategory.StoryCategoryId(story.getId(), category.getId()));
                link.setStory(story);
                link.setCategory(category);
                storyCategoryRepository.save(link);
            }
        }
    }

    private void handleSummarySections(Story story, List<StorySummarySectionDto> summarySections) {
        summarySectionRepository.deleteByStoryId(story.getId());
        if (summarySections != null) {
            List<StorySummarySection> entities = summarySections.stream()
                    .map(dto -> {
                        StorySummarySection section = storyMapper.toEntity(dto);
                        section.setStory(story);
                        return section;
                    }).toList();
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
        return response;
    }
}
