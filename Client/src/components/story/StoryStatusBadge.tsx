import type { StoryStatus } from '../../types/story'

const statusLabel: Record<StoryStatus, string> = {
  ONGOING: 'Đang ra',
  COMPLETED: 'Hoàn thành',
  PAUSED: 'Tạm dừng',
  DROPPED: 'Drop',
}

const statusColor: Record<StoryStatus, string> = {
  ONGOING: 'bg-emerald-100 text-emerald-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
  PAUSED: 'bg-amber-100 text-amber-700',
  DROPPED: 'bg-rose-100 text-rose-700',
}

const StoryStatusBadge = ({ status }: { status: StoryStatus }) => (
  <span className={`text-xs font-medium px-2 py-1 rounded ${statusColor[status]}`}>{statusLabel[status]}</span>
)

export default StoryStatusBadge
