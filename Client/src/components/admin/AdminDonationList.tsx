import type { Donation, DonationStatus } from '../../types/donation'

interface Props {
  donations: Donation[]
  onStatusChange: (id: string, status: DonationStatus) => void
}

const AdminDonationList = ({ donations, onStatusChange }: Props) => {
  if (!donations.length) return <p className="text-sm admin-muted">Chưa có lượt ủng hộ nào.</p>

  return (
    <div className="admin-card overflow-x-auto">
      <table className="admin-table text-sm">
        <thead>
          <tr>
            <th>Người ủng hộ</th>
            <th>Số tiền</th>
            <th>Phương thức</th>
            <th>Trạng thái</th>
            <th className="text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((d) => (
            <tr key={d.id}>
              <td>{d.donorName || 'Ẩn danh'}</td>
              <td>
                {d.amount} {d.currency}
              </td>
              <td className="admin-muted">{d.paymentMethod || 'N/A'}</td>
              <td className="admin-muted">{d.status}</td>
              <td className="text-right space-x-2">
                <button className="admin-button admin-button-secondary text-xs" onClick={() => onStatusChange(d.id, 'SUCCESS')}>
                  Xác nhận
                </button>
                <button className="admin-button admin-button-danger text-xs" onClick={() => onStatusChange(d.id, 'FAILED')}>
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
