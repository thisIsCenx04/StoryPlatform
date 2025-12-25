package com.example.storysite.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.storysite.entity.StoryCategory;
import com.example.storysite.entity.StoryCategory.StoryCategoryId;

@Repository
public interface StoryCategoryRepository extends JpaRepository<StoryCategory, StoryCategoryId> {
    void deleteByStoryId(UUID storyId);

    @Query("select sc.id.categoryId from StoryCategory sc where sc.id.storyId = :storyId")
    java.util.List<UUID> findCategoryIdsByStoryId(@Param("storyId") UUID storyId);
}
