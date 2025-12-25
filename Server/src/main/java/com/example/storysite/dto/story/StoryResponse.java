package com.example.storysite.dto.story;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoryResponse {
    private UUID id;
    private String slug;
    private String title;
    private String coverImageUrl;
    private String authorName;
    private String shortDescription;
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
