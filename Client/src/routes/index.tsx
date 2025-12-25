import { useEffect, useMemo, useState } from 'react'
import { Routes, Route, Navigate, Link } from 'react-router-dom'

import { apiConfig } from '../config/apiConfig'
import AdminLayout from '../layout/AdminLayout'
import MainLayout from '../layout/MainLayout'
import { useAuth } from '../hooks/useAuth'
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
import { storyApi } from '../services/api/storyApi'
import { donationApi } from '../services/api/donationApi'
import { categoryApi } from '../services/api/categoryApi'

const AdminDashboardPage = () => {
  const { user } = useAuth()
  const [stories, setStories] = useState<ReturnType<typeof storyApi.adminList> extends Promise<infer T> ? T : never>(
    []
  )
  const [donations, setDonations] = useState<
    ReturnType<typeof donationApi.adminList> extends Promise<infer T> ? T : never
  >([])
  const [categories, setCategories] = useState<
    ReturnType<typeof categoryApi.listAdmin> extends Promise<infer T> ? T : never
  >([])
  const [stats, setStats] = useState([
    { label: 'T67ng truy63n', value: 0 },
    { label: 'Truy63n hot', value: 0 },
    { label: '0367 xu59t', value: 0 },
    { label: 'Th69 lo55i', value: 0 },
    { label: '64ng h61 ch65 duy63t', value: 0 },
  ])
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
      const hotCount = storyList.filter((s) => s.hot).length
      const recommendedCount = storyList.filter((s) => s.recommended).length
      const pendingDonations = donationList.filter((d) => d.status === 'PENDING').length
      setStats([
        { label: 'T67ng truy63n', value: storyList.length },
        { label: 'Truy63n hot', value: hotCount },
        { label: '0367 xu59t', value: recommendedCount },
        { label: 'Th69 lo55i', value: categoryList.length },
        { label: '64ng h61 ch65 duy63t', value: pendingDonations },
      ])
      setLastSync(new Date().toLocaleString('vi-VN'))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kh00ng th69 k65t n63i API')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  const statusLabel = useMemo(() => {
    if (loading) return '03ang ki69m tra'
    if (error) return 'M59t k65t n63i'
    return 'Ho55t 0461ng'
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
            <h2 className="text-lg font-semibold">Bi69u 0465 truy63n theo l0661t xem</h2>
            <p className="text-sm admin-muted">Top 6 truy63n 04ang 040661c quan t09m.</p>
          </div>
          <div className="space-y-3">
            {topStories.map((story) => (
              <div key={story.id} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>{story.title}</span>
                  <span className="admin-muted">{story.viewCount ?? 0} l0661t xem</span>
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
            {!topStories.length && <p className="text-sm admin-muted">Ch06a c d63 li63u truy63n.</p>}
          </div>
        </div>

        <div className="admin-card p-5 space-y-4">
          <div>
            <h2 className="text-lg font-semibold">T67ng quan 65ng h61</h2>
            <p className="text-sm admin-muted">Gi tr67 v top 04ng gp.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="admin-panel p-3">
              <div className="text-xs admin-muted">T67ng gi tr67</div>
              <div className="text-lg font-semibold mt-1">{donationSummary.totalAmount.toLocaleString('vi-VN')} VND</div>
            </div>
            <div className="admin-panel p-3">
              <div className="text-xs admin-muted">0300 xc nh67n</div>
              <div className="text-lg font-semibold mt-1">{donationSummary.successAmount.toLocaleString('vi-VN')} VND</div>
            </div>
            <div className="admin-panel p-3">
              <div className="text-xs admin-muted">Ch65 duy63t</div>
              <div className="text-lg font-semibold mt-1">{donationSummary.pendingAmount.toLocaleString('vi-VN')} VND</div>
            </div>
          </div>
          <div className="space-y-3">
            {topDonations.map((donation, index) => (
              <div key={donation.id} className="flex items-center justify-between text-sm">
                <div>
                  <div className="font-medium">
                    {index + 1}. {donation.donorName || '62n danh'}
                  </div>
                  <div className="admin-muted text-xs">{donation.status}</div>
                </div>
                <div className="font-semibold">{(donation.amount ?? 0).toLocaleString('vi-VN')} VND</div>
              </div>
            ))}
            {!topDonations.length && <p className="text-sm admin-muted">Ch06a c l0661t 65ng h61.</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="admin-card p-5 space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Th69 lo55i n67i b67t</h2>
            <p className="text-sm admin-muted">Top 5 th69 lo55i theo s63 l0661ng truy63n.</p>
          </div>
          <div className="space-y-3">
            {topCategories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between text-sm">
                <span>{cat.name}</span>
                <span className="admin-muted">{cat.count} truy63n</span>
              </div>
            ))}
            {!topCategories.length && <p className="text-sm admin-muted">Ch06a c d63 li63u th69 lo55i.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

const NavigateButton = ({ to, label }: { to: string; label: string }) => (
  <Link className="admin-button admin-button-primary" to={to}>
    {label}
  </Link>
)

const AppRoutes = () => (
  <Routes>
    <Route element={<MainLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/stories" element={<StoryListPage />} />
      <Route path="/stories/:slug" element={<StoryDetailPage />} />
      <Route path="/stories/:slug/read" element={<StoryReadPage />} />
      <Route path="/donate" element={<DonatePage />} />
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
        <Route path="/admin/donations" element={<DonationManagementPage />} />
        <Route path="/admin/settings" element={<SettingsPage />} />
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)

export default AppRoutes
