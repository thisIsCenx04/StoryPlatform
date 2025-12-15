package com.example.storysite.dto.story;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StorySummarySectionDto {
    private UUID id;

    @NotNull
    private Integer sortOrder;

    private String textContent;
    private String imageUrl;
}
