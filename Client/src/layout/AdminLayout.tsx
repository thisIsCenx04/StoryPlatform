import { Outlet, Navigate, Link, useLocation } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'
import { apiConfig } from '../config/apiConfig'

const AdminLayout = () => {
  const { isAuthenticated, logout } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={apiConfig.adminLoginPagePath} replace />
  }

  const linkCls = (path: string) => `admin-nav-link ${location.pathname.startsWith(path) ? 'active' : ''}`

  return (
    <div className="admin-shell flex">
      <aside className="admin-sidebar w-64 flex flex-col shadow-sm">
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="admin-brand text-xl font-semibold">StoryHub Admin</div>
          <p className="text-xs admin-muted mt-1">Qu57n tr67 n61i dung & v67n hnh</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <Link className={linkCls('/admin/dashboard')} to="/admin/dashboard">
            T67ng quan
          </Link>
          <Link className={linkCls('/admin/stories')} to="/admin/stories">
            Truy63n
          </Link>
          <Link className={linkCls('/admin/categories')} to="/admin/categories">
            Th69 lo55i
          </Link>
          <Link className={linkCls('/admin/donations')} to="/admin/donations">
            64ng h61
          </Link>
          <Link className={linkCls('/admin/settings')} to="/admin/settings">
            Ci 0467t
          </Link>
        </nav>
        <div className="px-5 py-4 border-t text-sm flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <span className="admin-muted">03ang 0400ng nh67p</span>
          <button className="admin-button admin-button-danger" onClick={logout}>
            0300ng xu59t
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
