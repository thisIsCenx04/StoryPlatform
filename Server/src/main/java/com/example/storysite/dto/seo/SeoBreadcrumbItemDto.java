package com.example.storysite.dto.seo;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SeoBreadcrumbItemDto {
    private Integer position;
    private String name;
    private String itemUrl;
}
