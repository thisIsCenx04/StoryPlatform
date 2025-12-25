import type { SeoBreadcrumbList } from '../types/seo'

export const createSimpleBreadcrumb = (items: { name: string; url: string }[]): SeoBreadcrumbList => ({
  canonicalUrl: items[items.length - 1]?.url ?? '',
  items: items.map((item, idx) => ({
    position: idx + 1,
    name: item.name,
    itemUrl: item.url,
  })),
})
