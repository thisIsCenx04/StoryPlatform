package com.example.storysite.dto.story;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import com.example.storysite.entity.StoryStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StoryResponse {
    private UUID id;
    private String slug;
    private String title;
    private String coverImageUrl;
    private String authorName;
    private String shortDescription;
    private StoryStatus storyStatus;
    private Integer totalChapters;
    private boolean hot;
    private boolean recommended;
    private OffsetDateTime recommendedAt;
    private Long viewCount;
    private Long likeCount;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    private OffsetDateTime publishedAt;
    private List<UUID> categoryIds;
    private List<StorySummarySectionDto> summarySections;
}
