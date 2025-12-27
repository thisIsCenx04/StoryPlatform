package com.example.storysite.dto.settings;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SiteSettingsDto {
    private String siteName;
    private String adminHiddenLoginPath;
    private String logoUrl;
    private boolean copyProtectionEnabled;
    private boolean scrapingProtectionEnabled;
}
