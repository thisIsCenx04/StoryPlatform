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
      .catch((err) => setError(err instanceof Error ? err.message : 'Không tìm thấy truyện'))
  }, [slug])

  if (error) return <p className="text-red-600">{error}</p>
  if (!story) return <p>Đang tải...</p>

  return (
    <article className="space-y-4">
      {articleSeo && <ArticleJsonLd article={articleSeo} />}
      {breadcrumb && <BreadcrumbJsonLd breadcrumb={breadcrumb} />}
      <div className="flex flex-col md:flex-row gap-4">
        {story.coverImageUrl && (
          <img
            src={story.coverImageUrl}
            alt={story.title}
            className="w-full md:w-64 rounded-lg border border-slate-200 object-cover"
          />
        )}
        <div className="space-y-3 flex-1">
          <h1 className="text-3xl font-semibold text-slate-900">{story.title}</h1>
          <div className="flex items-center gap-2">
            <StoryStatusBadge status={story.storyStatus} />
            {story.hot && <span className="text-xs px-2 py-1 rounded bg-rose-100 text-rose-700">Hot</span>}
            {story.recommended && <span className="text-xs px-2 py-1 rounded bg-indigo-100 text-indigo-700">Đề cử</span>}
          </div>
          <p className="text-slate-600">{story.shortDescription}</p>
          <div className="text-sm text-slate-500">Tác giả: {story.authorName || 'N/A'}</div>
          <div className="text-sm text-slate-500">Số chap: {story.totalChapters}</div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Tóm tắt</h2>
        <StorySummaryView sections={story.summarySections} />
      </div>
    </article>
  )
}

export default StoryDetailPage
