package com.example.storysite.entity;

import java.time.OffsetDateTime;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
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
@Table(name = "stories")
public class Story {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 150)
    private String slug;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(name = "cover_image_url", columnDefinition = "text")
    private String coverImageUrl;

    @Column(name = "author_name", length = 150)
    private String authorName;

    @Column(name = "short_description", columnDefinition = "text")
    private String shortDescription;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM) // map to PostgreSQL enum story_status
    @Column(name = "story_status", nullable = false, columnDefinition = "story_status")
    private StoryStatus storyStatus = StoryStatus.ONGOING;

    @Column(name = "total_chapters", nullable = false)
    private Integer totalChapters = 0;

    @Column(name = "is_hot", nullable = false)
    private boolean hot = false;

    @Column(name = "is_recommended", nullable = false)
    private boolean recommended = false;

    @Column(name = "recommended_at")
    private OffsetDateTime recommendedAt;

    @Column(name = "view_count", nullable = false)
    private Long viewCount = 0L;

    @Column(name = "like_count", nullable = false)
    private Long likeCount = 0L;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @Column(name = "published_at")
    private OffsetDateTime publishedAt;

    @OneToMany(mappedBy = "story")
    @Builder.Default
    private Set<StoryCategory> categories = new LinkedHashSet<>();

    @OneToMany(mappedBy = "story")
    @Builder.Default
    private Set<StorySummarySection> summarySections = new LinkedHashSet<>();

    @OneToOne(mappedBy = "story")
    private SeoArticle seoArticle;

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
