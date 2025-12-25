import { buildApiUrl } from '../../config/apiConfig'
import { authStore } from '../../store/authStore'
import type { Donation, DonationPayload, DonationStatus } from '../../types/donation'

const authHeaders = (): Record<string, string> => {
  const user = authStore.getUser()
  return user ? { Authorization: `Bearer ${user.token}` } : {}
}

export const donationApi = {
  async create(payload: DonationPayload): Promise<Donation> {
    const res = await fetch(buildApiUrl('/api/donations'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Tạo donate thất bại')
    return (await res.json()) as Donation
  },
  async adminList(): Promise<Donation[]> {
    const res = await fetch(buildApiUrl('/api/admin/donations'), { headers: authHeaders() })
    if (!res.ok) throw new Error('Không thể tải danh sách donate')
    return (await res.json()) as Donation[]
  },
  async updateStatus(id: string, status: DonationStatus): Promise<Donation> {
    const res = await fetch(buildApiUrl(`/api/admin/donations/${id}?status=${status}`), {
      method: 'PUT',
      headers: authHeaders(),
    })
    if (!res.ok) throw new Error('Cập nhật donate thất bại')
    return (await res.json()) as Donation
  },
}
