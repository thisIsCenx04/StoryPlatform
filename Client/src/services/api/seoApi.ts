import { buildApiUrl } from '../../config/apiConfig'
import type { SeoArticle, SeoBreadcrumbList, SeoOrganization } from '../../types/seo'

export const seoApi = {
  async getOrganization(): Promise<SeoOrganization> {
    const res = await fetch(buildApiUrl('/api/seo/organization'))
    if (!res.ok) throw new Error('Không thể tải SEO organization')
    return (await res.json()) as SeoOrganization
  },
  async getArticle(storySlug: string): Promise<SeoArticle> {
    const res = await fetch(buildApiUrl(`/api/seo/article/${storySlug}`))
    if (!res.ok) throw new Error('Không thể tải SEO article')
    return (await res.json()) as SeoArticle
  },
  async getBreadcrumb(params: { pageType?: string; refId?: string; canonicalUrl?: string }): Promise<SeoBreadcrumbList> {
    const query = new URLSearchParams()
    if (params.pageType) query.append('pageType', params.pageType)
    if (params.refId) query.append('refId', params.refId)
    if (params.canonicalUrl) query.append('canonicalUrl', params.canonicalUrl)
    const res = await fetch(buildApiUrl(`/api/seo/breadcrumb?${query.toString()}`))
    if (!res.ok) throw new Error('Không thể tải breadcrumb')
    return (await res.json()) as SeoBreadcrumbList
  },
}
