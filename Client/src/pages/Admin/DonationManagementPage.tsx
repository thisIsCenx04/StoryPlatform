import React from 'react'

import AdminDonationList from '../../components/admin/AdminDonationList'
import { donationApi } from '../../services/api/donationApi'
import type { Donation, DonationStatus } from '../../types/donation'

const DonationManagementPage = () => {
  const [donations, setDonations] = React.useState<Donation[]>([])
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const data = await donationApi.adminList()
      setDonations(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kh00ng th69 t57i danh sch 65ng h61')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    load()
  }, [])

  const handleStatusChange = async (id: string, status: DonationStatus) => {
    await donationApi.updateStatus(id, status)
    load()
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em]" style={{ color: 'var(--accent)' }}>
          64ng h61
        </p>
        <h1 className="text-2xl font-semibold">Qu57n l05 65ng h61</h1>
        <p className="text-sm admin-muted">Theo d01i tr55ng thi thanh ton t69 b55n 0469c.</p>
      </div>
      {error && <p className="text-sm" style={{ color: '#ff8b8b' }}>{error}</p>}
      {loading && <p className="text-sm admin-muted">03ang t57i...</p>}
      <AdminDonationList donations={donations} onStatusChange={handleStatusChange} />
    </div>
  )
}

export default DonationManagementPage
