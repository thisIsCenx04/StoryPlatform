import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

import Header from './Header'
import Footer from './Footer'
import Breadcrumb from './Breadcrumb'
import { useCopyProtection } from '../hooks/useCopyProtection'
import { settingsApi } from '../services/api/settingsApi'
import { seoApi } from '../services/api/seoApi'
import type { SeoOrganization } from '../types/seo'
import OrganizationJsonLd from '../components/seo/OrganizationJsonLd'
import { useTheme } from '../hooks/useTheme'

const MainLayout = () => {
  const [copyProtection, setCopyProtection] = useState(true)
  const [organization, setOrganization] = useState<SeoOrganization | null>(null)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const { theme } = useTheme()
  useCopyProtection(copyProtection)

  useEffect(() => {
    settingsApi
      .getPublicSettings()
      .then((s) => setCopyProtection(s.copyProtectionEnabled))
      .catch(() => setCopyProtection(true))
  }, [])

  useEffect(() => {
    seoApi
      .getOrganization()
      .then(setOrganization)
      .catch(() => setOrganization(null))
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col" data-theme={theme}>
      {organization && <OrganizationJsonLd organization={organization} />}
      <Header />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 pt-0 pb-8">
        {/* <Breadcrumb items={[{ label: 'Trang ch?', to: '/' }]} /> */}
        <Outlet />
      </main>
      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 px-4 py-2 rounded-full shadow-md text-sm font-semibold"
          style={{ background: 'var(--accent)', color: '#fff' }}
          aria-label="Lên đầu trang"
        >
          ↑ Lên đầu trang
        </button>
      )}
      <Footer />
    </div>
  )
}

export default MainLayout
