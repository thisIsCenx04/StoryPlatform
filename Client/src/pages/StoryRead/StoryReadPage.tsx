import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { storyApi } from '../../services/api/storyApi'
import StorySummaryView from '../../components/story/StorySummaryView'
import type { Story } from '../../types/story'

const MIN_FONT_SIZE = 14
const MAX_FONT_SIZE = 24
const FONT_STEP = 2
const DEFAULT_FONT_SIZE = 18
const FONT_SIZE_STORAGE_KEY = 'story_read_font_size'
const FONT_SIZE_TTL_MS = 1000 * 60 * 60 * 24 * 3

const StoryReadPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const [story, setStory] = useState<Story | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE)

  useEffect(() => {
    if (!slug) return
    storyApi
      .getBySlug(slug)
      .then(setStory)
      .catch((err) => setError(err instanceof Error ? err.message : 'Không tìm thấy truyện'))
  }, [slug])

  useEffect(() => {
    if (!slug) return
    // Tang view sau ~90s doc de tranh spam
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

  useEffect(() => {
    const raw = localStorage.getItem(FONT_SIZE_STORAGE_KEY)
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as { value: number; savedAt: number }
      if (!parsed?.savedAt || Date.now() - parsed.savedAt > FONT_SIZE_TTL_MS) {
        localStorage.removeItem(FONT_SIZE_STORAGE_KEY)
        return
      }
      if (typeof parsed.value === 'number') {
        setFontSize(parsed.value)
      }
    } catch {
      localStorage.removeItem(FONT_SIZE_STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(
      FONT_SIZE_STORAGE_KEY,
      JSON.stringify({ value: fontSize, savedAt: Date.now() })
    )
  }, [fontSize])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const decreaseFont = () => {
    setFontSize((prev) => Math.max(MIN_FONT_SIZE, prev - FONT_STEP))
  }

  const increaseFont = () => {
    setFontSize((prev) => Math.min(MAX_FONT_SIZE, prev + FONT_STEP))
  }

  const resetFont = () => {
    setFontSize(DEFAULT_FONT_SIZE)
  }

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
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text)' }}>
                <span className="muted">Cỡ chữ</span>
                <button
                  type="button"
                  onClick={decreaseFont}
                  className="px-2 py-1 rounded"
                  style={{ border: '1px solid var(--border)', background: 'var(--card)' }}
                  aria-label="Giảm cỡ chữ"
                >
                  A-
                </button>
                <button
                  type="button"
                  onClick={increaseFont}
                  className="px-2 py-1 rounded"
                  style={{ border: '1px solid var(--border)', background: 'var(--card)' }}
                  aria-label="Tăng cỡ chữ"
                >
                  A+
                </button>
                <button
                  type="button"
                  onClick={resetFont}
                  className="px-2 py-1 rounded"
                  style={{ border: '1px solid var(--border)', background: 'var(--card)' }}
                >
                  Mặc định
                </button>
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
        </div>

        <div className="surface rounded-2xl p-6 border" style={{ fontSize, lineHeight: 1.8 }}>
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
