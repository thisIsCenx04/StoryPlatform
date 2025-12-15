import { buildApiUrl } from '../../config/apiConfig'
import { authStore } from '../../store/authStore'
import type { Category, CategoryPayload } from '../../types/category'

const authHeaders = (): Record<string, string> => {
  const user = authStore.getUser()
  return user ? { Authorization: `Bearer ${user.token}` } : {}
}

export const categoryApi = {
  async list(): Promise<Category[]> {
    const res = await fetch(buildApiUrl('/api/categories'))
    if (!res.ok) throw new Error('Khong the tai the loai')
    return (await res.json()) as Category[]
  },
  async listAdmin(): Promise<Category[]> {
    const res = await fetch(buildApiUrl('/api/admin/categories'), { headers: authHeaders() })
    if (!res.ok) throw new Error('Khong the tai the loai (admin)')
    return (await res.json()) as Category[]
  },
  async create(payload: CategoryPayload): Promise<Category> {
    const res = await fetch(buildApiUrl('/api/admin/categories'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Tao the loai that bai')
    return (await res.json()) as Category
  },
  async update(id: string, payload: CategoryPayload): Promise<Category> {
    const res = await fetch(buildApiUrl(`/api/admin/categories/${id}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Cap nhat the loai that bai')
    return (await res.json()) as Category
  },
  async remove(id: string): Promise<void> {
    const res = await fetch(buildApiUrl(`/api/admin/categories/${id}`), {
      method: 'DELETE',
      headers: authHeaders(),
    })
    if (!res.ok) throw new Error('Xoa the loai that bai')
  },
}
