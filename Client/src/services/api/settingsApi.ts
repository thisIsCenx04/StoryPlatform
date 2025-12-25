import { buildApiUrl } from '../../config/apiConfig'
import { authStore } from '../../store/authStore'
import type { SiteSettings } from '../../types/settings'

const authHeaders = (): Record<string, string> => {
  const user = authStore.getUser()
  return user ? { Authorization: `Bearer ${user.token}` } : {}
}

export const settingsApi = {
  async getPublicSettings(): Promise<SiteSettings> {
    const res = await fetch(buildApiUrl('/api/settings/public'))
    if (!res.ok) throw new Error('Kh00ng th69 t57i ci 0467t')
    return (await res.json()) as SiteSettings
  },
  async getAdminSettings(): Promise<SiteSettings> {
    const res = await fetch(buildApiUrl('/api/admin/settings'), { headers: authHeaders() })
    if (!res.ok) throw new Error('Kh00ng th69 t57i ci 0467t (admin)')
    return (await res.json()) as SiteSettings
  },
  async updateSettings(payload: SiteSettings): Promise<SiteSettings> {
    const res = await fetch(buildApiUrl('/api/admin/settings'), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('C67p nh67t ci 0467t th59t b55i')
    return (await res.json()) as SiteSettings
  },
}
