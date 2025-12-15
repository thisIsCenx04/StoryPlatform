import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import StoryStatusBadge from '../../components/story/StoryStatusBadge'
import { storyApi } from '../../services/api/storyApi'
import type { Story } from '../../types/story'

const StoryManagementPage = () => {
  const [stories, setStories] = useState<Story[]>([])
  const [keyword, setKeyword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    try {
      const data = await storyApi.adminList()
      setStories(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách')
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
          className="border rounded px-3 py-2 w-full max-w-md"
          placeholder="Tìm kiếm truyện..."
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="px-3 py-2">Tên</th>
              <th className="px-3 py-2">Trạng thái</th>
              <th className="px-3 py-2">Hot</th>
              <th className="px-3 py-2">Đề cử</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((story) => (
              <tr key={story.id} className="border-t">
                <td className="px-3 py-2">{story.title}</td>
                <td className="px-3 py-2">
                  <StoryStatusBadge status={story.storyStatus} />
                </td>
                <td className="px-3 py-2">{story.hot ? 'Bật' : 'Tắt'}</td>
                <td className="px-3 py-2">{story.recommended ? 'Bật' : 'Tắt'}</td>
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
