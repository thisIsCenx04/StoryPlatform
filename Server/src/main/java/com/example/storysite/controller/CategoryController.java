package com.example.storysite.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.storysite.dto.category.CategoryResponse;
import com.example.storysite.dto.story.StoryResponse;
import com.example.storysite.service.CategoryService;
import com.example.storysite.service.StoryService;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;
    private final StoryService storyService;

    public CategoryController(CategoryService categoryService, StoryService storyService) {
        this.categoryService = categoryService;
        this.storyService = storyService;
    }

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> list() {
        return ResponseEntity.ok(categoryService.listAll());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<CategoryResponse> get(@PathVariable String slug) {
        return ResponseEntity.ok(categoryService.findBySlug(slug));
    }

    @GetMapping("/{slug}/stories")
    public ResponseEntity<List<StoryResponse>> storiesByCategory(@PathVariable String slug) {
        return ResponseEntity.ok(storyService.listByCategorySlug(slug));
    }
}
