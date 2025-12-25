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
      setError(err instanceof Error ? err.message : 'L06u th59t b55i')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="space-y-3" onSubmit={submit}>
      <div>
        <label className="block text-sm mb-1">Tn</label>
        <input
          className="admin-input w-full"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>
      {error && <p className="text-sm" style={{ color: '#ff8b8b' }}>{error}</p>}
      <div className="flex items-center gap-2">
        <button type="submit" className="admin-button admin-button-primary" disabled={saving}>
          {saving ? '03ang l06u...' : 'L06u'}
        </button>
        {onCancel && (
          <button type="button" className="admin-button admin-button-secondary" onClick={onCancel}>
            H65y
          </button>
        )}
      </div>
    </form>
  )
}

export default AdminCategoryForm
