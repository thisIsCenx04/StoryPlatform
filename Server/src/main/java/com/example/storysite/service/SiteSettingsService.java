package com.example.storysite.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.storysite.dto.settings.SiteSettingsDto;
import com.example.storysite.entity.SiteSettings;
import com.example.storysite.mapper.SettingsMapper;
import com.example.storysite.repository.SiteSettingsRepository;

@Service
public class SiteSettingsService {

    private final SiteSettingsRepository siteSettingsRepository;
    private final SettingsMapper settingsMapper;

    public SiteSettingsService(SiteSettingsRepository siteSettingsRepository, SettingsMapper settingsMapper) {
        this.siteSettingsRepository = siteSettingsRepository;
        this.settingsMapper = settingsMapper;
    }

    public SiteSettingsDto getPublicSettings() {
        SiteSettings settings = siteSettingsRepository.findById((short) 1).orElseGet(this::defaultSettings);
        return settingsMapper.toDto(settings);
    }

    public SiteSettingsDto getAdminSettings() {
        return getPublicSettings();
    }

    @Transactional
    public SiteSettingsDto update(SiteSettingsDto dto) {
        if (dto == null) {
            return getAdminSettings();
        }
        SiteSettings settings = siteSettingsRepository.findById((short) 1).orElseGet(this::defaultSettings);
        if (dto.getSiteName() != null) {
            settings.setSiteName(dto.getSiteName());
        }
        if (dto.getAdminHiddenLoginPath() != null && !dto.getAdminHiddenLoginPath().isBlank()) {
            settings.setAdminHiddenLoginPath(dto.getAdminHiddenLoginPath());
        }
        settings.setCopyProtectionEnabled(dto.isCopyProtectionEnabled());
        settings.setScrapingProtectionEnabled(dto.isScrapingProtectionEnabled());
        siteSettingsRepository.save(settings);
        return settingsMapper.toDto(settings);
    }

    private SiteSettings defaultSettings() {
        SiteSettings s = new SiteSettings();
        s.setId((short) 1);
        s.setSiteName("StorySite");
        s.setAdminHiddenLoginPath("/__internal__/auth/login");
        s.setCopyProtectionEnabled(true);
        s.setScrapingProtectionEnabled(true);
        return siteSettingsRepository.save(s);
    }
}
