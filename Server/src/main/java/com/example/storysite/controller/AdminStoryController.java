package com.example.storysite.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.storysite.dto.story.StoryRequest;
import com.example.storysite.dto.story.StoryResponse;
import com.example.storysite.dto.story.StorySummarySectionDto;
import com.example.storysite.service.StoryService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/stories")
@PreAuthorize("hasRole('ADMIN')")
public class AdminStoryController {

    private final StoryService storyService;

    public AdminStoryController(StoryService storyService) {
        this.storyService = storyService;
    }

    @GetMapping
    public ResponseEntity<List<StoryResponse>> list() {
        return ResponseEntity.ok(storyService.listAdmin());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StoryResponse> getOne(@PathVariable UUID id) {
        return ResponseEntity.ok(storyService.getAdminById(id));
    }

    @PostMapping
    public ResponseEntity<StoryResponse> create(@Valid @RequestBody StoryRequest request) {
        return ResponseEntity.ok(storyService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StoryResponse> update(@PathVariable UUID id, @Valid @RequestBody StoryRequest request) {
        return ResponseEntity.ok(storyService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        storyService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/summary")
    public ResponseEntity<List<StorySummarySectionDto>> getSummary(@PathVariable UUID id) {
        return ResponseEntity.ok(storyService.getSummary(id));
    }

    @PutMapping("/{id}/summary")
    public ResponseEntity<List<StorySummarySectionDto>> updateSummary(@PathVariable UUID id,
            @RequestBody List<StorySummarySectionDto> sections) {
        return ResponseEntity.ok(storyService.updateSummary(id, sections));
    }
}
