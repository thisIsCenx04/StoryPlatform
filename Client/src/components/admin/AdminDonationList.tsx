import type { Donation, DonationStatus } from '../../types/donation'

interface Props {
  donations: Donation[]
  onStatusChange: (id: string, status: DonationStatus) => void
}

const AdminDonationList = ({ donations, onStatusChange }: Props) => {
  if (!donations.length) return <p className="text-sm admin-muted">Ch06a c l0661t 65ng h61 no.</p>

  return (
    <div className="admin-card overflow-x-auto">
      <table className="admin-table text-sm">
        <thead>
          <tr>
            <th>Ng0665i 65ng h61</th>
            <th>S63 ti67n</th>
            <th>Ph0601ng th67c</th>
            <th>Tr55ng thi</th>
            <th className="text-right">Thao tc</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((d) => (
            <tr key={d.id}>
              <td>{d.donorName || '62n danh'}</td>
              <td>
                {d.amount} {d.currency}
              </td>
              <td className="admin-muted">{d.paymentMethod || 'N/A'}</td>
              <td className="admin-muted">{d.status}</td>
              <td className="text-right space-x-2">
                <button className="admin-button admin-button-secondary text-xs" onClick={() => onStatusChange(d.id, 'SUCCESS')}>
                  Xc nh67n
                </button>
                <button className="admin-button admin-button-danger text-xs" onClick={() => onStatusChange(d.id, 'FAILED')}>
                  03nh d59u fail
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
