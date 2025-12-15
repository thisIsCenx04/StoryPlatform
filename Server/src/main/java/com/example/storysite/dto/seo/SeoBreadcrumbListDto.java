package com.example.storysite.dto.seo;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SeoBreadcrumbListDto {
    private String canonicalUrl;
    private String pageType;
    private List<SeoBreadcrumbItemDto> items;
}
