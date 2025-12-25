import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { storyApi } from '../../services/api/storyApi'
import { categoryApi } from '../../services/api/categoryApi'
import StoryCard from '../../components/story/StoryCard'
import type { Story } from '../../types/story'
import type { Category } from '../../types/category'

const CategoryListPage = () => {
  const [stories, setStories] = useState<Story[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [bannerIndex, setBannerIndex] = useState(0)
  const [searchParams, setSearchParams] = useSearchParams()

  const selectedSlug = searchParams.get('category') ?? ''
  const selectedCategory = useMemo(
    () => categories.find((cat) => cat.slug === selectedSlug) ?? null,
    [categories, selectedSlug]
  )
  const selectedCategoryId = selectedCategory?.id ?? ''

  useEffect(() => {
    setLoading(true)
    setError(null)
    Promise.all([storyApi.list(), categoryApi.list()])
      .then(([storyList, categoryList]) => {
        setStories(storyList)
        setCategories(categoryList)
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Không thể tải danh sách thể loại')
      )
      .finally(() => setLoading(false))
  }, [])

  const hotStories = useMemo(() => stories.filter((s) => s.hot).slice(0, 6), [stories])
  const curatedStories = useMemo(
    () => stories.filter((s) => s.recommended).slice(0, 6),
    [stories]
  )

  const bannerStories = useMemo(() => {
    if (curatedStories.length) return curatedStories
    if (hotStories.length) return hotStories
    return stories.slice(0, 6)
  }, [curatedStories, hotStories, stories])

  const bannerStory = bannerStories[bannerIndex]

  useEffect(() => {
    if (!bannerStories.length) return
    setBannerIndex(0)
    const timer = setInterval(() => {
      setBannerIndex((idx) => (idx + 1) % bannerStories.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [bannerStories.length])

  const sortStories = (list: Story[]) => {
    return [...list].sort((a, b) => {
      if (a.recommended !== b.recommended) return a.recommended ? -1 : 1
      const viewDiff = (b.viewCount ?? 0) - (a.viewCount ?? 0)
      if (viewDiff !== 0) return viewDiff
      return a.title.localeCompare(b.title, 'vi')
    })
  }

  const matchedStories = useMemo(() => {
    if (!selectedCategoryId) return []
    return sortStories(stories.filter((story) => story.categoryIds?.includes(selectedCategoryId)))
  }, [stories, selectedCategoryId])

  const otherStories = useMemo(() => {
    if (!selectedCategoryId) return sortStories(stories)
    return sortStories(stories.filter((story) => !story.categoryIds?.includes(selectedCategoryId)))
  }, [stories, selectedCategoryId])

  const selectCategory = (slug: string) => {
    if (!slug) {
      setSearchParams({})
      return
    }
    setSearchParams({ category: slug })
  }

  return (
    <section className="space-y-10" style={{ color: 'var(--text)' }}>
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
                    <span className="px-3 py-1 rounded-full bg-blue-600/90 text-white shadow-sm">
                      Đề cử
                    </span>
                  )}
                  {bannerStory.hot && (
                    <span className="px-3 py-1 rounded-full bg-rose-500/90 text-white shadow-sm">
                      Hot
                    </span>
                  )}
                </div>

                <div className="text-2xl md:text-3xl font-semibold mt-3 text-white drop-shadow-sm">
                  {bannerStory.title}
                </div>

                <div className="flex flex-wrap items-center gap-2 text-sm text-white/85 mt-2">
                  <span>Tác giả: {bannerStory.authorName || 'N/A'}</span>
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
                  border:
                    idx === bannerIndex
                      ? '1px solid rgba(59, 130, 246, 0.6)'
                      : '1px solid transparent',
                }}
                aria-label={`Chọn banner ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.25em]" style={{ color: 'var(--accent)' }}>
            Thể loại
          </p>
          <h1 className="home-title text-3xl">Khám phá kho thể loại</h1>
          <p className="muted text-sm mt-1">
            Chọn thể loại để ưu tiên truyện thuộc thể loại đó và truyện đề cử.
          </p>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {loading && <p className="muted">Đang tải...</p>}

        <div className="surface rounded-2xl p-5 border space-y-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => selectCategory('')}
              className="px-3 py-1 rounded-full text-xs border"
              style={{
                borderColor: !selectedCategory ? 'rgba(59, 130, 246, 0.6)' : 'var(--border)',
                background: !selectedCategory ? 'rgba(59, 130, 246, 0.18)' : 'transparent',
                color: 'var(--text)',
              }}
            >
              Tất cả
            </button>

            {categories.map((cat) => {
              const isActive = selectedCategory?.id === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => selectCategory(cat.slug)}
                  className="px-3 py-1 rounded-full text-xs border"
                  style={{
                    borderColor: isActive ? 'rgba(59, 130, 246, 0.6)' : 'var(--border)',
                    background: isActive ? 'rgba(59, 130, 246, 0.18)' : 'transparent',
                    color: 'var(--text)',
                  }}
                >
                  {cat.name}
                </button>
              )
            })}
          </div>

          {selectedCategory && (
            <div className="text-xs muted">
              Đang ưu tiên truyện thuộc thể loại: {selectedCategory.name} và truyện đề cử.
            </div>
          )}
        </div>

        {!loading && !stories.length && <p className="muted">Chưa có truyện phù hợp.</p>}

        {selectedCategoryId ? (
          <div className="space-y-8">
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Truyện thuộc {selectedCategory?.name}</h2>
                <span className="text-xs muted">{matchedStories.length} truyện</span>
              </div>

              {matchedStories.length ? (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {matchedStories.map((story) => (
                    <StoryCard key={story.id} story={story} categories={categories} />
                  ))}
                </div>
              ) : (
                <p className="muted">Chưa có truyện thuộc thể loại này.</p>
              )}
            </section>

            <div className="border-t" style={{ borderColor: 'var(--border)' }} />

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Truyện khác</h2>
                <span className="text-xs muted">{otherStories.length} truyện</span>
              </div>

              {otherStories.length ? (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {otherStories.map((story) => (
                    <StoryCard key={story.id} story={story} categories={categories} />
                  ))}
                </div>
              ) : (
                <p className="muted">Chưa có truyện khác để hiển thị.</p>
              )}
            </section>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {otherStories.map((story) => (
              <StoryCard key={story.id} story={story} categories={categories} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default CategoryListPage
