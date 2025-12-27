import { buildApiUrl } from '../../config/apiConfig'
import { authStore } from '../../store/authStore'
import type { SiteSettings } from '../../types/settings'
import { cachedGetJson, invalidateCache } from './requestCache'

const authHeaders = (): Record<string, string> => {
  const user = authStore.getUser()
  return user ? { Authorization: `Bearer ${user.token}` } : {}
}

const readError = async (res: Response) => {
  const text = await res.text().catch(() => '')
  return text || 'Không thể xử lý yêu cầu'
}

export const settingsApi = {
  async getPublicSettings(): Promise<SiteSettings> {
    return cachedGetJson(buildApiUrl('/api/settings/public'), {
      ttlMs: 5 * 60 * 1000,
      errorMessage: 'Không tải được cài đặt',
    })
  },
  async getAdminSettings(): Promise<SiteSettings> {
    const res = await fetch(buildApiUrl('/api/admin/settings'), { headers: authHeaders() })
    if (!res.ok) throw new Error(await readError(res))
    return (await res.json()) as SiteSettings
  },
  async updateSettings(payload: SiteSettings): Promise<SiteSettings> {
    const res = await fetch(buildApiUrl('/api/admin/settings'), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(await readError(res))
    const data = (await res.json()) as SiteSettings
    invalidateCache(buildApiUrl('/api/settings/public'))
    return data
  },
}
