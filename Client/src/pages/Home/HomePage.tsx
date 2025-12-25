import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

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
      setError(err instanceof Error ? err.message : 'Kh00ng th69 t57i d63 li63u')
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
    { name: 'Trang ch65', url: typeof window !== 'undefined' ? window.location.href : '/' },
  ])

  return (
    <section className="home-shell space-y-12">
      <BreadcrumbJsonLd breadcrumb={breadcrumb} />

      <div className="relative">
        <div
          className="home-hero relative overflow-hidden rounded-3xl p-8 md:p-12"
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
              <div className="home-glass rounded-2xl p-5 max-w-xl">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {bannerStory.recommended && (
                    <span className="px-2 py-0.5 rounded bg-blue-600 text-white">0367 c61</span>
                  )}
                  {bannerStory.hot && <span className="px-2 py-0.5 rounded bg-sky-500 text-white">Hot</span>}
                  <span
                    className="px-2 py-0.5 rounded border"
                    style={{
                      background: 'rgba(59, 130, 246, 0.15)',
                      borderColor: 'rgba(59, 130, 246, 0.4)',
                      color: 'var(--text)',
                    }}
                  >
                    {bannerStory.storyStatus}
                  </span>
                </div>
                <div className="text-2xl md:text-3xl font-semibold mt-3">{bannerStory.title}</div>
                <div className="text-xs muted mt-2">
                  Tc gi57: {bannerStory.authorName || 'N/A'}  {bannerStory.totalChapters} ch0601ng
                </div>
                <div className="mt-4">
                  <Link
                    to={`/stories/${bannerStory.slug}/read`}
                    className="px-4 py-2 rounded-full font-semibold accent-btn shadow-sm"
                  >
                    0369c ngay
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
                aria-label={`Ch69n banner ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <div id="curated" className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em]" style={{ color: 'var(--accent)' }}>
              Th06 vi63n g61i 05
            </p>
            <h2 className="home-title text-2xl lg:text-3xl">L65a ch69n 0469 0469c ngay</h2>
            <p className="muted mt-2 text-sm">
              Ch69n nhanh truy63n n67i b67t, v69a c67p nh67t, v 040661c 04nh gi cao.
            </p>
          </div>
          <div className="grid gap-3">
            {trendStories.map((story) => (
              <div key={story.id} className="surface rounded-xl p-4 border">
                <div className="flex items-center gap-3">
                  <div
                    className="h-12 w-12 rounded-lg"
                    style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.28), rgba(147, 197, 253, 0.18))' }}
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{story.title}</div>
                    <div className="text-xs muted">
                      {story.authorName || 'N/A'}  {story.storyStatus}  {story.totalChapters} ch0601ng
                    </div>
                  </div>
                  <span
                    className="text-[11px] px-2 py-1 rounded-full"
                    style={{ background: 'rgba(59, 130, 246, 0.18)', color: 'var(--text)' }}
                  >
                    {story.hot ? 'Hot' : 'M63i'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="surface rounded-2xl p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em]" style={{ color: 'var(--accent)' }}>
                Tuy69n t67p
              </p>
              <h3 className="home-title text-2xl">G61i 05 theo th69 lo55i</h3>
            </div>
            <a href="#discover" className="text-sm hover:underline" style={{ color: 'var(--accent)' }}>
              Xem t59t c57
            </a>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {featuredStories.map((story) => (
              <div
                key={story.id}
                className="rounded-xl p-4 border"
                style={{
                  background: 'linear-gradient(150deg, rgba(59, 130, 246, 0.12), rgba(239, 246, 255, 0.18))',
                  borderColor: 'rgba(59, 130, 246, 0.2)',
                }}
              >
                <div className="text-xs uppercase tracking-[0.2em] muted">0367 xu59t</div>
                <div className="mt-2 font-semibold text-sm">{story.title}</div>
                <p className="mt-2 text-xs muted line-clamp-3">
                  {story.shortDescription || 'Tm t69t s63 040661c c67p nh67t s63m.'}
                </p>
                <div className="mt-3 text-xs muted">
                  {story.authorName || 'N/A'}  {story.totalChapters} ch0601ng
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="discover" className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em]" style={{ color: 'var(--accent)' }}>
            Khm ph
          </p>
          <h2 className="home-title text-2xl lg:text-3xl">Danh sch truy63n m63i nh59t</h2>
        </div>
        <StoryFilterBar onFilter={fetchStories} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        {loading ? <p>03ang t57i...</p> : <StoryList stories={stories} />}
      </div>
    </section>
  )
}

export default HomePage
