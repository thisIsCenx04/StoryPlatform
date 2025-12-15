package com.example.storysite.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import com.example.storysite.dto.settings.SiteSettingsDto;
import com.example.storysite.entity.SiteSettings;

@Mapper(componentModel = "spring")
public interface SettingsMapper {
    SettingsMapper INSTANCE = Mappers.getMapper(SettingsMapper.class);

    SiteSettingsDto toDto(SiteSettings settings);

    void updateEntity(SiteSettingsDto dto, @MappingTarget SiteSettings entity);
}
