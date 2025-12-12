package com.example.storysite.entity;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.ManyToOne;
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
@Table(name = "seo_articles")
public class SeoArticle {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "story_id", nullable = false, unique = true)
    private Story story;

    @Column(name = "canonical_url", nullable = false, columnDefinition = "text")
    private String canonicalUrl;

    @Column(nullable = false, length = 200)
    private String headline;

    @Column(name = "meta_description", columnDefinition = "text")
    private String metaDescription;

    @Column(name = "meta_keywords", columnDefinition = "text[]")
    private List<String> metaKeywords;

    @Column(name = "image_url", columnDefinition = "text")
    private String imageUrl;

    @Column(name = "date_published")
    private OffsetDateTime datePublished;

    @Column(name = "date_modified")
    private OffsetDateTime dateModified;

    @Column(name = "author_name", length = 150)
    private String authorName;

    @ManyToOne
    @JoinColumn(name = "publisher_organization_id")
    private SeoOrganization publisherOrganization;

    @Column(name = "article_section", length = 150)
    private String articleSection;

    @Column(name = "article_tags", columnDefinition = "text[]")
    private List<String> articleTags;

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
