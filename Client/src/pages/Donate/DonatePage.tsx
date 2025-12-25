import React from 'react'

import DonateFail from '../../components/donate/DonateFail'
import DonateForm from '../../components/donate/DonateForm'
import DonateSuccess from '../../components/donate/DonateSuccess'
import { donationApi } from '../../services/api/donationApi'
import type { DonationPayload } from '../../types/donation'

const DonatePage = () => {
  const [status, setStatus] = React.useState<'idle' | 'success' | 'fail'>('idle')
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async (payload: DonationPayload) => {
    setError(null)
    setStatus('idle')
    try {
      await donationApi.create(payload)
      setStatus('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
      setStatus('fail')
    }
  }

  return (
    <section className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-3xl font-semibold" style={{ color: 'var(--text)' }}>
        Ủng hộ website
      </h1>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        Mỗi ủng hộ góp giúp duy trì server và phát triển tính năng mới.
      </p>

      {status === 'success' && <DonateSuccess />}
      {status === 'fail' && <DonateFail message={error ?? undefined} />}

      <div className="card rounded-xl p-6 shadow-sm">
        <DonateForm onSubmit={handleSubmit} />
      </div>
    </section>
  )
}

export default DonatePage
