import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import StoryStatusBadge from '../../components/story/StoryStatusBadge'
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
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách')
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

  const toggleFlag = async (story: Story, field: 'hot' | 'recommended') => {
    try {
      const payload: StoryRequestPayload = {
        slug: story.slug || '',
        title: story.title,
        coverImageUrl: story.coverImageUrl || '',
        authorName: story.authorName || '',
        shortDescription: story.shortDescription || '',
        storyStatus: story.storyStatus,
        totalChapters: story.totalChapters ?? 0,
        hot: field === 'hot' ? !story.hot : story.hot,
        recommended: field === 'recommended' ? !story.recommended : story.recommended,
        categoryIds: story.categoryIds ?? [],
        summarySections: story.summarySections ?? [],
      }
      await storyApi.update(story.id, payload)
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không cập nhật được trạng thái')
    }
  }

  const pillClass = (active: boolean) =>
    `px-3 py-1 rounded-full text-xs font-semibold transition ${active ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'}`

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Quản lý truyện</h1>
        <Link to="/admin/stories/create" className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700">
          Thêm truyện
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="border rounded px-3 py-2 w-full max-w-md bg-white text-slate-900 border-slate-300"
          placeholder="Tìm kiếm truyện..."
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {loading && <p className="text-sm text-slate-600">Đang tải...</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-slate-900 bg-white rounded border border-slate-200">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200">
              <th className="px-3 py-2">Tên</th>
              <th className="px-3 py-2">Trạng thái</th>
              <th className="px-3 py-2">Hot</th>
              <th className="px-3 py-2">Đề cử</th>
              <th className="px-3 py-2 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((story) => (
              <tr key={story.id} className="border-t border-slate-200 hover:bg-slate-50">
                <td className="px-3 py-2">{story.title}</td>
                <td className="px-3 py-2">
                  <StoryStatusBadge status={story.storyStatus} />
                </td>
                <td className="px-3 py-2">
                  <button className={pillClass(story.hot)} onClick={() => toggleFlag(story, 'hot')}>
                    {story.hot ? 'Bật' : 'Tắt'}
                  </button>
                </td>
                <td className="px-3 py-2">
                  <button className={pillClass(story.recommended)} onClick={() => toggleFlag(story, 'recommended')}>
                    {story.recommended ? 'Bật' : 'Tắt'}
                  </button>
                </td>
                <td className="px-3 py-2 text-right space-x-2">
                  <Link className="text-emerald-600" to={`/admin/stories/${story.id}/edit`}>
                    Sửa
                  </Link>
                  <button className="text-rose-600" onClick={() => handleDelete(story.id)}>
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