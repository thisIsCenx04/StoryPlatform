import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import ArticleJsonLd from '../../components/seo/ArticleJsonLd'
import BreadcrumbJsonLd from '../../components/seo/BreadcrumbJsonLd'
import StoryCard from '../../components/story/StoryCard'
import { storyApi } from '../../services/api/storyApi'
import { seoApi } from '../../services/api/seoApi'
import { categoryApi } from '../../services/api/categoryApi'
import type { Story } from '../../types/story'
import type { Category } from '../../types/category'
import type { SeoArticle, SeoBreadcrumbList } from '../../types/seo'

const StoryDetailPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const [story, setStory] = useState<Story | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [articleSeo, setArticleSeo] = useState<SeoArticle | null>(null)
  const [breadcrumb, setBreadcrumb] = useState<SeoBreadcrumbList | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [allStories, setAllStories] = useState<Story[]>([])
  const [isLiking, setIsLiking] = useState(false)

  useEffect(() => {
    if (!slug) return
    storyApi
      .getBySlug(slug)
      .then((s) => {
        setStory(s)
        return Promise.allSettled([
          seoApi.getArticle(slug),
          seoApi.getBreadcrumb({ canonicalUrl: window.location.href }),
        ])
      })
      .then((results) => {
        const [articleResult, breadcrumbResult] = results ?? []
        if (articleResult?.status === 'fulfilled') setArticleSeo(articleResult.value)
        if (breadcrumbResult?.status === 'fulfilled') setBreadcrumb(breadcrumbResult.value)
      })
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
      .then((list) => {
        setAllStories(list.filter((item) => item.slug !== story.slug))
      })
      .catch(() => setAllStories([]))
  }, [story])

  const categoryNames = useMemo(
    () => categories.filter((c) => story?.categoryIds?.includes(c.id)).map((c) => c.name),
    [categories, story?.categoryIds]
  )

  const recommendedStories = useMemo(
    () => allStories.filter((item) => item.recommended).slice(0, 6),
    [allStories]
  )

  const sameCategoryStories = useMemo(() => {
    if (!story?.categoryIds?.length) return []
    return allStories
      .filter((item) => item.categoryIds?.some((id) => story.categoryIds?.includes(id)))
      .sort((a, b) => {
        if (a.recommended !== b.recommended) return a.recommended ? -1 : 1
        if (a.hot !== b.hot) return a.hot ? -1 : 1
        const viewDiff = (b.viewCount ?? 0) - (a.viewCount ?? 0)
        if (viewDiff !== 0) return viewDiff
        return a.title.localeCompare(b.title, 'vi')
      })
      .slice(0, 6)
  }, [allStories, story?.categoryIds])

  const topViewStories = useMemo(
    () =>
      [...allStories]
        .sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0))
        .slice(0, 6),
    [allStories]
  )

  if (error) return <p className="text-red-600">{error}</p>
  if (!story) return <p className="muted">Đang tải...</p>

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

  return (
    <article className="space-y-6" style={{ color: 'var(--text)' }}>
      {articleSeo && <ArticleJsonLd article={articleSeo} />}
      {breadcrumb && <BreadcrumbJsonLd breadcrumb={breadcrumb} />}

      <section className="surface rounded-2xl p-6 border">
        <div className="grid gap-6 md:grid-cols-[240px_1fr]">
          <div
            className="rounded-xl overflow-hidden border aspect-[3/4]"
            style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
          >
            {story.coverImageUrl ? (
              <img src={story.coverImageUrl} alt={story.title} className="w-full h-full object-cover" />
            ) : (
              <div className="h-full flex items-center justify-center text-sm muted">
                Chưa có ảnh bìa
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {story.hot && <span className="px-2 py-1 rounded bg-rose-500 text-white">Hot</span>}
              {story.recommended && <span className="px-2 py-1 rounded bg-blue-600 text-white">Đề cử</span>}
            </div>
            <h1 className="text-3xl font-semibold">{story.title}</h1>
            <div className="text-sm muted">Tác giả: {story.authorName || 'N/A'}</div>
            {!!categoryNames.length && (
              <div className="flex flex-wrap gap-2 text-xs">
                {categoryNames.map((name) => (
                  <span
                    key={name}
                    className="px-2 py-1 rounded-full"
                    style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)' }}
                  >
                    {name}
                  </span>
                ))}
              </div>
            )}
            <p className="text-sm muted">{story.shortDescription || 'Chưa có mô tả ngắn.'}</p>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border p-3 text-sm" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
                <div className="muted text-xs flex items-center gap-1">
                  <span aria-hidden="true">👁</span>
                  Lượt xem
                </div>
                <div className="text-lg font-semibold">{story.viewCount ?? 0}</div>
              </div>
              <div className="rounded-lg border p-3 text-sm" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
                <div className="muted text-xs flex items-center gap-1">
                  <span aria-hidden="true">❤️</span>
                  Lượt thích
                </div>
                <button
                  type="button"
                  onClick={handleLike}
                  className="text-lg font-semibold flex items-center gap-2"
                  style={{ color: '#ef4444' }}
                  aria-label="Thích truyện"
                  disabled={isLiking}
                >
                  ❤ {story.likeCount ?? 0}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={`/stories/${story.slug}/read`}
                className="px-4 py-2 rounded-full font-semibold accent-btn shadow-sm"
              >
                Đọc ngay
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="surface rounded-2xl p-6 border space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Truyện đề xuất</h2>
          {recommendedStories.length ? (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {recommendedStories.map((item) => (
                <StoryCard key={item.id} story={item} categories={categories} />
              ))}
            </div>
          ) : (
            <p className="muted">Chưa có truyện đề xuất.</p>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Cùng thể loại</h2>
          {sameCategoryStories.length ? (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {sameCategoryStories.map((item) => (
                <StoryCard key={item.id} story={item} categories={categories} />
              ))}
            </div>
          ) : (
            <p className="muted">Chưa có truyện cùng thể loại.</p>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Nhiều lượt xem</h2>
          {topViewStories.length ? (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {topViewStories.map((item) => (
                <StoryCard key={item.id} story={item} categories={categories} />
              ))}
            </div>
          ) : (
            <p className="muted">Chưa có dữ liệu lượt xem.</p>
          )}
        </div>
      </section>
    </article>
  )
}

export default StoryDetailPage
