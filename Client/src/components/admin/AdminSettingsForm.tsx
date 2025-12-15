import React from 'react'
import type { SiteSettings } from '../../types/settings'

interface Props {
  initial: SiteSettings
  onSubmit: (settings: SiteSettings) => Promise<void>
}

const AdminSettingsForm = ({ initial, onSubmit }: Props) => {
  const [form, setForm] = React.useState<SiteSettings>(initial)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    setForm(initial)
  }, [initial])

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await onSubmit(form)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cập nhật thất bại')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="space-y-4" onSubmit={submit}>
      <div>
        <label className="block text-sm mb-1">Site name</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={form.siteName}
          onChange={(e) => setForm((prev) => ({ ...prev, siteName: e.target.value }))}
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Đường dẫn login ẩn (admin)</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={form.adminHiddenLoginPath}
          onChange={(e) => setForm((prev) => ({ ...prev, adminHiddenLoginPath: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.copyProtectionEnabled}
            onChange={(e) => setForm((prev) => ({ ...prev, copyProtectionEnabled: e.target.checked }))}
          />
          Bật chặn copy
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.scrapingProtectionEnabled}
            onChange={(e) => setForm((prev) => ({ ...prev, scrapingProtectionEnabled: e.target.checked }))}
          />
          Bật chặn cào
        </label>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 disabled:opacity-50"
        disabled={saving}
      >
        {saving ? 'Đang lưu...' : 'Lưu'}
      </button>
    </form>
  )
}

export default AdminSettingsForm
