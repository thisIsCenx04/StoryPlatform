import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

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
  const [siteTitle, setSiteTitle] = useState(() => {
    if (typeof window === 'undefined') return ''
    return window.localStorage.getItem('siteName') || ''
  })
  const [showBackToTop, setShowBackToTop] = useState(false)
  const { theme } = useTheme()
  const location = useLocation()
  useCopyProtection(copyProtection)

  useEffect(() => {
    settingsApi
      .getPublicSettings()
      .then((s) => {
        setCopyProtection(s.copyProtectionEnabled)
        if (s.siteName) {
          setSiteTitle(s.siteName)
          window.localStorage.setItem('siteName', s.siteName)
        }
      })
      .catch(() => setCopyProtection(true))
  }, [])

  useEffect(() => {
    if (!siteTitle) return
    document.title = siteTitle
  }, [siteTitle])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

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
          aria-label={'\u004C\u00EA\u006E\u0020\u0111\u1EA7\u0075\u0020\u0074\u0072\u0061\u006E\u0067'}
        >
          {'\u2191 \u004C\u00EA\u006E\u0020\u0111\u1EA7\u0075\u0020\u0074\u0072\u0061\u006E\u0067'}
        </button>
      )}
      <Footer />
    </div>
  )
}

export default MainLayout
