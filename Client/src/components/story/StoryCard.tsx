import { Link } from 'react-router-dom'

import type { Story } from '../../types/story'
import StoryStatusBadge from './StoryStatusBadge'

interface Props {
  story: Story
}

const StoryCard = ({ story }: Props) => (
  <div className="bg-white shadow-sm rounded-lg border border-slate-200 overflow-hidden flex flex-col">
    {story.coverImageUrl && (
      <img src={story.coverImageUrl} alt={story.title} className="h-40 w-full object-cover" loading="lazy" />
    )}
    <div className="p-4 flex-1 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <StoryStatusBadge status={story.storyStatus} />
        {story.hot && <span className="text-xs px-2 py-1 rounded bg-rose-100 text-rose-700">Hot</span>}
        {story.recommended && (
          <span className="text-xs px-2 py-1 rounded bg-indigo-100 text-indigo-700">Đề cử</span>
        )}
      </div>
      <Link to={`/stories/${story.slug}`} className="text-lg font-semibold text-slate-900 hover:text-emerald-700">
        {story.title}
      </Link>
      <p className="text-sm text-slate-500 line-clamp-2">{story.shortDescription}</p>
      <div className="text-xs text-slate-500">Tác giả: {story.authorName || 'N/A'}</div>
      <div className="text-xs text-slate-500">Số chap: {story.totalChapters}</div>
    </div>
  </div>
)

export default StoryCard
