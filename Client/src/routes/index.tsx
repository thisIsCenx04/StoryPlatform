import { useMemo } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import MainLayout from '../layout/MainLayout'
import AdminLayout from '../layout/AdminLayout'
import AdminRoute from './AdminRoute'
import { useAuth } from '../hooks/useAuth'
import LoginPage from '../pages/Admin/LoginPage'
import { apiConfig } from '../config/apiConfig'

const HomePage = () => (
  <section>
    <h1 className="text-2xl font-semibold text-slate-900">Trang chủ</h1>
    <p className="text-slate-600 mt-2">Danh sách truyện, đề xuất, hot, donate...</p>
  </section>
)

const AdminDashboardPage = () => {
  const { user } = useAuth()
  const stats = useMemo(
    () => [
      { label: 'Truyện hot', value: 0 },
      { label: 'Đề cử bật', value: 0 },
      { label: 'Donation pending', value: 0 },
    ],
    []
  )

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <p className="text-slate-400 mb-6">Xin chào, {user?.username}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-sm text-slate-400">{stat.label}</div>
            <div className="text-2xl font-semibold text-white">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const AppRoutes = () => (
  <Routes>
    <Route element={<MainLayout />}>
      <Route path="/" element={<HomePage />} />
    </Route>

    <Route path={apiConfig.adminLoginPagePath} element={<LoginPage />} />

    <Route element={<AdminRoute />}>
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)

export default AppRoutes
