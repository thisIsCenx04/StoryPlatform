package com.example.storysite.entity;

import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "site_settings")
public class SiteSettings {

    @Id
    private Short id = 1;

    @Column(name = "site_name", length = 200)
    private String siteName;

    @Column(name = "admin_hidden_login_path", length = 255)
    private String adminHiddenLoginPath;

    @Column(name = "logo_url", columnDefinition = "text")
    private String logoUrl;

    @Column(name = "copy_protection_enabled", nullable = false)
    private boolean copyProtectionEnabled = true;

    @Column(name = "scraping_protection_enabled", nullable = false)
    private boolean scrapingProtectionEnabled = true;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @PrePersist
    void onCreate() {
        OffsetDateTime now = OffsetDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }
}
