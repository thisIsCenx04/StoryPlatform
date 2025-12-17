package com.example.storysite.mapper;

import java.util.List;
import java.util.UUID;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import com.example.storysite.dto.story.StoryRequest;
import com.example.storysite.dto.story.StoryResponse;
import com.example.storysite.dto.story.StorySummarySectionDto;
import com.example.storysite.entity.Category;
import com.example.storysite.entity.Story;
import com.example.storysite.entity.StoryCategory;
import com.example.storysite.entity.StorySummarySection;

@Mapper(componentModel = "spring")
public interface StoryMapper {
    StoryMapper INSTANCE = Mappers.getMapper(StoryMapper.class);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "recommendedAt", ignore = true)
    @Mapping(target = "viewCount", constant = "0L")
    @Mapping(target = "likeCount", constant = "0L")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "publishedAt", ignore = true)
    @Mapping(target = "categories", ignore = true)
    @Mapping(target = "summarySections", ignore = true)
    @Mapping(target = "seoArticle", ignore = true)
    Story toEntity(StoryRequest request);

    @Mapping(target = "categoryIds", ignore = true)
    @Mapping(target = "summarySections", source = "summarySections")
    StoryResponse toResponse(Story story);

    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "story", ignore = true)
    @Mapping(target = "id", ignore = true)
    StorySummarySection toEntity(StorySummarySectionDto dto);

    StorySummarySectionDto toDto(StorySummarySection entity);

    @AfterMapping
    default void fillCategories(Story story, StoryRequest request) {
        story.getCategories().clear();
        if (request.getCategoryIds() != null) {
            for (UUID categoryId : request.getCategoryIds()) {
                StoryCategory link = new StoryCategory();
                link.setId(new StoryCategory.StoryCategoryId());
                link.getId().setStoryId(story.getId());
                link.getId().setCategoryId(categoryId);
                Category category = new Category();
                category.setId(categoryId);
                link.setCategory(category);
                link.setStory(story);
                story.getCategories().add(link);
            }
        }
    }

    @AfterMapping
    default void fillResponseCategoryIds(@MappingTarget StoryResponse response, Story story) {
        if (story.getCategories() != null) {
            response.setCategoryIds(story.getCategories().stream()
                    .map(sc -> sc.getCategory().getId())
                    .toList());
        }
    }

    default List<StorySummarySection> toSummaryEntities(List<StorySummarySectionDto> dtos, Story story) {
        if (dtos == null) {
            return List.of();
        }
        return dtos.stream().map(dto -> {
            StorySummarySection section = toEntity(dto);
            section.setStory(story);
            return section;
        }).toList();
    }
}
