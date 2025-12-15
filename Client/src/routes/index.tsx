import { useMemo } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import { apiConfig } from '../config/apiConfig'
import AdminLayout from '../layout/AdminLayout'
import MainLayout from '../layout/MainLayout'
import { useAuth } from '../hooks/useAuth'
import AdminRoute from './AdminRoute'
import LoginPage from '../pages/Admin/LoginPage'
import HomePage from '../pages/Home/HomePage'
import StoryDetailPage from '../pages/StoryDetail/StoryDetailPage'
import StoryManagementPage from '../pages/Admin/StoryManagementPage'
import StoryCreatePage from '../pages/Admin/StoryCreatePage'
import StoryEditPage from '../pages/Admin/StoryEditPage'
import CategoryManagementPage from '../pages/Admin/CategoryManagementPage'

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
      <Route path="/stories/:slug" element={<StoryDetailPage />} />
    </Route>

    <Route path={apiConfig.adminLoginPagePath} element={<LoginPage />} />

    <Route element={<AdminRoute />}>
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/stories" element={<StoryManagementPage />} />
        <Route path="/admin/stories/create" element={<StoryCreatePage />} />
        <Route path="/admin/stories/:id/edit" element={<StoryEditPage />} />
        <Route path="/admin/categories" element={<CategoryManagementPage />} />
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)

export default AppRoutes
