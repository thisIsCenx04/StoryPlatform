import React from 'react'
import type { DonationPayload } from '../../types/donation'

interface Props {
  onSubmit: (payload: DonationPayload) => Promise<void>
}

const DonateForm = ({ onSubmit }: Props) => {
  const [form, setForm] = React.useState<DonationPayload>({
    donorName: '',
    amount: 50000,
    currency: 'VND',
    message: '',
    paymentMethod: 'MOMO',
    paymentTxnId: '',
  })
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await onSubmit(form)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="space-y-3" onSubmit={submit}>
      <div>
        <label className="block text-sm mb-1">Tên người ủng hộ</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={form.donorName}
          onChange={(e) => setForm((prev) => ({ ...prev, donorName: e.target.value }))}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1">Số tiền</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            value={form.amount}
            onChange={(e) => setForm((prev) => ({ ...prev, amount: Number(e.target.value) }))}
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Đơn vị</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={form.currency}
            onChange={(e) => setForm((prev) => ({ ...prev, currency: e.target.value }))}
          >
            <option value="VND">VND</option>
            <option value="USD">USD</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm mb-1">Thông điệp</label>
        <textarea
          className="w-full border rounded px-3 py-2"
          rows={3}
          value={form.message}
          onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1">Phương thức</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={form.paymentMethod}
            onChange={(e) => setForm((prev) => ({ ...prev, paymentMethod: e.target.value }))}
          >
            <option value="MOMO">Momo</option>
            <option value="BANK">Bank</option>
            <option value="PAYPAL">Paypal</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Mã giao dịch (nếu có)</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={form.paymentTxnId}
            onChange={(e) => setForm((prev) => ({ ...prev, paymentTxnId: e.target.value }))}
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Đang gửi...' : 'Ủng hộ'}
      </button>
    </form>
  )
}

export default DonateForm
