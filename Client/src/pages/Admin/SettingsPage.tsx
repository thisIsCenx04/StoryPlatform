import React from 'react'

import AdminSettingsForm from '../../components/admin/AdminSettingsForm'
import { settingsApi } from '../../services/api/settingsApi'
import type { SiteSettings } from '../../types/settings'

const SettingsPage = () => {
  const [settings, setSettings] = React.useState<SiteSettings | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)

  React.useEffect(() => {
    settingsApi
      .getAdminSettings()
      .then(setSettings)
      .catch((err) => setError(err instanceof Error ? err.message : 'Kông thể tải cài đặt'))
  }, [])

  React.useEffect(() => {
    if (!success) return
    const timer = setTimeout(() => setSuccess(null), 2500)
    return () => clearTimeout(timer)
  }, [success])

  const handleSubmit = async (payload: SiteSettings) => {
    const updated = await settingsApi.updateSettings(payload)
    setSettings(updated)
    setError(null)
    setSuccess('Đã lưu cài đặt')
  }

  if (error) return <p className="text-sm" style={{ color: '#ff8b8b' }}>{error}</p>
  if (!settings) return <p className="admin-muted">Đang tải...</p>

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em]" style={{ color: 'var(--accent)' }}>
          Cài đặt
        </p>
        <h1 className="text-2xl font-semibold">Cấu hình hệ thống</h1>
        <p className="text-sm admin-muted">Thiết lập đường dẫn ẩn, bảo vệ nội dung.</p>
      </div>
      <div className="admin-card p-5">
        <AdminSettingsForm initial={settings} onSubmit={handleSubmit} />
        {success && (
          <div className="mt-3 text-sm" style={{ color: '#1d4ed8' }}>
            {success}
          </div>
        )}
      </div>
    </div>
  )
}

export default SettingsPage
