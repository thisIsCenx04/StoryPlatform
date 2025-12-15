import { Outlet, Navigate } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'

const AdminLayout = () => {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50">
      <header className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="text-lg font-semibold">Admin</div>
        <div className="text-sm text-slate-300">{user?.username}</div>
      </header>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
