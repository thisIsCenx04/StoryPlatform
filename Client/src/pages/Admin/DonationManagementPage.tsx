import React from 'react'

import AdminDonationList from '../../components/admin/AdminDonationList'
import { donationApi } from '../../services/api/donationApi'
import type { Donation, DonationStatus } from '../../types/donation'

const DonationManagementPage = () => {
  const [donations, setDonations] = React.useState<Donation[]>([])
  const [error, setError] = React.useState<string | null>(null)

  const load = async () => {
    try {
      const data = await donationApi.adminList()
      setDonations(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải donate')
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
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Quản lý donate</h1>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <AdminDonationList donations={donations} onStatusChange={handleStatusChange} />
    </div>
  )
}

export default DonationManagementPage
