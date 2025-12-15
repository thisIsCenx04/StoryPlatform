package com.example.storysite.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.storysite.entity.StoryCategory;
import com.example.storysite.entity.StoryCategory.StoryCategoryId;

@Repository
public interface StoryCategoryRepository extends JpaRepository<StoryCategory, StoryCategoryId> {
    void deleteByStoryId(UUID storyId);
}
