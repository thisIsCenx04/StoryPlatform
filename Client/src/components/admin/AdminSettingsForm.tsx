import React from 'react'

import type { SiteSettings } from '../../types/settings'
import { uploadApi } from '../../services/api/uploadApi'

interface Props {
  initial: SiteSettings
  onSubmit: (settings: SiteSettings) => Promise<void>
}

const AdminSettingsForm = ({ initial, onSubmit }: Props) => {
  const [form, setForm] = React.useState<SiteSettings>(initial)
  const [saving, setSaving] = React.useState(false)
  const [uploading, setUploading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [uploadError, setUploadError] = React.useState<string | null>(null)

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
      await onSubmit({
        ...form,
        adminHiddenLoginPath: normalizedPath,
        copyProtectionEnabled: true,
        scrapingProtectionEnabled: true,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cập nhật thất bại')
    } finally {
      setSaving(false)
    }
  }

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError(null)
    try {
      const response = await uploadApi.uploadImage(file)
      setForm((prev) => ({ ...prev, logoUrl: response.url }))
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Kông thể upload ảnh')
    } finally {
      setUploading(false)
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
        <label className="block text-sm mb-1">Logo (upload)</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          className="admin-input w-full"
        />
        {uploading && <div className="text-xs mt-1">Đang tải ảnh...</div>}
        {uploadError && <div className="text-xs mt-1" style={{ color: '#c24158' }}>{uploadError}</div>}
        {form.logoUrl && (
          <div className="mt-3">
            <img
              src={form.logoUrl}
              alt="Logo preview"
              className="h-16 w-16 rounded border object-cover"
              style={{ borderColor: 'var(--border)' }}
            />
          </div>
        )}
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

      {error && <p className="text-sm" style={{ color: '#ff8b8b' }}>{error}</p>}
      <button type="submit" className="admin-button admin-button-primary" disabled={saving || uploading}>
        {saving ? 'Đang lưu...' : 'Lưu'}
      </button>
    </form>
  )
}

export default AdminSettingsForm
