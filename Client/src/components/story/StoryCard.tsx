import { Link } from 'react-router-dom'

import type { Story } from '../../types/story'
import StoryStatusBadge from './StoryStatusBadge'

interface Props {
  story: Story
}

const StoryCard = ({ story }: Props) => (
  <div className="card rounded-lg overflow-hidden flex flex-col shadow-sm">
    {story.coverImageUrl && (
      <img src={story.coverImageUrl} alt={story.title} className="h-48 w-full object-cover" loading="lazy" />
    )}
    <div className="p-4 flex-1 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2 text-xs">
        <StoryStatusBadge status={story.storyStatus} />
        <div className="flex items-center gap-2">
          {story.hot && <span className="px-2 py-1 rounded bg-red-500 text-white">Hot</span>}
          {story.recommended && <span className="px-2 py-1 rounded bg-cyan-500 text-white">Đề cử</span>}
        </div>
      </div>
      <Link to={`/stories/${story.slug}`} className="text-lg font-semibold hover:text-emerald-400" style={{ color: 'var(--text)' }}>
        {story.title}
      </Link>
      <p className="text-sm muted line-clamp-2">{story.shortDescription}</p>
      <div className="text-xs muted">Tác giả: {story.authorName || 'N/A'}</div>
      <div className="text-xs muted">Số chương: {story.totalChapters}</div>
    </div>
  </div>
)

export default StoryCard
