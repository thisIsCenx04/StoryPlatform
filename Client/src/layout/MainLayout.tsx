import { Outlet } from 'react-router-dom'

import Header from './Header'
import Footer from './Footer'
import Breadcrumb from './Breadcrumb'
import { useCopyProtection } from '../hooks/useCopyProtection'
import { useEffect, useState } from 'react'
import { settingsApi } from '../services/api/settingsApi'

const MainLayout = () => {
  const [copyProtection, setCopyProtection] = useState(true)
  useCopyProtection(copyProtection)

  useEffect(() => {
    settingsApi
      .getPublicSettings()
      .then((s) => setCopyProtection(s.copyProtectionEnabled))
      .catch(() => setCopyProtection(true))
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }]} />
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
