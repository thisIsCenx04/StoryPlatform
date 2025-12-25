package com.example.storysite.dto.story;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StorySummarySectionDto {
    private UUID id;

    @NotNull
    private Integer sortOrder;

    private String textContent;
    private String imageUrl;
}
