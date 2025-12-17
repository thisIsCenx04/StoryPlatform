import { useEffect, useState } from 'react'

import StoryFilterBar from '../../components/story/StoryFilterBar'
import StoryList from '../../components/story/StoryList'
import { storyApi } from '../../services/api/storyApi'
import type { Story } from '../../types/story'
import BreadcrumbJsonLd from '../../components/seo/BreadcrumbJsonLd'
import { createSimpleBreadcrumb } from '../../utils/seoHelpers'

const HomePage = () => {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStories = async (filters?: { hot?: boolean; recommended?: boolean; keyword?: string }) => {
    setLoading(true)
    setError(null)
    try {
      let data = await storyApi.list({ hot: filters?.hot, recommended: filters?.recommended })
      if (filters?.keyword) {
        const keyword = filters.keyword.toLowerCase()
        data = data.filter((s) => s.title.toLowerCase().includes(keyword))
      }
      setStories(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStories()
  }, [])

  const breadcrumb = createSimpleBreadcrumb([
    { name: 'Trang chủ', url: typeof window !== 'undefined' ? window.location.href : '/' },
  ])

  return (
    <section className="space-y-4">
      <BreadcrumbJsonLd breadcrumb={breadcrumb} />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>
          Truyện mới
        </h1>
      </div>

      <StoryFilterBar onFilter={fetchStories} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      {loading ? <p>Đang tải...</p> : <StoryList stories={stories} />}
    </section>
  )
}

export default HomePage