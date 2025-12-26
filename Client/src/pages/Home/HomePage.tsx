import { useEffect, useMemo, useState } from 'react'
import type { PointerEvent } from 'react'
import { Link } from 'react-router-dom'

import StoryFilterBar from '../../components/story/StoryFilterBar'
import StoryList from '../../components/story/StoryList'
import StoryCardCompact from '../../components/story/StoryCardCompact'
import { storyApi } from '../../services/api/storyApi'
import { categoryApi } from '../../services/api/categoryApi'
import type { Story } from '../../types/story'
import type { Category } from '../../types/category'
import BreadcrumbJsonLd from '../../components/seo/BreadcrumbJsonLd'
import { createSimpleBreadcrumb } from '../../utils/seoHelpers'

const BANNER_INTERVAL_MS = 5500
const BANNER_TRANSITION_MS = 420
const BANNER_SWIPE_THRESHOLD_PX = 60

const HomePage = () => {
  const [stories, setStories] = useState<Story[]>([])
  const [categories, setCategories] = useState<Category[]>([])
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

  useEffect(() => {
    categoryApi
      .list()
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  const hotStories = useMemo(() => stories.filter((s) => s.hot).slice(0, 6), [stories])
  const curatedStories = useMemo(() => stories.filter((s) => s.recommended).slice(0, 6), [stories])
  const bannerStories = useMemo(
    () => (curatedStories.length ? curatedStories : hotStories.length ? hotStories : stories.slice(0, 6)),
    [curatedStories, hotStories, stories]
  )
  const slides: Array<Story | null> = bannerStories.length ? bannerStories : [null]
  const [bannerIndex, setBannerIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragDelta, setDragDelta] = useState(0)

  useEffect(() => {
    if (!bannerStories.length) return
    setBannerIndex(0)
  }, [bannerStories.length])

  useEffect(() => {
    if (!bannerStories.length || isDragging) return
    const timer = setInterval(() => {
      setBannerIndex((idx) => (idx + 1) % bannerStories.length)
    }, BANNER_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [bannerStories.length, isDragging])

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (bannerStories.length <= 1) return
    setIsDragging(true)
    setDragStartX(event.clientX)
    setDragDelta(0)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    setDragDelta(event.clientX - dragStartX)
  }

  const handlePointerUp = () => {
    if (!isDragging) return
    setIsDragging(false)
    if (!bannerStories.length) return
    if (Math.abs(dragDelta) > BANNER_SWIPE_THRESHOLD_PX) {
      setBannerIndex((idx) => {
        if (dragDelta < 0) return (idx + 1) % bannerStories.length
        return (idx - 1 + bannerStories.length) % bannerStories.length
      })
    }
    setDragDelta(0)
  }

  const handleSelect = (idx: number) => {
    setBannerIndex(idx)
    setDragDelta(0)
  }

  const trendStories = useMemo(() => {
    const map = new Map<string, Story>()
    const pool = [...hotStories, ...curatedStories, ...stories]
    for (const story of pool) {
      if (!map.has(story.id)) {
        map.set(story.id, story)
      }
      if (map.size >= 4) break
    }
    return Array.from(map.values())
  }, [curatedStories, hotStories, stories])
  const categoryStoryGroups = useMemo(() => {
    if (!categories.length || !stories.length) return []
    const grouped = new Map<string, Story[]>()
    for (const story of stories) {
      story.categoryIds?.forEach((id) => {
        const list = grouped.get(id)
        if (list) {
          list.push(story)
        } else {
          grouped.set(id, [story])
        }
      })
    }
    return categories
      .map((category) => ({
        category,
        stories: grouped.get(category.id) ?? [],
      }))
      .filter((group) => group.stories.length)
  }, [categories, stories])
  const limitedCategoryGroups = useMemo(() => {
    const limited: Array<{ category: Category; stories: Story[] }> = []
    let remaining = 4
    for (const group of categoryStoryGroups) {
      if (remaining <= 0) break
      const slice = group.stories.slice(0, remaining)
      if (slice.length) {
        limited.push({ category: group.category, stories: slice })
        remaining -= slice.length
      }
    }
    return limited
  }, [categoryStoryGroups])

  const breadcrumb = createSimpleBreadcrumb([
    { name: 'Trang chủ', url: typeof window !== 'undefined' ? window.location.href : '/' },
  ])

  return (
    <section className="home-shell space-y-12">
      <BreadcrumbJsonLd breadcrumb={breadcrumb} />

      <div className="relative -mt-8">
        <div
          className="relative overflow-hidden rounded-3xl"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ touchAction: 'pan-y' }}
        >
          <div
            className="flex"
            style={{
              transform: `translateX(calc(-${bannerIndex * 100}% + ${dragDelta}px))`,
              transition: isDragging ? 'none' : `transform ${BANNER_TRANSITION_MS}ms ease`,
            }}
          >
            {slides.map((story, idx) => (
              <div key={story?.id ?? `hero-${idx}`} className="min-w-full">
                <div
                  className="home-hero relative overflow-hidden p-8 md:p-12 banner-fade"
                  style={{
                    backgroundImage: story?.coverImageUrl
                      ? `linear-gradient(120deg, rgba(15, 28, 46, 0.15), rgba(15, 28, 46, 0.65)), url(${story.coverImageUrl})`
                      : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute inset-0 home-gridline opacity-40 pointer-events-none" />
                  <div className="relative flex items-center min-h-[210px] md:min-h-[280px]">
                    {story && (
                      <div className="flex flex-col md:flex-row items-center gap-6">
                        <div
                          className="home-glass rounded-2xl p-5 max-w-3xl fade-in-up"
                          style={{ background: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(8px)' }}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className="w-28 md:w-32 aspect-[3/4] rounded-xl overflow-hidden border"
                              style={{ borderColor: 'rgba(255,255,255,0.35)' }}
                            >
                              {story.coverImageUrl ? (
                                <img src={story.coverImageUrl} alt={story.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full" style={{ background: 'rgba(255,255,255,0.2)' }} />
                              )}
                            </div>
                            <div className="space-y-2">
                              <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-white/90">
                                {story.recommended && (
                                  <span className="px-3 py-1 rounded-full bg-blue-600/90 text-white shadow-sm">Đề cử</span>
                                )}
                                {story.hot && (
                                  <span className="px-3 py-1 rounded-full bg-rose-500/90 text-white shadow-sm">Top xem</span>
                                )}
                              </div>
                              <div className="text-2xl md:text-3xl font-semibold text-white drop-shadow-sm">
                                {story.title}
                              </div>
                              <div className="flex flex-wrap items-center gap-2 text-sm text-white/85">
                                <span>Tác giả: {story.authorName || 'N/A'}</span>
                              </div>
                              <div>
                                <Link
                                  to={`/stories/${story.slug}/read`}
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
                          </div>
                        </div>
                        <div className="text-sm text-white/85 leading-relaxed line-clamp-4 md:max-w-[280px] lg:max-w-[320px]">
                          {story.shortDescription || 'Chưa có mô tả ngắn.'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

        {bannerStories.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-3">
            {bannerStories.map((story, idx) => (
              <button
                key={story.id}
                type="button"
                onClick={() => handleSelect(idx)}
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
          {limitedCategoryGroups.length ? (
            <div className="mt-5 space-y-5">
              {limitedCategoryGroups.map((group) => (
                <div key={group.category.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold">{group.category.name}</h4>
                    <span className="text-xs muted">{group.stories.length} truyện</span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {group.stories.map((story) => (
                      <StoryCardCompact key={story.id} story={story} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted mt-4">Chưa có truyện theo thể loại.</p>
          )}
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
        {loading ? <p>Đang tải...</p> : <StoryList stories={stories} categories={categories} />}
      </div>
    </section>
  )
}

export default HomePage

