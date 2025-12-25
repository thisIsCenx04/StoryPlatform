import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { storyApi } from '../../services/api/storyApi'
import StorySummaryView from '../../components/story/StorySummaryView'
import type { Story } from '../../types/story'

const StoryReadPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const [story, setStory] = useState<Story | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    if (!slug) return
    storyApi
      .getBySlug(slug)
      .then(setStory)
      .catch((err) => setError(err instanceof Error ? err.message : 'Không tìm thấy truyện'))
  }, [slug])

  useEffect(() => {
    if (!slug) return
    // Tăng view sau ~90s đọc để tránh spam
    const timer = setTimeout(() => {
      storyApi.trackView(slug).catch(() => {})
    }, 90_000)
    return () => clearTimeout(timer)
  }, [slug])

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 320)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

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
