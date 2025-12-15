package com.example.storysite.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.storysite.entity.SeoArticle;

@Repository
public interface SeoArticleRepository extends JpaRepository<SeoArticle, UUID> {
    Optional<SeoArticle> findByStorySlug(String slug);
}
