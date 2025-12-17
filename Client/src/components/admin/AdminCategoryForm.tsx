import React from 'react'
import type { Category, CategoryPayload } from '../../types/category'

interface Props {
  initial?: Category | null
  onSubmit: (payload: CategoryPayload, id?: string) => Promise<void>
  onCancel?: () => void
}

const AdminCategoryForm = ({ initial, onSubmit, onCancel }: Props) => {
  const [form, setForm] = React.useState<CategoryPayload>({
    name: initial?.name ?? '',
  })
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await onSubmit(form, initial?.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Luu that bai')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="space-y-3" onSubmit={submit}>
      <div>
        <label className="block text-sm mb-1">Tên</label>
        <input
          className="w-full border rounded px-3 py-2 bg-slate-800 text-white border-slate-700"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex items-center gap-2">
        <button
          type="submit"
          className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 disabled:opacity-50"
          disabled={saving}
        >
          {saving ? 'Dang luu...' : 'Luu'}
        </button>
        {onCancel && (
          <button type="button" className="text-slate-600 text-sm" onClick={onCancel}>
            Huy
          </button>
        )}
      </div>
    </form>
  )
}

export default AdminCategoryForm
