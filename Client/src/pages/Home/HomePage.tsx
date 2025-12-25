import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import StoryFilterBar from '../../components/story/StoryFilterBar'
import StoryList from '../../components/story/StoryList'
import StoryCardCompact from '../../components/story/StoryCardCompact'
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

  const hotStories = useMemo(() => stories.filter((s) => s.hot).slice(0, 6), [stories])
  const curatedStories = useMemo(() => stories.filter((s) => s.recommended).slice(0, 6), [stories])
  const bannerStories = useMemo(
    () => (curatedStories.length ? curatedStories : hotStories.length ? hotStories : stories.slice(0, 6)),
    [curatedStories, hotStories, stories]
  )
  const [bannerIndex, setBannerIndex] = useState(0)
  const bannerStory = bannerStories[bannerIndex]

  useEffect(() => {
    if (!bannerStories.length) return
    setBannerIndex(0)
    const timer = setInterval(() => {
      setBannerIndex((idx) => (idx + 1) % bannerStories.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [bannerStories.length])

  const trendStories = useMemo(() => {
    const map = new Map<string, Story>()
    const pool = [...hotStories, ...curatedStories, ...stories]
    for (const story of pool) {
      if (!map.has(story.id)) {
        map.set(story.id, story)
      }
      if (map.size >= 5) break
    }
    return Array.from(map.values())
  }, [curatedStories, hotStories, stories])
  const featuredStories = useMemo(
    () => (curatedStories.length ? curatedStories : stories).slice(0, 4),
    [curatedStories, stories]
  )

  const breadcrumb = createSimpleBreadcrumb([
    { name: 'Trang chủ', url: typeof window !== 'undefined' ? window.location.href : '/' },
  ])

  return (
    <section className="home-shell space-y-12">
      <BreadcrumbJsonLd breadcrumb={breadcrumb} />

      <div className="relative">
        <div
          key={bannerStory?.id || 'hero'}
          className="home-hero relative overflow-hidden rounded-3xl p-8 md:p-12 banner-fade"
          style={{
            backgroundImage: bannerStory?.coverImageUrl
              ? `linear-gradient(120deg, rgba(15, 28, 46, 0.15), rgba(15, 28, 46, 0.65)), url(${bannerStory.coverImageUrl})`
              : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 home-gridline opacity-40 pointer-events-none" />
          <div className="relative flex items-end min-h-[210px] md:min-h-[280px]">
            {bannerStory && (
              <div className="home-glass rounded-2xl p-5 max-w-xl fade-in-up" key={bannerStory.id}>
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-white/90">
                  {bannerStory.recommended && (
                    <span className="px-3 py-1 rounded-full bg-blue-600/90 text-white shadow-sm">Đề cử</span>
                  )}
                  {bannerStory.hot && <span className="px-3 py-1 rounded-full bg-rose-500/90 text-white shadow-sm">Hot</span>}
                  <span className="px-3 py-1 rounded-full border border-white/30 bg-white/10 backdrop-blur text-white">
                    {bannerStory.storyStatus}
                  </span>
                </div>
                <div className="text-2xl md:text-3xl font-semibold mt-3 text-white drop-shadow-sm">
                  {bannerStory.title}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-white/85 mt-2">
                  <span>Tác giả: {bannerStory.authorName || 'N/A'}</span>
                  <span className="h-1 w-1 rounded-full bg-white/40" />
                  <span>{bannerStory.totalChapters} chương</span>
                </div>
                <div className="mt-4">
                  <Link
                    to={`/stories/${bannerStory.slug}/read`}
                    className="px-4 py-2 rounded-full font-semibold shadow-sm"
                    style={{
                      background: '#fff',
                      color: '#2563eb',
                      border: '1px solid rgba(255,255,255,0.35)',
                      boxShadow: '0 10px 30px rgba(15, 28, 46, 0.2)',
                    }}
                  >
                    Đọc ngay
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {bannerStories.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-3">
            {bannerStories.map((story, idx) => (
              <button
                key={story.id}
                type="button"
                onClick={() => setBannerIndex(idx)}
                className="h-2 w-6 rounded-full"
                style={{
                  background: idx === bannerIndex ? 'var(--accent)' : 'rgba(59, 130, 246, 0.25)',
                  border: idx === bannerIndex ? '1px solid rgba(59, 130, 246, 0.6)' : '1px solid transparent',
                }}
                aria-label={`Chọn banner ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <div id="curated" className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em]" style={{ color: 'var(--accent)' }}>
              Thư viện gợi ý
            </p>
            <h2 className="home-title text-2xl lg:text-3xl">Lựa chọn đọc ngay</h2>
            <p className="muted mt-2 text-sm">
              Chọn nhanh truyện nổi bật, vừa cập nhật, và đánh giá cao.
            </p>
          </div>
          <div className="grid gap-3">
            {trendStories.map((story) => (
              <StoryCardCompact key={story.id} story={story} />
            ))}
          </div>
        </div>

        <div className="surface rounded-2xl p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em]" style={{ color: 'var(--accent)' }}>
                Tuyển tập
              </p>
              <h3 className="home-title text-2xl">Gợi ý theo thể loại</h3>
            </div>
            <a href="#discover" className="text-sm hover:underline" style={{ color: 'var(--accent)' }}>
              Xem tất cả
            </a>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {featuredStories.map((story) => (
              <StoryCardCompact key={story.id} story={story} />
            ))}
          </div>
        </div>
      </div>

      <div id="discover" className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em]" style={{ color: 'var(--accent)' }}>
            Khám phá
          </p>
          <h2 className="home-title text-2xl lg:text-3xl">Danh sách truyện mới nhất</h2>
        </div>
        <StoryFilterBar onFilter={fetchStories} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        {loading ? <p>Đang tải...</p> : <StoryList stories={stories} />}
      </div>
    </section>
  )
}

export default HomePage
