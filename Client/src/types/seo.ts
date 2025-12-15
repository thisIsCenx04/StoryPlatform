export interface SeoOrganization {
  name: string
  legalName?: string
  url: string
  logoUrl?: string
  contactEmail?: string
  phone?: string
  streetAddress?: string
  addressLocality?: string
  addressRegion?: string
  postalCode?: string
  addressCountry?: string
  sameAsJson?: string
}

export interface SeoArticle {
  canonicalUrl: string
  headline: string
  metaDescription?: string
  metaKeywords?: string[]
  imageUrl?: string
  datePublished?: string
  dateModified?: string
  authorName?: string
  articleSection?: string
  articleTags?: string[]
  publisherName?: string
  publisherLogo?: string
}

export interface SeoBreadcrumbItem {
  position: number
  name: string
  itemUrl: string
}

export interface SeoBreadcrumbList {
  canonicalUrl: string
  pageType?: string
  items: SeoBreadcrumbItem[]
}
