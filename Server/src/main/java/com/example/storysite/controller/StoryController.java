package com.example.storysite.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.storysite.dto.story.StoryResponse;
import com.example.storysite.service.StoryService;

@RestController
public class StoryController {

    private final StoryService storyService;

    public StoryController(StoryService storyService) {
        this.storyService = storyService;
    }

    @GetMapping("/api/stories")
    public ResponseEntity<List<StoryResponse>> listStories(
            @RequestParam(value = "hot", required = false) Boolean hot,
            @RequestParam(value = "recommended", required = false) Boolean recommended) {
        return ResponseEntity.ok(storyService.listPublic(hot, recommended));
    }

    @GetMapping("/api/stories/{slug}")
    public ResponseEntity<StoryResponse> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(storyService.getBySlug(slug));
    }

    @PostMapping("/api/stories/{slug}/view")
    public ResponseEntity<Long> trackView(@PathVariable String slug) {
        return ResponseEntity.ok(storyService.trackView(slug));
    }
}
