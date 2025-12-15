package com.example.storysite.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.storysite.dto.seo.SeoArticleDto;
import com.example.storysite.dto.seo.SeoBreadcrumbListDto;
import com.example.storysite.dto.seo.SeoOrganizationDto;
import com.example.storysite.service.SeoService;

@RestController
public class SeoController {

    private final SeoService seoService;

    public SeoController(SeoService seoService) {
        this.seoService = seoService;
    }

    @GetMapping("/api/seo/organization")
    public ResponseEntity<SeoOrganizationDto> organization() {
        return ResponseEntity.ok(seoService.getOrganization());
    }

    @GetMapping("/api/seo/article/{slug}")
    public ResponseEntity<SeoArticleDto> article(@PathVariable String slug) {
        return ResponseEntity.ok(seoService.getArticleByStorySlug(slug));
    }

    @GetMapping("/api/seo/breadcrumb")
    public ResponseEntity<SeoBreadcrumbListDto> breadcrumb(
            @RequestParam(required = false) String pageType,
            @RequestParam(required = false) UUID refId,
            @RequestParam(required = false) String canonicalUrl) {
        return ResponseEntity.ok(seoService.getBreadcrumb(pageType, refId, canonicalUrl));
    }
}
