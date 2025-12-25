import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { storyApi } from '../../services/api/storyApi'
import { categoryApi } from '../../services/api/categoryApi'
import type { Story, StoryStatus } from '../../types/story'
import type { Category } from '../../types/category'
import StoryCard from '../../components/story/StoryCard'

type SortKey = 'views'

const statusOptions: { value: StoryStatus; label: string }[] = [
  { value: 'ONGOING', label: 'Đang ra' },
  { value: 'COMPLETED', label: 'Hoàn thành' },
]

const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'views', label: 'Lượt xem' },
]

const StoryListPage = () => {
  const [stories, setStories] = useState<Story[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [keyword, setKeyword] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
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

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const q = params.get('q') ?? ''
    if (q !== keyword) {
      setKeyword(q)
    }
  }, [location.search, keyword])

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
        break
      default:
        break
    }
    return list
  }, [stories, keyword, selectedStatuses, selectedCategories, sortBy])

  const clearSearch = () => {
    setKeyword('')
    navigate('/stories')
  }

  return (
    <div className="space-y-6" style={{ color: 'var(--text)' }}>
      <div className="surface rounded-2xl p-6 border">
        <div className="flex flex-wrap items-center gap-4 justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em]" style={{ color: 'var(--accent)' }}>
              Danh sách truyện
            </p>
            <h1 className="home-title text-3xl">Khám phá kho truyện</h1>
            <p className="muted text-sm mt-1">Lọc theo thể loại, trạng thái và độ quan tâm.</p>
          </div>
          {keyword && (
            <div className="flex items-center gap-2">
              <span
                className="px-3 py-1 rounded-full text-xs"
                style={{ background: 'rgba(59, 130, 246, 0.15)', color: 'var(--text)' }}
              >
                Kết quả cho: {keyword}
              </span>
              <button className="text-xs hover:underline" style={{ color: 'var(--accent)' }} onClick={clearSearch}>
                Xóa tìm kiếm
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.32fr_0.68fr]">
        <aside className="surface rounded-2xl p-5 border space-y-5">
          <div>
            <h4 className="text-sm font-semibold mb-2">Trạng thái</h4>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleStatus(opt.value)}
                  className="px-3 py-1 rounded-full text-xs border"
                  style={{
                    borderColor: selectedStatuses.includes(opt.value) ? 'rgba(59, 130, 246, 0.6)' : 'var(--border)',
                    background: selectedStatuses.includes(opt.value) ? 'rgba(59, 130, 246, 0.18)' : 'transparent',
                    color: 'var(--text)',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-2">Thể loại</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className="px-3 py-1 rounded-full text-xs border"
                  style={{
                    borderColor: selectedCategories.includes(cat.id) ? 'rgba(59, 130, 246, 0.6)' : 'var(--border)',
                    background: selectedCategories.includes(cat.id) ? 'rgba(59, 130, 246, 0.18)' : 'transparent',
                    color: 'var(--text)',
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-2">Sắp xếp</h4>
            <div className="flex flex-wrap gap-2">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSortBy(opt.value)}
                  className="px-3 py-1 rounded-full text-xs border"
                  style={{
                    borderColor: sortBy === opt.value ? 'rgba(59, 130, 246, 0.6)' : 'var(--border)',
                    background: sortBy === opt.value ? 'rgba(59, 130, 246, 0.18)' : 'transparent',
                    color: 'var(--text)',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm muted">Hiển thị {filtered.length} truyện</p>
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
            <div className="text-center muted">Chưa có kết quả phù hợp. Hãy thử thay đổi bộ lọc.</div>
          )}
        </section>
      </div>
    </div>
  )
}

export default StoryListPage
