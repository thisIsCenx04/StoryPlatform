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
      setError(err instanceof Error ? err.message : 'C67p nh67t th59t b55i')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="space-y-4" onSubmit={submit}>
      <div>
        <label className="block text-sm mb-1">Tn site</label>
        <input
          className="admin-input w-full"
          value={form.siteName}
          onChange={(e) => setForm((prev) => ({ ...prev, siteName: e.target.value }))}
        />
      </div>
      <div>
        <label className="block text-sm mb-1">030665ng d65n login 63n (admin)</label>
        <input
          className="admin-input w-full"
          value={form.adminHiddenLoginPath}
          onChange={(e) => setForm((prev) => ({ ...prev, adminHiddenLoginPath: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.copyProtectionEnabled}
            onChange={(e) => setForm((prev) => ({ ...prev, copyProtectionEnabled: e.target.checked }))}
          />
          B67t ch67n copy
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.scrapingProtectionEnabled}
            onChange={(e) => setForm((prev) => ({ ...prev, scrapingProtectionEnabled: e.target.checked }))}
          />
          B67t ch67n co
        </label>
      </div>
      {error && <p className="text-sm" style={{ color: '#ff8b8b' }}>{error}</p>}
      <button type="submit" className="admin-button admin-button-primary" disabled={saving}>
        {saving ? '03ang l06u...' : 'L06u'}
      </button>
    </form>
  )
}

export default AdminSettingsForm
