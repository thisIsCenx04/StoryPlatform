import type { Story } from '../../types/story'

const StoryCardCompact = ({ story }: { story: Story }) => {
  return (
    <div
      className="surface rounded-xl p-4 border flex items-center gap-4"
      style={{ borderColor: 'rgba(59,130,246,0.12)', background: 'rgba(59,130,246,0.05)' }}
    >
      <div
        className="h-14 w-14 rounded-lg shrink-0 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.18), rgba(96, 165, 250, 0.1))' }}
      >
        {story.coverImageUrl && (
          <img
            src={story.coverImageUrl}
            alt={story.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        )}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <div className="font-semibold text-[15px]" style={{ color: 'var(--text)' }}>
            {story.title}
          </div>
        </div>
        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {story.authorName || 'N/A'}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
          <span>{story.totalChapters ?? 0} chương</span>
          <span className="h-1 w-1 rounded-full" style={{ background: 'var(--border)' }} />
          <span className="px-2 py-0.5 rounded-full border text-[12px]" style={{ borderColor: 'rgba(59,130,246,0.35)' }}>
            {story.storyStatus}
          </span>
        </div>
      </div>
      {story.hot && (
        <span
          className="px-3 py-1 rounded-full text-[12px] font-semibold"
          style={{ background: 'rgba(59,130,246,0.2)', color: 'var(--text)' }}
        >
          Hot
        </span>
      )}
    </div>
  )
}

export default StoryCardCompact