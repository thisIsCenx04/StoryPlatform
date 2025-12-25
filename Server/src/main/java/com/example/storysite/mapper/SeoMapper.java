package com.example.storysite.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import com.example.storysite.dto.seo.SeoArticleDto;
import com.example.storysite.dto.seo.SeoBreadcrumbItemDto;
import com.example.storysite.dto.seo.SeoBreadcrumbListDto;
import com.example.storysite.dto.seo.SeoOrganizationDto;
import com.example.storysite.entity.SeoArticle;
import com.example.storysite.entity.SeoBreadcrumbItem;
import com.example.storysite.entity.SeoBreadcrumbList;
import com.example.storysite.entity.SeoOrganization;

@Mapper(componentModel = "spring")
public interface SeoMapper {
    SeoMapper INSTANCE = Mappers.getMapper(SeoMapper.class);

    SeoOrganizationDto toDto(SeoOrganization org);

    @Mapping(target = "publisherName", source = "publisherOrganization.name")
    @Mapping(target = "publisherLogo", source = "publisherOrganization.logoUrl")
    SeoArticleDto toDto(SeoArticle article);

    @Mapping(target = "items", ignore = true)
    SeoBreadcrumbListDto toDto(SeoBreadcrumbList list);

    SeoBreadcrumbItemDto toDto(SeoBreadcrumbItem item);

    default SeoBreadcrumbListDto toDtoWithItems(SeoBreadcrumbList list, List<SeoBreadcrumbItem> items) {
        SeoBreadcrumbListDto dto = toDto(list);
        dto.setItems(items.stream().map(this::toDto).toList());
        return dto;
    }
}
