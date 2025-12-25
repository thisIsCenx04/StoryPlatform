package com.example.storysite.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.storysite.entity.Story;

@Repository
public interface StoryRepository extends JpaRepository<Story, UUID> {
    Optional<Story> findBySlug(String slug);
    List<Story> findByHotTrue();
    List<Story> findByRecommendedTrue();
    List<Story> findByViewCountGreaterThanEqual(Long viewCount);
    List<Story> findDistinctByCategoriesCategorySlug(String slug);

    @Modifying
    @Query("update Story s set s.viewCount = coalesce(s.viewCount, 0) + 1 where s.slug = :slug")
    int incrementViewCountBySlug(@Param("slug") String slug);

    @Query("select s.viewCount from Story s where s.slug = :slug")
    Optional<Long> findViewCountBySlug(@Param("slug") String slug);

    @Modifying
    @Query("update Story s set s.hot = true where s.slug = :slug and s.hot = false")
    int markHotBySlug(@Param("slug") String slug);
}
