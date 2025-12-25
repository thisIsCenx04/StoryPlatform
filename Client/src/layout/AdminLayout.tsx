import { Outlet, Navigate, Link, useLocation } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'
import { apiConfig } from '../config/apiConfig'

const AdminLayout = () => {
  const { isAuthenticated, logout } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={apiConfig.adminLoginApiPath} replace />
  }

  const linkCls = (path: string) => `admin-nav-link ${location.pathname.startsWith(path) ? 'active' : ''}`

  return (
    <div className="admin-shell flex">
      <aside className="admin-sidebar w-64 flex flex-col shadow-sm">
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="admin-brand text-xl font-semibold">StoryHub Admin</div>
          <p className="text-xs admin-muted mt-1">Quản trị nội dung & vận hành</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <Link className={linkCls('/admin/dashboard')} to="/admin/dashboard">
            Tổng quan
          </Link>
          <Link className={linkCls('/admin/stories')} to="/admin/stories">
            Truyện
          </Link>
          <Link className={linkCls('/admin/categories')} to="/admin/categories">
            Thể loại
          </Link>
          <Link className={linkCls('/admin/donations')} to="/admin/donations">
            Ủng hộ
          </Link>
          <Link className={linkCls('/admin/settings')} to="/admin/settings">
            Cài đặt
          </Link>
        </nav>
        <div className="px-5 py-4 border-t text-sm flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <span className="admin-muted">Đang đăng nhập</span>
          <button className="admin-button admin-button-danger" onClick={logout}>
            Đăng xuất
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
