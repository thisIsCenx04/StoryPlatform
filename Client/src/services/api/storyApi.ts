import { buildApiUrl } from '../../config/apiConfig'
import type { Story, StoryRequestPayload, StorySummarySection } from '../../types/story'
import { authStore } from '../../store/authStore'
import { cachedGetJson, invalidateCache } from './requestCache'

const authHeaders = (): Record<string, string> => {
  const user = authStore.getUser()
  return user ? { Authorization: `Bearer ${user.token}` } : {}
}

export const storyApi = {
  async list(params?: { hot?: boolean; recommended?: boolean }): Promise<Story[]> {
    const query = new URLSearchParams()
    if (params?.hot) query.append('hot', 'true')
    if (params?.recommended) query.append('recommended', 'true')
    const url = buildApiUrl(`/api/stories${query.toString() ? `?${query.toString()}` : ''}`)
    return cachedGetJson(url, {
      ttlMs: 30 * 1000,
      errorMessage: 'Không thể tải danh sách truyện',
    })
  },

  async getBySlug(slug: string): Promise<Story> {
    const url = buildApiUrl(`/api/stories/${slug}`)
    return cachedGetJson(url, {
      ttlMs: 30 * 1000,
      errorMessage: 'Không tìm thấy truyện',
    })
  },

  async trackView(slug: string): Promise<number | null> {
    const res = await fetch(buildApiUrl(`/api/stories/${slug}/view`), { method: 'POST' })
    if (!res.ok) return null
    const val = await res.json()
    return typeof val === 'number' ? val : null
  },

  async adminList(): Promise<Story[]> {
    const res = await fetch(buildApiUrl('/api/admin/stories'), { headers: authHeaders() })
    if (!res.ok) throw new Error('Không thể tải danh sách truyện (admin)')
    return (await res.json()) as Story[]
  },

  async adminGet(id: string): Promise<Story> {
    const res = await fetch(buildApiUrl(`/api/admin/stories/${id}`), { headers: authHeaders() })
    if (!res.ok) throw new Error('Không tìm thấy truyện')
    return (await res.json()) as Story
  },

  async create(payload: StoryRequestPayload): Promise<Story> {
    const res = await fetch(buildApiUrl('/api/admin/stories'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Tạo truyện thất bại')
    const data = (await res.json()) as Story
    invalidateCache(buildApiUrl('/api/stories'))
    return data
  },

  async update(id: string, payload: StoryRequestPayload): Promise<Story> {
    const res = await fetch(buildApiUrl(`/api/admin/stories/${id}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Cập nhật truyện thất bại')
    const data = (await res.json()) as Story
    invalidateCache(buildApiUrl('/api/stories'))
    invalidateCache(buildApiUrl(`/api/stories/${id}`))
    return data
  },

  async remove(id: string): Promise<void> {
    const res = await fetch(buildApiUrl(`/api/admin/stories/${id}`), {
      method: 'DELETE',
      headers: authHeaders(),
    })
    if (!res.ok) throw new Error('Xóa truyện thất bại')
    invalidateCache(buildApiUrl('/api/stories'))
  },

  async getSummary(id: string) {
    const res = await fetch(buildApiUrl(`/api/admin/stories/${id}/summary`), { headers: authHeaders() })
    if (!res.ok) throw new Error('Không tải được tóm tắt')
    return (await res.json()) as StorySummarySection[]
  },

  async updateSummary(id: string, sections: StorySummarySection[]) {
    const res = await fetch(buildApiUrl(`/api/admin/stories/${id}/summary`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(sections),
    })
    if (!res.ok) throw new Error('Cập nhật tóm tắt thất bại')
    return (await res.json()) as StorySummarySection[]
  },
}
