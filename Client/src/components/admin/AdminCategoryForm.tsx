import React from 'react'
import type { Category, CategoryPayload } from '../../types/category'

interface Props {
  initial?: Category | null
  categories: Category[]
  onSubmit: (payload: CategoryPayload, id?: string) => Promise<void>
  onCancel?: () => void
}

const AdminCategoryForm = ({ initial, categories, onSubmit, onCancel }: Props) => {
  const [form, setForm] = React.useState<CategoryPayload>({
    name: initial?.name ?? '',
    slug: initial?.slug ?? '',
    description: initial?.description ?? '',
    parentId: initial?.parentId ?? null,
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
        <label className="block text-sm mb-1">Ten</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Slug</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={form.slug}
          onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
          required
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Mo ta</label>
        <textarea
          className="w-full border rounded px-3 py-2"
          rows={2}
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Parent</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={form.parentId ?? ''}
          onChange={(e) => setForm((prev) => ({ ...prev, parentId: e.target.value || null }))}
        >
          <option value="">None</option>
          {categories
            .filter((c) => c.id !== initial?.id)
            .map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
        </select>
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
