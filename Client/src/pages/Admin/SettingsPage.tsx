import React from 'react'

import AdminSettingsForm from '../../components/admin/AdminSettingsForm'
import { settingsApi } from '../../services/api/settingsApi'
import type { SiteSettings } from '../../types/settings'

const SettingsPage = () => {
  const [settings, setSettings] = React.useState<SiteSettings | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    settingsApi
      .getAdminSettings()
      .then(setSettings)
      .catch((err) => setError(err instanceof Error ? err.message : 'Không thể tải cài đặt'))
  }, [])

  const handleSubmit = async (payload: SiteSettings) => {
    const updated = await settingsApi.updateSettings(payload)
    setSettings(updated)
  }

  if (error) return <p className="text-sm text-red-500">{error}</p>
  if (!settings) return <p>Đang tải...</p>

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Cài đặt hệ thống</h1>
      <div className="bg-white border rounded p-4 shadow-sm">
        <AdminSettingsForm initial={settings} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}

export default SettingsPage
