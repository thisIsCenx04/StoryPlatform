package com.example.storysite.dto.seo;

import java.time.OffsetDateTime;
import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SeoArticleDto {
    private String canonicalUrl;
    private String headline;
    private String metaDescription;
    private List<String> metaKeywords;
    private String imageUrl;
    private OffsetDateTime datePublished;
    private OffsetDateTime dateModified;
    private String authorName;
    private String articleSection;
    private List<String> articleTags;
    private String publisherName;
    private String publisherLogo;
}
