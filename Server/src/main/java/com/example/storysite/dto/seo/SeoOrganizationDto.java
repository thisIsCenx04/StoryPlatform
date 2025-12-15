package com.example.storysite.dto.seo;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SeoOrganizationDto {
    private String name;
    private String legalName;
    private String url;
    private String logoUrl;
    private String contactEmail;
    private String phone;
    private String streetAddress;
    private String addressLocality;
    private String addressRegion;
    private String postalCode;
    private String addressCountry;
    private String sameAsJson;
}
