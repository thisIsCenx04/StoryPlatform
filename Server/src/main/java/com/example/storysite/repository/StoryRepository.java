package com.example.storysite.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.storysite.entity.Story;

@Repository
public interface StoryRepository extends JpaRepository<Story, UUID> {
    Optional<Story> findBySlug(String slug);
    List<Story> findByHotTrue();
    List<Story> findByRecommendedTrue();
    List<Story> findDistinctByCategoriesCategorySlug(String slug);
}
