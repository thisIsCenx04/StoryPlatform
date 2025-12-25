import { useEffect, useMemo, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import { apiConfig } from '../config/apiConfig'
import AdminLayout from '../layout/AdminLayout'
import MainLayout from '../layout/MainLayout'
import AdminRoute from './AdminRoute'
import LoginPage from '../pages/Admin/LoginPage'
import HomePage from '../pages/Home/HomePage'
import StoryDetailPage from '../pages/StoryDetail/StoryDetailPage'
import StoryReadPage from '../pages/StoryRead/StoryReadPage'
import StoryManagementPage from '../pages/Admin/StoryManagementPage'
import StoryCreatePage from '../pages/Admin/StoryCreatePage'
import StoryEditPage from '../pages/Admin/StoryEditPage'
import CategoryManagementPage from '../pages/Admin/CategoryManagementPage'
import DonatePage from '../pages/Donate/DonatePage'
import DonationManagementPage from '../pages/Admin/DonationManagementPage'
import SettingsPage from '../pages/Admin/SettingsPage'
import StoryListPage from '../pages/StoryList/StoryListPage'
import CategoryListPage from '../pages/CategoryList/CategoryListPage'
import { storyApi } from '../services/api/storyApi'
import { donationApi } from '../services/api/donationApi'
import { categoryApi } from '../services/api/categoryApi'

const AdminDashboardPage = () => {
  const [stories, setStories] = useState<ReturnType<typeof storyApi.adminList> extends Promise<infer T> ? T : never>(
    []
  )
  const [donations, setDonations] = useState<
    ReturnType<typeof donationApi.adminList> extends Promise<infer T> ? T : never
  >([])
  const [categories, setCategories] = useState<
    ReturnType<typeof categoryApi.listAdmin> extends Promise<infer T> ? T : never
  >([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastSync, setLastSync] = useState<string | null>(null)

  const loadStats = async () => {
    setLoading(true)
    setError(null)
    try {
      const [storyList, donationList, categoryList] = await Promise.all([
        storyApi.adminList(),
        donationApi.adminList(),
        categoryApi.listAdmin(),
      ])
      setStories(storyList)
      setDonations(donationList)
      setCategories(categoryList)
      setLastSync(new Date().toLocaleString('vi-VN'))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể kết nối API')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  const stats = useMemo(() => {
    const hotCount = stories.filter((s) => s.hot).length
    const recommendedCount = stories.filter((s) => s.recommended).length
    const pendingDonations = donations.filter((d) => d.status === 'PENDING').length
    return [
      { label: 'Tổng truyện', value: stories.length },
      { label: 'Truyện hot', value: hotCount },
      { label: 'Đề xuất', value: recommendedCount },
      { label: 'Thể loại', value: categories.length },
      { label: 'Ủng hộ chờ duyệt', value: pendingDonations },
    ]
  }, [stories, donations, categories])

  const statusLabel = useMemo(() => {
    if (loading) return 'Đang tải dữ liệu'
    if (error) return 'Mất kết nối'
    return 'Hoạt động'
  }, [error, loading])

  const donationSummary = useMemo(() => {
    const totalAmount = donations.reduce((sum, d) => sum + (d.amount ?? 0), 0)
    const successAmount = donations
      .filter((d) => d.status === 'SUCCESS')
      .reduce((sum, d) => sum + (d.amount ?? 0), 0)
    const pendingAmount = donations
      .filter((d) => d.status === 'PENDING')
      .reduce((sum, d) => sum + (d.amount ?? 0), 0)
    return { totalAmount, successAmount, pendingAmount }
  }, [donations])

  const topDonations = useMemo(() => {
    return [...donations]
      .sort((a, b) => (b.amount ?? 0) - (a.amount ?? 0))
      .slice(0, 5)
  }, [donations])

  const topStories = useMemo(() => {
    return [...stories]
      .sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0))
      .slice(0, 6)
  }, [stories])

  const maxViews = Math.max(1, ...topStories.map((s) => s.viewCount ?? 0))

  const topCategories = useMemo(() => {
    if (!categories.length) return []
    const counts = new Map<string, number>()
    stories.forEach((story) => {
      story.categoryIds?.forEach((id) => counts.set(id, (counts.get(id) ?? 0) + 1))
    })
    return categories
      .map((cat) => ({ ...cat, count: counts.get(cat.id) ?? 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }, [categories, stories])

  return (
    <div className="space-y-6">
      {error && <div className="admin-card p-4 text-sm" style={{ color: '#ff8b8b' }}>{error}</div>}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm admin-muted">
          {statusLabel}
          {lastSync && <span> · Cập nhật: {lastSync}</span>}
        </div>
        <button type="button" className="admin-button admin-button-secondary text-xs" onClick={loadStats}>
          Làm mới
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="admin-card p-4">
            <div className="text-sm admin-muted">{stat.label}</div>
            <div className="text-2xl font-semibold mt-2">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-4">
        <div className="admin-card p-5 space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Biểu đồ truyện theo lượt xem</h2>
            <p className="text-sm admin-muted">Top 6 truyện đang được quan tâm.</p>
          </div>
          <div className="space-y-3">
            {topStories.map((story) => (
              <div key={story.id} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>{story.title}</span>
                  <span className="admin-muted">{story.viewCount ?? 0} lượt xem</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: '#e6efff' }}>
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${Math.round(((story.viewCount ?? 0) / maxViews) * 100)}%`,
                      background: 'linear-gradient(90deg, var(--accent), var(--accent-2))',
                    }}
                  />
                </div>
              </div>
            ))}
            {!topStories.length && <p className="text-sm admin-muted">Chưa có dữ liệu truyện.</p>}
          </div>
        </div>

        <div className="admin-card p-5 space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Tổng quan ủng hộ</h2>
            <p className="text-sm admin-muted">Giá trị và top ủng hộ.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="admin-panel p-3">
              <div className="text-xs admin-muted">Tổng giá trị</div>
              <div className="text-lg font-semibold mt-1">{donationSummary.totalAmount.toLocaleString('vi-VN')} VND</div>
            </div>
            <div className="admin-panel p-3">
              <div className="text-xs admin-muted">Đã xác nhận</div>
              <div className="text-lg font-semibold mt-1">{donationSummary.successAmount.toLocaleString('vi-VN')} VND</div>
            </div>
            <div className="admin-panel p-3">
              <div className="text-xs admin-muted">Chờ duyệt</div>
              <div className="text-lg font-semibold mt-1">{donationSummary.pendingAmount.toLocaleString('vi-VN')} VND</div>
            </div>
          </div>
          <div className="space-y-3">
            {topDonations.map((donation, index) => (
              <div key={donation.id} className="flex items-center justify-between text-sm">
                <div>
                  <div className="font-medium">
                    {index + 1}. {donation.donorName || 'Ẩn danh'}
                  </div>
                  <div className="admin-muted text-xs">{donation.status}</div>
                </div>
                <div className="font-semibold">{(donation.amount ?? 0).toLocaleString('vi-VN')} VND</div>
              </div>
            ))}
            {!topDonations.length && <p className="text-sm admin-muted">Chưa có lượt ủng hộ.</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="admin-card p-5 space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Thể loại nổi bật</h2>
            <p className="text-sm admin-muted">Top 5 thể loại theo số lượng truyện.</p>
          </div>
          <div className="space-y-3">
            {topCategories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between text-sm">
                <span>{cat.name}</span>
                <span className="admin-muted">{cat.count} truyện</span>
              </div>
            ))}
            {!topCategories.length && <p className="text-sm admin-muted">Chưa có dữ liệu thể loại.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

const AppRoutes = () => (
  <Routes>
    <Route element={<MainLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/stories" element={<StoryListPage />} />
      <Route path="/stories/:slug" element={<StoryDetailPage />} />
      <Route path="/stories/:slug/read" element={<StoryReadPage />} />
      <Route path="/categories" element={<CategoryListPage />} />
      <Route path="/donate" element={<DonatePage />} />
    </Route>

    <Route path={apiConfig.adminLoginApiPath} element={<LoginPage />} />

    <Route element={<AdminRoute />}>
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/stories" element={<StoryManagementPage />} />
        <Route path="/admin/stories/create" element={<StoryCreatePage />} />
        <Route path="/admin/stories/:id/edit" element={<StoryEditPage />} />
        <Route path="/admin/categories" element={<CategoryManagementPage />} />
        <Route path="/admin/donations" element={<DonationManagementPage />} />
        <Route path="/admin/settings" element={<SettingsPage />} />
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)

export default AppRoutes