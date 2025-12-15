import { Outlet, Navigate, Link, useLocation } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'

const AdminLayout = () => {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50">
      <header className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-lg font-semibold">Admin</div>
          <nav className="flex items-center gap-3 text-sm">
            <Link className={location.pathname.startsWith('/admin/dashboard') ? 'text-emerald-400' : ''} to="/admin/dashboard">
              Dashboard
            </Link>
            <Link className={location.pathname.startsWith('/admin/stories') ? 'text-emerald-400' : ''} to="/admin/stories">
              Stories
            </Link>
            <Link className={location.pathname.startsWith('/admin/categories') ? 'text-emerald-400' : ''} to="/admin/categories">
              Categories
            </Link>
            <Link className={location.pathname.startsWith('/admin/donations') ? 'text-emerald-400' : ''} to="/admin/donations">
              Donations
            </Link>
          </nav>
        </div>
        <div className="text-sm text-slate-300">{user?.username}</div>
      </header>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
