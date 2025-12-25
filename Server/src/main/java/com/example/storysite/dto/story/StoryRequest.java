package com.example.storysite.dto.story;

import java.util.List;
import java.util.UUID;

import com.example.storysite.entity.StoryStatus;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoryRequest {
    @Size(max = 150)
    private String slug;

    @NotNull
    @Size(max = 200)
    private String title;

    private String coverImageUrl;
    private String authorName;
    private String shortDescription;

    @NotNull
    private StoryStatus storyStatus;

    @NotNull
    private Integer totalChapters;

    private boolean hot;
    private boolean recommended;

    private List<UUID> categoryIds;

    private List<StorySummarySectionDto> summarySections;
}
