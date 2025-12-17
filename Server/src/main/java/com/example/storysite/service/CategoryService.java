package com.example.storysite.service;

import java.util.List;
import java.util.UUID;
import java.text.Normalizer;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.storysite.dto.category.CategoryRequest;
import com.example.storysite.dto.category.CategoryResponse;
import com.example.storysite.entity.Category;
import com.example.storysite.exception.BadRequestException;
import com.example.storysite.exception.ResourceNotFoundException;
import com.example.storysite.mapper.CategoryMapper;
import com.example.storysite.repository.CategoryRepository;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public CategoryService(CategoryRepository categoryRepository, CategoryMapper categoryMapper) {
        this.categoryRepository = categoryRepository;
        this.categoryMapper = categoryMapper;
    }

    public List<CategoryResponse> listAll() {
        return categoryRepository.findAll().stream()
                .map(categoryMapper::toResponse)
                .toList();
    }

    public CategoryResponse findBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        return categoryMapper.toResponse(category);
    }

    @Transactional
    public CategoryResponse create(CategoryRequest request) {
        Category category = categoryMapper.toEntity(request);
        category.setSlug(generateUniqueSlug(request.getName()));
        Category saved = categoryRepository.save(category);
        return categoryMapper.toResponse(saved);
    }

    @Transactional
    public CategoryResponse update(UUID id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        category.setName(request.getName());
        category.setSlug(generateUniqueSlug(request.getName(), category.getId()));
        return categoryMapper.toResponse(categoryRepository.save(category));
    }

    @Transactional
    public void delete(UUID id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found");
        }
        categoryRepository.deleteById(id);
    }

    private String generateUniqueSlug(String name) {
        return generateUniqueSlug(name, null);
    }

    private String generateUniqueSlug(String name, UUID currentId) {
        String base = toSlug(name);
        String slug = base;
        int counter = 1;
        while (true) {
            boolean exists = categoryRepository.existsBySlug(slug) &&
                    (currentId == null || categoryRepository.findBySlug(slug).map(c -> !c.getId().equals(currentId)).orElse(false));
            if (!exists) {
                return slug;
            }
            slug = base + "-" + counter;
            counter++;
        }
    }

    private String toSlug(String input) {
        if (input == null) {
            return "";
        }
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        String withoutDiacritics = Pattern.compile("\\p{M}+").matcher(normalized).replaceAll("");
        String slug = withoutDiacritics.trim().toLowerCase()
                .replaceAll("\\s+", "-")
                .replaceAll("-{2,}", "-")
                .replaceAll("^-+|-+$", "");
        return slug.isBlank() ? "category" : slug;
    }
}
