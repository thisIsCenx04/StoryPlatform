import { Link, useLocation } from 'react-router-dom'

import { useTheme } from '../hooks/useTheme'

const Header = () => {
  const { theme, toggle } = useTheme()
  const location = useLocation()
  const isActive = (path: string) => location.pathname.startsWith(path)

  return (
    <header className="sticky top-0 z-20 shadow-sm" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-6 text-sm" style={{ color: 'var(--text)' }}>
        <Link to="/" className="text-lg font-semibold tracking-wide hover:opacity-90" style={{ color: 'var(--text)' }}>
          StorySite
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            to="/"
            className={isActive('/') ? 'font-semibold border-b-2 border-emerald-400 pb-1' : 'hover:text-emerald-300'}
          >
            Trang chủ
          </Link>
          <Link
            to="/stories"
            className={isActive('/stories') ? 'font-semibold border-b-2 border-emerald-400 pb-1' : 'hover:text-emerald-300'}
          >
            Truyện
          </Link>
          <Link
            to="/donate"
            className={isActive('/donate') ? 'font-semibold border-b-2 border-emerald-400 pb-1' : 'hover:text-emerald-300'}
          >
            Donate
          </Link>
        </nav>
        <div className="flex-1" />
        <button
          onClick={toggle}
          className="flex items-center gap-2 px-3 py-2 rounded-md border"
          style={{ borderColor: 'var(--border)', background: 'var(--card)', color: 'var(--text)' }}
        >
          {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>
    </header>
  )
}

export default Header