import { buildApiUrl } from '../../config/apiConfig'
import type { Story, StoryRequestPayload, Category } from '../../types/story'
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
    if (!res.ok) throw new Error('Không thể tải danh sách truyện')
    return (await res.json()) as Story[]
  },

  async getBySlug(slug: string): Promise<Story> {
    const res = await fetch(buildApiUrl(`/api/stories/${slug}`))
    if (!res.ok) throw new Error('Không tìm thấy truyện')
    return (await res.json()) as Story
  },

  async adminList(): Promise<Story[]> {
    const res = await fetch(buildApiUrl('/api/admin/stories'), { headers: authHeaders() })
    if (!res.ok) throw new Error('Không thể tải danh sách truyện (admin)')
    return (await res.json()) as Story[]
  },

  async create(payload: StoryRequestPayload): Promise<Story> {
    const res = await fetch(buildApiUrl('/api/admin/stories'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Tạo truyện thất bại')
    return (await res.json()) as Story
  },

  async update(id: string, payload: StoryRequestPayload): Promise<Story> {
    const res = await fetch(buildApiUrl(`/api/admin/stories/${id}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Cập nhật truyện thất bại')
    return (await res.json()) as Story
  },

  async remove(id: string): Promise<void> {
    const res = await fetch(buildApiUrl(`/api/admin/stories/${id}`), {
      method: 'DELETE',
      headers: authHeaders(),
    })
    if (!res.ok) throw new Error('Xóa truyện thất bại')
  },
}

export const categoryApi = {
  async list(): Promise<Category[]> {
    const res = await fetch(buildApiUrl('/api/categories'))
    if (!res.ok) throw new Error('Không thể tải thể loại')
    return (await res.json()) as Category[]
  },
}
