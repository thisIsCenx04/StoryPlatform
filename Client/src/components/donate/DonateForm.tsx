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
      setError(err instanceof Error ? err.message : 'C l69i x57y ra')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = 'w-full rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500'
  const inputStyle = { background: 'var(--input-bg)', color: 'var(--text)', border: '1px solid var(--border)' }

  return (
    <form className="space-y-3" onSubmit={submit}>
      <div>
        <label className="block text-sm mb-1" style={{ color: 'var(--text)' }}>
          Tn ng0665i 65ng h61
        </label>
        <input className={inputCls} style={inputStyle} value={form.donorName} onChange={(e) => setForm((prev) => ({ ...prev, donorName: e.target.value }))} required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1" style={{ color: 'var(--text)' }}>
            S63 ti67n
          </label>
          <input type="number" className={inputCls} style={inputStyle} value={form.amount} onChange={(e) => setForm((prev) => ({ ...prev, amount: Number(e.target.value) }))} required />
        </div>
        <div>
          <label className="block text-sm mb-1" style={{ color: 'var(--text)' }}>
            0301n v67
          </label>
          <select className={inputCls} style={inputStyle} value={form.currency} onChange={(e) => setForm((prev) => ({ ...prev, currency: e.target.value }))}>
            <option value="VND">VND</option>
            <option value="USD">USD</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm mb-1" style={{ color: 'var(--text)' }}>
          Th00ng 04i63p
        </label>
        <textarea className={inputCls} style={inputStyle} rows={3} value={form.message} onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1" style={{ color: 'var(--text)' }}>
            Ph0601ng th67c
          </label>
          <select className={inputCls} style={inputStyle} value={form.paymentMethod} onChange={(e) => setForm((prev) => ({ ...prev, paymentMethod: e.target.value }))}>
            <option value="MOMO">Momo</option>
            <option value="BANK">Bank</option>
            <option value="PAYPAL">Paypal</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1" style={{ color: 'var(--text)' }}>
            M00 giao d67ch (n65u c)
          </label>
          <input className={inputCls} style={inputStyle} value={form.paymentTxnId} onChange={(e) => setForm((prev) => ({ ...prev, paymentTxnId: e.target.value }))} />
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      <button type="submit" className="px-4 py-2 rounded text-sm font-semibold accent-btn w-full" style={{ border: '1px solid var(--border)' }} disabled={loading}>
        {loading ? '03ang g61i...' : '64ng h61'}
      </button>
    </form>
  )
}

export default DonateForm