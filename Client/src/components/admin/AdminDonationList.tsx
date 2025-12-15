import type { Donation, DonationStatus } from '../../types/donation'

interface Props {
  donations: Donation[]
  onStatusChange: (id: string, status: DonationStatus) => void
}

const AdminDonationList = ({ donations, onStatusChange }: Props) => {
  if (!donations.length) return <p className="text-sm text-slate-500">Chưa có donate nào.</p>

  return (
    <div className="overflow-x-auto border rounded">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50">
          <tr className="text-left text-slate-500">
            <th className="px-3 py-2">Người ủng hộ</th>
            <th className="px-3 py-2">Số tiền</th>
            <th className="px-3 py-2">Phương thức</th>
            <th className="px-3 py-2">Trạng thái</th>
            <th className="px-3 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((d) => (
            <tr key={d.id} className="border-t">
              <td className="px-3 py-2">{d.donorName}</td>
              <td className="px-3 py-2">
                {d.amount} {d.currency}
              </td>
              <td className="px-3 py-2 text-slate-500">{d.paymentMethod}</td>
              <td className="px-3 py-2 text-slate-500">{d.status}</td>
              <td className="px-3 py-2 text-right space-x-2">
                <button className="text-emerald-600" onClick={() => onStatusChange(d.id, 'SUCCESS')}>
                  Đánh dấu nhận
                </button>
                <button className="text-rose-600" onClick={() => onStatusChange(d.id, 'FAILED')}>
                  Đánh dấu fail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminDonationList
