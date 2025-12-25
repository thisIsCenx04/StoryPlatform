import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import StoryStatusBadge from '../../components/story/StoryStatusBadge'
import StorySummaryView from '../../components/story/StorySummaryView'
import ArticleJsonLd from '../../components/seo/ArticleJsonLd'
import BreadcrumbJsonLd from '../../components/seo/BreadcrumbJsonLd'
import { storyApi } from '../../services/api/storyApi'
import { seoApi } from '../../services/api/seoApi'
import type { Story } from '../../types/story'
import type { SeoArticle, SeoBreadcrumbList } from '../../types/seo'

const StoryDetailPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const [story, setStory] = useState<Story | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [articleSeo, setArticleSeo] = useState<SeoArticle | null>(null)
  const [breadcrumb, setBreadcrumb] = useState<SeoBreadcrumbList | null>(null)

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
      .catch((err) => setError(err instanceof Error ? err.message : 'Kh00ng tm th59y truy63n'))
  }, [slug])

  if (error) return <p className="text-red-600">{error}</p>
  if (!story) return <p className="muted">03ang t57i...</p>

  return (
    <article className="space-y-6" style={{ color: 'var(--text)' }}>
      {articleSeo && <ArticleJsonLd article={articleSeo} />}
      {breadcrumb && <BreadcrumbJsonLd breadcrumb={breadcrumb} />}

      <section className="surface rounded-2xl p-6 border">
        <div className="grid gap-6 md:grid-cols-[240px_1fr]">
          <div
            className="rounded-xl overflow-hidden border"
            style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
          >
            {story.coverImageUrl ? (
              <img src={story.coverImageUrl} alt={story.title} className="w-full h-full object-cover" />
            ) : (
              <div className="h-full min-h-[320px] flex items-center justify-center text-sm muted">
                Ch06a c 57nh ba
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <StoryStatusBadge status={story.storyStatus} />
              {story.hot && <span className="px-2 py-1 rounded bg-rose-500 text-white">Hot</span>}
              {story.recommended && <span className="px-2 py-1 rounded bg-blue-600 text-white">0367 c61</span>}
            </div>
            <h1 className="text-3xl font-semibold">{story.title}</h1>
            <div className="text-sm muted">Tc gi57: {story.authorName || 'N/A'}</div>
            <p className="text-sm muted">{story.shortDescription || 'Ch06a c m00 t57 ng69n.'}</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="rounded-lg border p-3 text-sm" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
                <div className="muted text-xs">S63 ch0601ng</div>
                <div className="text-lg font-semibold">{story.totalChapters}</div>
              </div>
              <div className="rounded-lg border p-3 text-sm" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
                <div className="muted text-xs">L0661t xem</div>
                <div className="text-lg font-semibold">{story.viewCount ?? 0}</div>
              </div>
              <div className="rounded-lg border p-3 text-sm" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
                <div className="muted text-xs">L0661t thch</div>
                <div className="text-lg font-semibold">{story.likeCount ?? 0}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={`/stories/${story.slug}/read`}
                className="px-4 py-2 rounded-full font-semibold accent-btn shadow-sm"
              >
                0369c ngay
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="summary" className="surface rounded-2xl p-6 border">
        <h2 className="text-xl font-semibold mb-4">Tm t69t</h2>
        <StorySummaryView sections={story.summarySections} />
      </section>
    </article>
  )
}

export default StoryDetailPage
