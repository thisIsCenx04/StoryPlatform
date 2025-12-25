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
      const trimmedPath = form.adminHiddenLoginPath.trim()
      const normalizedPath = trimmedPath
        ? trimmedPath.startsWith('/')
          ? trimmedPath
          : `/${trimmedPath}`
        : '/__internal__/auth/login'
      await onSubmit({ ...form, adminHiddenLoginPath: normalizedPath })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cập nhật thất bại')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="space-y-4" onSubmit={submit}>
      <div>
        <label className="block text-sm mb-1">Tên site</label>
        <input
          className="admin-input w-full"
          value={form.siteName}
          onChange={(e) => setForm((prev) => ({ ...prev, siteName: e.target.value }))}
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Đường dẫn login ẩn (admin)</label>
        <input
          className="admin-input w-full"
          value={form.adminHiddenLoginPath}
          readOnly
          aria-readonly="true"
          style={{
            background: '#f1f5f9',
            color: '#64748b',
            borderColor: '#d9e4f7',
            boxShadow: 'none',
            pointerEvents: 'none',
          }}
        />
      </div>
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.copyProtectionEnabled}
            onChange={(e) => setForm((prev) => ({ ...prev, copyProtectionEnabled: e.target.checked }))}
          />
          Bật chặn copy
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.scrapingProtectionEnabled}
            onChange={(e) => setForm((prev) => ({ ...prev, scrapingProtectionEnabled: e.target.checked }))}
          />
          Bật chặn cào
        </label>
      </div>
      {error && <p className="text-sm" style={{ color: '#ff8b8b' }}>{error}</p>}
      <button type="submit" className="admin-button admin-button-primary" disabled={saving}>
        {saving ? 'Đang lưu...' : 'Lưu'}
      </button>
    </form>
  )
}

export default AdminSettingsForm