import { useEffect, useMemo, useState } from 'react'

import { storyApi } from '../../services/api/storyApi'
import { categoryApi } from '../../services/api/categoryApi'
import type { Story, StoryStatus } from '../../types/story'
import type { Category } from '../../types/category'
import StoryCard from '../../components/story/StoryCard'

type SortKey = 'views' | 'likes' | 'chapters' | 'title'

const statusOptions: { value: StoryStatus; label: string }[] = [
  { value: 'ONGOING', label: 'Đang ra' },
  { value: 'COMPLETED', label: 'Hoàn thành' },
  { value: 'PAUSED', label: 'Tạm dừng' },
  { value: 'DROPPED', label: 'Drop' },
]

const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'views', label: 'Lượt xem' },
  { value: 'likes', label: 'Lượt thích' },
  { value: 'chapters', label: 'Số chap' },
  { value: 'title', label: 'Tên truyện' },
]

const StoryListPage = () => {
  const [stories, setStories] = useState<Story[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [keyword, setKeyword] = useState('')
  const [selectedStatuses, setSelectedStatuses] = useState<StoryStatus[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SortKey>('views')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    Promise.all([storyApi.list(), categoryApi.list()])
      .then(([storyList, categoryList]) => {
        setStories(storyList)
        setCategories(categoryList)
      })
      .finally(() => setLoading(false))
  }, [])

  const toggleStatus = (status: StoryStatus) => {
    setSelectedStatuses((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]))
  }

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]))
  }

  const filtered = useMemo(() => {
    let list = [...stories]
    if (keyword.trim()) {
      const kw = keyword.toLowerCase()
      list = list.filter((s) => s.title.toLowerCase().includes(kw))
    }
    if (selectedStatuses.length) {
      list = list.filter((s) => selectedStatuses.includes(s.storyStatus))
    }
    if (selectedCategories.length) {
      list = list.filter((s) => s.categoryIds?.some((id) => selectedCategories.includes(id)))
    }
    switch (sortBy) {
      case 'views':
        list.sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0))
        break;
      case 'likes':
        list.sort((a, b) => (b.likeCount ?? 0) - (a.likeCount ?? 0))
        break;
      case 'chapters':
        list.sort((a, b) => (b.totalChapters ?? 0) - (a.totalChapters ?? 0))
        break;
      case 'title':
        list.sort((a, b) => a.title.localeCompare(b.title))
        break;
      default:
        break;
    }
    return list
  }, [stories, keyword, selectedStatuses, selectedCategories, sortBy])

  return (
    <div className="space-y-6" style={{ color: 'var(--text)' }}>
      <div className="surface rounded-lg p-4 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <button className="px-4 py-2 rounded-md font-semibold" style={{ background: 'var(--card)', color: 'var(--text)' }}>
            TÌM KIẾM
          </button>
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Nhập từ khóa"
            className="flex-1 min-w-[200px] rounded px-3 py-2"
            style={{ background: 'var(--input-bg)', color: 'var(--text)', border: '1px solid var(--border)' }}
          />
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
            Trạng thái
          </h4>
          <div className="flex flex-wrap gap-3">
            {statusOptions.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                <input
                  type="checkbox"
                  checked={selectedStatuses.includes(opt.value)}
                  onChange={() => toggleStatus(opt.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
            Thể loại
          </h4>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                <input type="checkbox" checked={selectedCategories.includes(cat.id)} onChange={() => toggleCategory(cat.id)} />
                {cat.name}
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
            Sắp xếp
          </h4>
          <div className="flex flex-wrap gap-3">
            {sortOptions.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                <input type="radio" name="sort" checked={sortBy === opt.value} onChange={() => setSortBy(opt.value)} />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <p className="muted">Đang tải...</p>
      ) : filtered.length ? (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((s) => (
            <StoryCard key={s.id} story={s} />
          ))}
        </div>
      ) : (
        <div className="text-center muted">Khu vực hiển thị kết quả tìm kiếm...</div>
      )}
    </div>
  )
}

export default StoryListPage
