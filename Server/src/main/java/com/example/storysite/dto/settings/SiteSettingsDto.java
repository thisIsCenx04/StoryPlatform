package com.example.storysite.dto.settings;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SiteSettingsDto {
    private String siteName;
    private String adminHiddenLoginPath;
    private boolean copyProtectionEnabled;
    private boolean scrapingProtectionEnabled;
}
