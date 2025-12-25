import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { storyApi } from '../../services/api/storyApi'
import StorySummaryView from '../../components/story/StorySummaryView'
import type { Story } from '../../types/story'

const StoryReadPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const [story, setStory] = useState<Story | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    storyApi
      .getBySlug(slug)
      .then(setStory)
      .catch((err) => setError(err instanceof Error ? err.message : 'Kh00ng tm th59y truy63n'))
  }, [slug])

  if (error) return <p className="text-red-600">{error}</p>
  if (!story) return <p className="muted">03ang t57i...</p>

  return (
    <article className="space-y-6" style={{ color: 'var(--text)' }}>
      <div className="surface rounded-2xl p-6 border">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em]" style={{ color: 'var(--accent)' }}>
              03ang 0469c
            </p>
            <h1 className="text-3xl font-semibold">{story.title}</h1>
            <div className="text-sm muted mt-2">Tc gi57: {story.authorName || 'N/A'}</div>
          </div>
          <Link
            to={`/stories/${story.slug}`}
            className="px-4 py-2 rounded-full text-sm"
            style={{ border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--text)' }}
          >
            Quay l55i gi63i thi63u
          </Link>
        </div>
      </div>

      <div className="surface rounded-2xl p-6 border">
        <StorySummaryView sections={story.summarySections} />
      </div>
    </article>
  )
}

export default StoryReadPage
