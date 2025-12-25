import { useMemo } from 'react'
import { Link } from 'react-router-dom'

import type { Story } from '../../types/story'
import type { Category } from '../../types/category'

interface Props {
  story: Story
  categories?: Category[]
}

const StoryCard = ({ story, categories = [] }: Props) => {
  const categoryNames = useMemo(() => {
    if (!categories.length || !story.categoryIds?.length) return []
    return categories.filter((cat) => story.categoryIds?.includes(cat.id)).map((cat) => cat.name)
  }, [categories, story.categoryIds])
  const visibleCategories = categoryNames.slice(0, 2)
  const extraCount = categoryNames.length - visibleCategories.length

  return (
    <div className="card rounded-lg overflow-hidden flex flex-col shadow-sm min-h-[360px] max-h-[360px]">
      {story.coverImageUrl && (
        <img src={story.coverImageUrl} alt={story.title} className="h-48 w-full object-cover" loading="lazy" />
      )}
      <div className="p-4 flex-1 flex flex-col gap-2">
        <div className="flex items-center justify-end gap-2 text-xs">
          {story.hot && <span className="px-2 py-1 rounded bg-red-500 text-white">Hot</span>}
          {story.recommended && <span className="px-2 py-1 rounded bg-cyan-500 text-white">Đề cử</span>}
        </div>
        <Link
          to={`/stories/${story.slug}`}
          className="text-lg font-semibold hover:text-emerald-400 line-clamp-2"
          style={{ color: 'var(--text)' }}
        >
          {story.title}
        </Link>
        {visibleCategories.length > 0 && (
          <div className="flex items-center gap-1 text-[10px]">
            {visibleCategories.map((name) => (
              <span
                key={name}
                className="px-2 py-1 rounded-full truncate max-w-[120px]"
                style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)' }}
              >
                {name}
              </span>
            ))}
            {extraCount > 0 && (
              <span
                className="px-2 py-1 rounded-full"
                style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)' }}
              >
                +{extraCount}
              </span>
            )}
          </div>
        )}
        <p className="text-sm muted line-clamp-2">{story.shortDescription}</p>
        <div className="text-xs muted mt-auto">Tác giả: {story.authorName || 'N/A'}</div>
      </div>
    </div>
  )
}

export default StoryCard
