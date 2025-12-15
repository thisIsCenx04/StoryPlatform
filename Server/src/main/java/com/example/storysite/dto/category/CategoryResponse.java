package com.example.storysite.dto.category;

import java.time.OffsetDateTime;
import java.util.UUID;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CategoryResponse {
    private UUID id;
    private String name;
    private String slug;
    private String description;
    private UUID parentId;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
