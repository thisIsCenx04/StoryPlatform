import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { categoryApi } from '../services/api/categoryApi'
import { settingsApi } from '../services/api/settingsApi'
import { useTheme } from '../hooks/useTheme'
import type { Category } from '../types/category'
import type { SiteSettings } from '../types/settings'

const DROPDOWN_OPEN_DELAY_MS = 120
const DROPDOWN_CLOSE_DELAY_MS = 200

const Header = () => {
  const { theme, toggle } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const isActive = (path: string) => location.pathname.startsWith(path)
  const [categories, setCategories] = useState<Category[]>([])
  const [keyword, setKeyword] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    categoryApi
      .list()
      .then((data) => setCategories(data))
      .catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    settingsApi
      .getPublicSettings()
      .then(setSettings)
      .catch(() => setSettings(null))
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const q = params.get('q') ?? ''
    setKeyword(q)
  }, [location.search])

  useEffect(() => {
    return () => {
      if (openTimerRef.current) clearTimeout(openTimerRef.current)
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    }
  }, [])

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => a.name.localeCompare(b.name, 'vi'))
  }, [categories])

  const categoryColumns = useMemo(() => {
    const chunkSize = 10
    const chunks: Category[][] = []
    for (let i = 0; i < sortedCategories.length; i += chunkSize) {
      chunks.push(sortedCategories.slice(i, i + chunkSize))
    }
    return chunks
  }, [sortedCategories])

  const scheduleOpen = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    openTimerRef.current = setTimeout(() => setIsDropdownOpen(true), DROPDOWN_OPEN_DELAY_MS)
  }

  const scheduleClose = () => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current)
      openTimerRef.current = null
    }
    closeTimerRef.current = setTimeout(() => setIsDropdownOpen(false), DROPDOWN_CLOSE_DELAY_MS)
  }

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = keyword.trim()
    navigate(`/stories${value ? `?q=${encodeURIComponent(value)}` : ''}`)
  }

  const handleLogoClick = () => {
    if (location.pathname === '/' && window.scrollY > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const siteName = settings?.siteName || 'StoryHub'
  const logoUrl = settings?.logoUrl || ''

  return (
    <header
      className="sticky top-0 z-20 shadow-sm"
      style={{
        background: 'linear-gradient(120deg, rgba(59, 130, 246, 0.12), rgba(147, 197, 253, 0.18))',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-5 flex items-center gap-6 text-sm" style={{ color: 'var(--text)' }}>
        <Link
          to="/"
          onClick={handleLogoClick}
          className="hover:opacity-90 p-1 rounded-md flex items-center"
          style={{ background: 'rgba(59, 130, 246, 0.12)' }}
          aria-label={siteName}
        >
          {logoUrl ? (
            <img src={logoUrl} alt={siteName} className="h-12 w-12 rounded object-cover" />
          ) : (
            <span className="h-12 w-12 rounded-md" style={{ background: 'rgba(59, 130, 246, 0.35)' }} />
          )}
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            to="/stories"
            className={`px-1 py-1 transition-colors ${isActive('/stories') ? 'font-semibold border-b-2 pb-1' : ''}`}
            style={
              isActive('/stories')
                ? { borderColor: 'var(--accent)', color: 'var(--accent)' }
                : { color: 'var(--text)', borderColor: 'transparent' }
            }
          >
            Truyện
          </Link>
          <div className="relative" onMouseEnter={scheduleOpen} onMouseLeave={scheduleClose}>
            <Link
              to="/categories"
              className={`px-1 py-1 transition-colors ${isActive('/categories') ? 'font-semibold border-b-2 pb-1' : ''}`}
              style={
                isActive('/categories')
                  ? { borderColor: 'var(--accent)', color: 'var(--accent)' }
                  : { color: 'var(--text)', borderColor: 'transparent' }
              }
              onFocus={scheduleOpen}
              onBlur={scheduleClose}
            >
              Thể loại
            </Link>
            <div
              className={`absolute left-0 top-full mt-2 z-30 transition ${
                isDropdownOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}
            >
              <div className="surface rounded-xl p-3 shadow-lg">
                {categoryColumns.length ? (
                  <div className="grid gap-6 text-sm" style={{ gridAutoFlow: 'column', gridAutoColumns: 'minmax(160px, 1fr)' }}>
                    {categoryColumns.map((column, colIndex) => (
                      <div key={`col-${colIndex}`} className="grid gap-1">
                        {column.map((category) => (
                          <Link
                            key={category.id}
                            to={`/categories?category=${encodeURIComponent(category.slug)}`}
                            className="px-2 py-1 rounded hover:bg-slate-100/10 transition"
                            style={{ color: 'var(--text)' }}
                          >
                            {category.name}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="px-2 py-1 text-xs muted">Chưa có thể loại</span>
                )}
              </div>
            </div>
          </div>
          {/* <Link
            to="/donate"
            className={`px-1 py-1 transition-colors ${isActive('/donate') ? 'font-semibold border-b-2 pb-1' : ''}`}
            style={
              isActive('/donate')
                ? { borderColor: 'var(--accent)', color: 'var(--accent)' }
                : { color: 'var(--text)', borderColor: 'transparent' }
            }
          >
            Ủng hộ
          </Link> */}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <form onSubmit={submitSearch} className="flex items-center gap-2">
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Tìm truyện..."
              className="w-48 md:w-64 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              style={{ background: 'var(--input-bg)', color: 'var(--text)', border: '1px solid var(--border)' }}
            />
            <button
              type="submit"
              className="px-3 py-2 rounded text-xs font-semibold"
              style={{ border: '1px solid var(--border)', background: 'rgba(59, 130, 246, 0.15)', color: 'var(--text)' }}
            >
              Tìm
            </button>
          </form>
          <button
            type="button"
            onClick={toggle}
            className="px-3 py-2 rounded text-xs font-semibold"
            style={{ border: '1px solid var(--border)', background: 'rgba(15, 23, 42, 0.12)', color: 'var(--text)' }}
            aria-label={theme === 'dark' ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
