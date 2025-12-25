import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { storyApi } from '../../services/api/storyApi'
import type { Story, StoryRequestPayload } from '../../types/story'

const StoryManagementPage = () => {
  const [stories, setStories] = useState<Story[]>([])
  const [keyword, setKeyword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const data = await storyApi.adminList()
      setStories(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách truyện')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    if (!keyword) return stories
    return stories.filter((s) => s.title.toLowerCase().includes(keyword.toLowerCase()))
  }, [stories, keyword])

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa truyện này?')) return
    await storyApi.remove(id)
    load()
  }

  const toggleRecommended = async (story: Story) => {
    try {
      const payload: StoryRequestPayload = {
        slug: story.slug || '',
        title: story.title,
        coverImageUrl: story.coverImageUrl || '',
        authorName: story.authorName || '',
        shortDescription: story.shortDescription || '',
        hot: story.hot,
        recommended: !story.recommended,
        categoryIds: story.categoryIds ?? [],
        summarySections: story.summarySections ?? [],
      }
      await storyApi.update(story.id, payload)
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không cập nhật được truyện')
    }
  }

  const pillClass = (active: boolean) =>
    `admin-button ${active ? 'admin-button-primary' : 'admin-button-secondary'} text-xs px-3 py-1`

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em]" style={{ color: 'var(--accent)' }}>
            Truyện
          </p>
          <h1 className="text-2xl font-semibold">Quản lý truyện</h1>
          <p className="text-sm admin-muted">Tạo mới, chỉnh sửa, đánh dấu nổi bật.</p>
        </div>
        <Link to="/admin/stories/create" className="admin-button admin-button-primary">
          Thêm truyện
        </Link>
      </div>

      <div className="admin-card p-4 flex flex-wrap items-center gap-3">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="admin-input w-full max-w-md"
          placeholder="Tìm kiếm truyện..."
        />
        <span className="text-xs admin-muted">Tổng: {filtered.length}</span>
      </div>

      {error && <p className="text-sm" style={{ color: '#ff8b8b' }}>{error}</p>}
      {loading && <p className="text-sm admin-muted">Đang tải...</p>}

      <div className="admin-card overflow-x-auto">
        <table className="admin-table text-sm">
          <thead>
            <tr>
              <th className="min-w-[180px]">Tên</th>
              <th>Đề cử</th>
              <th className="text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((story) => (
              <tr key={story.id}>
                <td className="flex items-center gap-3">
                  <span
                    className="h-11 w-11 rounded-lg overflow-hidden flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.18), rgba(96,165,250,0.1))' }}
                  >
                    {story.coverImageUrl && (
                      <img src={story.coverImageUrl} alt={story.title} className="h-full w-full object-cover" />
                    )}
                  </span>
                  <span>{story.title}</span>
                </td>
                <td>
                  <button className={pillClass(story.recommended)} onClick={() => toggleRecommended(story)}>
                    {story.recommended ? 'Bật' : 'Tắt'}
                  </button>
                </td>
                <td className="text-right space-x-3">
                  <Link className="text-sm" style={{ color: 'var(--accent)' }} to={`/admin/stories/${story.id}/edit`}>
                    Sửa
                  </Link>
                  <button className="text-sm" style={{ color: '#ff8b8b' }} onClick={() => handleDelete(story.id)}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default StoryManagementPage
