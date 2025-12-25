import { buildApiUrl } from '../../config/apiConfig'
import { authStore } from '../../store/authStore'

const authHeaders = (): Record<string, string> => {
  const user = authStore.getUser()
  return user ? { Authorization: `Bearer ${user.token}` } : {}
}

export interface UploadResponse {
  url: string
}

export const uploadApi = {
  async uploadCover(file: File): Promise<UploadResponse> {
    const form = new FormData()
    form.append('file', file)
    const res = await fetch(buildApiUrl('/api/admin/uploads/cover'), {
      method: 'POST',
      headers: { ...authHeaders() },
      body: form,
    })
    if (!res.ok) {
      throw new Error('Upload ảnh thất bại')
    }
    return (await res.json()) as UploadResponse
  },
  async uploadImage(file: File): Promise<UploadResponse> {
    const form = new FormData()
    form.append('file', file)
    const res = await fetch(buildApiUrl('/api/admin/uploads/image'), {
      method: 'POST',
      headers: { ...authHeaders() },
      body: form,
    })
    if (!res.ok) {
      throw new Error('Upload ảnh thất bại')
    }
    return (await res.json()) as UploadResponse
  },
}
