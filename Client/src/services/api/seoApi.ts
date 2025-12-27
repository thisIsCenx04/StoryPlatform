import { buildApiUrl } from '../../config/apiConfig'
import type { SeoArticle, SeoBreadcrumbList, SeoOrganization } from '../../types/seo'
import { cachedGetJson } from './requestCache'

const parseNullableJson = async <T>(res: Response): Promise<T | null> => {
  if (res.status === 204) return null
  return (await res.json()) as T
}

export const seoApi = {
  async getOrganization(): Promise<SeoOrganization | null> {
    return cachedGetJson(buildApiUrl('/api/seo/organization'), {
      ttlMs: 10 * 60 * 1000,
      parse: (res) => parseNullableJson<SeoOrganization>(res),
      errorMessage: 'Không tải được dữ liệu SEO organization',
    })
  },
  async getArticle(storySlug: string): Promise<SeoArticle | null> {
    return cachedGetJson(buildApiUrl(`/api/seo/article/${storySlug}`), {
      ttlMs: 10 * 60 * 1000,
      parse: (res) => parseNullableJson<SeoArticle>(res),
      errorMessage: 'Không tải được SEO article',
    })
  },
  async getBreadcrumb(params: { pageType?: string; refId?: string; canonicalUrl?: string }): Promise<SeoBreadcrumbList | null> {
    const query = new URLSearchParams()
    if (params.pageType) query.append('pageType', params.pageType)
    if (params.refId) query.append('refId', params.refId)
    if (params.canonicalUrl) query.append('canonicalUrl', params.canonicalUrl)
    return cachedGetJson(buildApiUrl(`/api/seo/breadcrumb?${query.toString()}`), {
      ttlMs: 10 * 60 * 1000,
      parse: (res) => parseNullableJson<SeoBreadcrumbList>(res),
      errorMessage: 'Không tải được breadcrumb',
    })
  },
}
