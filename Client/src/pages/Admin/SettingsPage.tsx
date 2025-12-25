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
      .catch((err) => setError(err instanceof Error ? err.message : 'Kh00ng th69 t57i ci 0467t'))
  }, [])

  const handleSubmit = async (payload: SiteSettings) => {
    const updated = await settingsApi.updateSettings(payload)
    setSettings(updated)
  }

  if (error) return <p className="text-sm" style={{ color: '#ff8b8b' }}>{error}</p>
  if (!settings) return <p className="admin-muted">03ang t57i...</p>

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em]" style={{ color: 'var(--accent)' }}>
          Ci 0467t
        </p>
        <h1 className="text-2xl font-semibold">C59u hnh h63 th63ng</h1>
        <p className="text-sm admin-muted">Thi65t l67p 040665ng d65n 63n, b57o v63 n61i dung.</p>
      </div>
      <div className="admin-card p-5">
        <AdminSettingsForm initial={settings} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}

export default SettingsPage
