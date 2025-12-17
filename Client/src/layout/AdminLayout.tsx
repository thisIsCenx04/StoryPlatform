import { Outlet, Navigate, Link, useLocation } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'

const AdminLayout = () => {
  const { isAuthenticated, logout } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  const linkCls = (path: string) =>
    `block px-3 py-2 rounded-md text-sm ${location.pathname.startsWith(path) ? 'bg-emerald-50 text-emerald-700 font-semibold border border-emerald-100' : 'text-slate-700 hover:bg-slate-100'}`

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="text-lg font-semibold">Admin</div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <Link className={linkCls('/admin/dashboard')} to="/admin/dashboard">
            Dashboard
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
        <div className="px-5 py-4 border-t border-slate-200 text-sm flex items-center justify-end bg-slate-50">
          <button className="text-rose-600 hover:text-rose-700" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto bg-slate-50">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout