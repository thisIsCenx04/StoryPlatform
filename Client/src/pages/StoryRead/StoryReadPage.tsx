import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { storyApi } from '../../services/api/storyApi'
import { categoryApi } from '../../services/api/categoryApi'
import StorySummaryView from '../../components/story/StorySummaryView'
import StoryCard from '../../components/story/StoryCard'
import type { Story } from '../../types/story'
import type { Category } from '../../types/category'

const StoryReadPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const [story, setStory] = useState<Story | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [allStories, setAllStories] = useState<Story[]>([])
  const [error, setError] = useState<string | null>(null)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [isLiking, setIsLiking] = useState(false)

  useEffect(() => {
    if (!slug) return
    storyApi
      .getBySlug(slug)
      .then(setStory)
      .catch((err) => setError(err instanceof Error ? err.message : 'Không tìm thấy truyện'))
  }, [slug])

  useEffect(() => {
    categoryApi
      .list()
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    if (!story) return
    storyApi
      .list()
      .then((list) => setAllStories(list.filter((item) => item.slug !== story.slug)))
      .catch(() => setAllStories([]))
  }, [story])

  useEffect(() => {
    if (!slug) return
    // Tăng view sau ~90s đọc để tránh spam
    const timer = setTimeout(() => {
      storyApi.trackView(slug).catch(() => {})
    }, 15_000)
    return () => clearTimeout(timer)
  }, [slug])

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 320)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const handleLike = async () => {
    if (!story || isLiking) return
    setIsLiking(true)
    try {
      const count = await storyApi.trackLike(story.slug)
      if (typeof count === 'number') {
        setStory((prev) => (prev ? { ...prev, likeCount: count } : prev))
      }
    } finally {
      setIsLiking(false)
    }
  }

  const relatedStories = useMemo(() => {
    if (!story?.categoryIds?.length) return []
    return allStories
      .filter((item) => item.categoryIds?.some((id) => story.categoryIds?.includes(id)))
      .sort((a, b) => {
        if (a.recommended !== b.recommended) return a.recommended ? -1 : 1
        if (a.hot !== b.hot) return a.hot ? -1 : 1
        const viewDiff = (b.viewCount ?? 0) - (a.viewCount ?? 0)
        if (viewDiff != 0) return viewDiff
        return a.title.localeCompare(b.title, 'vi')
      })
      .slice(0, 6)
  }, [allStories, story?.categoryIds])

  if (error) return <p className="text-red-600">{error}</p>
  if (!story) return <p className="muted">Đang tải...</p>

  return (
    <>
      <article className="space-y-6" style={{ color: 'var(--text)' }}>
        <div className="surface rounded-2xl p-6 border">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.25em]" style={{ color: 'var(--accent)' }}>
                Đang đọc
              </p>
              <h1 className="text-3xl font-semibold">{story.title}</h1>
              <div className="text-sm muted mt-2">Tác giả: {story.authorName || 'N/A'}</div>
            </div>
            <Link
              to={`/stories/${story.slug}`}
              className="px-4 py-2 rounded-full text-sm"
              style={{ border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--text)' }}
            >
              Quay lại giới thiệu
            </Link>
          </div>
        </div>

        <div className="surface rounded-2xl p-6 border">
          <StorySummaryView sections={story.summarySections} />
        </div>

        <div className="surface rounded-2xl p-6 border">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm muted">Bạn thấy truyện hay? Hãy thả tim nhé.</div>
            <button
              type="button"
              onClick={handleLike}
              className="px-4 py-2 rounded-full text-sm font-semibold"
              style={{
                border: '1px solid rgba(248, 113, 113, 0.6)',
                background: isLiking ? 'rgba(248, 113, 113, 0.12)' : 'rgba(248, 113, 113, 0.18)',
                color: '#ef4444',
              }}
              aria-label="Thích truyện"
              disabled={isLiking}
            >
              Like {story.likeCount ?? 0}
            </button>
          </div>
        </div>

        <section className="surface rounded-2xl p-6 border">
          <h2 className="text-xl font-semibold mb-4">Các truyện tương tự</h2>
          {relatedStories.length ? (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {relatedStories.map((item) => (
                <StoryCard key={item.id} story={item} categories={categories} />
              ))}
            </div>
          ) : (
            <p className="muted">Chưa có truyện liên quan.</p>
          )}
        </section>
      </article>

      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 px-3 py-2 rounded-full shadow-lg text-sm font-semibold"
          style={{
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            color: '#f8fbff',
            border: '1px solid rgba(59, 130, 246, 0.35)',
          }}
          aria-label="Lên đầu trang"
        >
          ↑ Lên đầu trang
        </button>
      )}
    </>
  )
}

export default StoryReadPage
