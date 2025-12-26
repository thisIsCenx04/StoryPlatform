import { useEffect, useMemo, useState } from 'react'
import type { PointerEvent } from 'react'
import { useLocation } from 'react-router-dom'

import { storyApi } from '../../services/api/storyApi'
import { categoryApi } from '../../services/api/categoryApi'
import StoryCard from '../../components/story/StoryCard'
import type { Story } from '../../types/story'
import type { Category } from '../../types/category'

const BANNER_INTERVAL_MS = 5500
const BANNER_TRANSITION_MS = 420
const BANNER_SWIPE_THRESHOLD_PX = 60

const StoryListPage = () => {
  const location = useLocation()
  const [stories, setStories] = useState<Story[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [bannerIndex, setBannerIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragDelta, setDragDelta] = useState(0)

  useEffect(() => {
    setLoading(true)
    setError(null)
    Promise.all([storyApi.list(), categoryApi.list()])
      .then(([storyList, categoryList]) => {
        setStories(storyList)
        setCategories(categoryList)
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Không thể tải danh sách truyện'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const q = params.get('q') ?? ''
    if (q !== keyword) {
      setKeyword(q)
    }
  }, [keyword, location.search])

  const filteredStories = useMemo(() => {
    if (!keyword.trim()) return stories
    const kw = keyword.toLowerCase()
    return stories.filter((story) => story.title.toLowerCase().includes(kw))
  }, [keyword, stories])

  const hotStories = useMemo(() => filteredStories.filter((s) => s.hot).slice(0, 6), [filteredStories])
  const curatedStories = useMemo(() => filteredStories.filter((s) => s.recommended).slice(0, 6), [filteredStories])
  const bannerStories = useMemo(
    () => (curatedStories.length ? curatedStories : hotStories.length ? hotStories : filteredStories.slice(0, 6)),
    [curatedStories, hotStories, filteredStories]
  )
  const slides: Array<Story | null> = bannerStories.length ? bannerStories : [null]

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

  const sections = useMemo(() => {
    return categories
      .map((category) => ({
        category,
        stories: filteredStories.filter((story) => story.categoryIds?.includes(category.id)),
      }))
      .filter((section) => section.stories.length)
      .sort((a, b) => a.category.name.localeCompare(b.category.name, 'vi'))
  }, [categories, filteredStories])

  return (
    <section className="space-y-10" style={{ color: 'var(--text)' }}>
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

      <div className="space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[0.25em]" style={{ color: 'var(--accent)' }}>
            Thư viện truyện
          </p>
          <h1 className="home-title text-3xl">Kho truyện theo thể loại</h1>
          {keyword ? (
            <p className="muted text-sm mt-1">Kết quả cho: {keyword}</p>
          ) : (
            <p className="muted text-sm mt-1">Khám phá trọn bộ truyện theo từng thể loại.</p>
          )}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {loading && <p className="muted">Đang tải...</p>}

        {!loading && !sections.length && <p className="muted">Chưa có truyện phù hợp.</p>}

        {sections.map((section) => (
          <section key={section.category.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{section.category.name}</h2>
              <span className="text-xs muted">{section.stories.length} truyện</span>
            </div>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {section.stories.map((story) => (
                <StoryCard key={story.id} story={story} categories={categories} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  )
}

export default StoryListPage

