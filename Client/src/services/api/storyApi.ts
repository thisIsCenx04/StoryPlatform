import { buildApiUrl } from '../../config/apiConfig'
import type { Story, StoryRequestPayload, StorySummarySection } from '../../types/story'
import { authStore } from '../../store/authStore'

const authHeaders = (): Record<string, string> => {
  const user = authStore.getUser()
  return user ? { Authorization: `Bearer ${user.token}` } : {}
}

export const storyApi = {
  async list(params?: { hot?: boolean; recommended?: boolean }): Promise<Story[]> {
    const query = new URLSearchParams()
    if (params?.hot) query.append('hot', 'true')
    if (params?.recommended) query.append('recommended', 'true')
    const res = await fetch(buildApiUrl(`/api/stories${query.toString() ? `?${query.toString()}` : ''}`))
    if (!res.ok) throw new Error('Không th? t?i danh sách truy?n')
    return (await res.json()) as Story[]
  },

  async getBySlug(slug: string): Promise<Story> {
    const res = await fetch(buildApiUrl(`/api/stories/${slug}`))
    if (!res.ok) throw new Error('Không tìm th?y truy?n')
    return (await res.json()) as Story
  },

  async adminList(): Promise<Story[]> {
    const res = await fetch(buildApiUrl('/api/admin/stories'), { headers: authHeaders() })
    if (!res.ok) throw new Error('Không th? t?i danh sách truy?n (admin)')
    return (await res.json()) as Story[]
  },

  async adminGet(id: string): Promise<Story> {
    const res = await fetch(buildApiUrl(`/api/admin/stories/${id}`), { headers: authHeaders() })
    if (!res.ok) throw new Error('Không tìm th?y truy?n')
    return (await res.json()) as Story
  },

  async create(payload: StoryRequestPayload): Promise<Story> {
    const res = await fetch(buildApiUrl('/api/admin/stories'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('T?o truy?n th?t b?i')
    return (await res.json()) as Story
  },

  async update(id: string, payload: StoryRequestPayload): Promise<Story> {
    const res = await fetch(buildApiUrl(`/api/admin/stories/${id}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('C?p nh?t truy?n th?t b?i')
    return (await res.json()) as Story
  },

  async remove(id: string): Promise<void> {
    const res = await fetch(buildApiUrl(`/api/admin/stories/${id}`), {
      method: 'DELETE',
      headers: authHeaders(),
    })
    if (!res.ok) throw new Error('Xóa truy?n th?t b?i')
  },

  async getSummary(id: string) {
    const res = await fetch(buildApiUrl(`/api/admin/stories/${id}/summary`), { headers: authHeaders() })
    if (!res.ok) throw new Error('Không t?i du?c tóm t?t')
    return (await res.json()) as StorySummarySection[]
  },

  async updateSummary(id: string, sections: StorySummarySection[]) {
    const res = await fetch(buildApiUrl(`/api/admin/stories/${id}/summary`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(sections),
    })
    if (!res.ok) throw new Error('C?p nh?t tóm t?t th?t b?i')
    return (await res.json()) as StorySummarySection[]
  },
}