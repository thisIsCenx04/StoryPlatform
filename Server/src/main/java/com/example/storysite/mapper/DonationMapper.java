package com.example.storysite.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import com.example.storysite.dto.donation.DonationRequest;
import com.example.storysite.dto.donation.DonationResponse;
import com.example.storysite.entity.Donation;

@Mapper(componentModel = "spring")
public interface DonationMapper {
    DonationMapper INSTANCE = Mappers.getMapper(DonationMapper.class);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Donation toEntity(DonationRequest request);

    DonationResponse toResponse(Donation donation);
}
