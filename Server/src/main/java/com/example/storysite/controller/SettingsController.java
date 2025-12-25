package com.example.storysite.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.storysite.dto.settings.SiteSettingsDto;
import com.example.storysite.service.SiteSettingsService;

@RestController
@RequestMapping("/api")
public class SettingsController {

    private final SiteSettingsService siteSettingsService;

    public SettingsController(SiteSettingsService siteSettingsService) {
        this.siteSettingsService = siteSettingsService;
    }

    @GetMapping("/settings/public")
    public ResponseEntity<SiteSettingsDto> getPublicSettings() {
        return ResponseEntity.ok(siteSettingsService.getPublicSettings());
    }

    @GetMapping("/admin/settings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SiteSettingsDto> getAdminSettings() {
        return ResponseEntity.ok(siteSettingsService.getAdminSettings());
    }

    @PutMapping("/admin/settings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SiteSettingsDto> updateSettings(@RequestBody SiteSettingsDto dto) {
        return ResponseEntity.ok(siteSettingsService.update(dto));
    }
}
