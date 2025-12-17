import React from 'react'
import { useNavigate } from 'react-router-dom'

import { categoryApi } from '../../services/api/categoryApi'
import { storyApi } from '../../services/api/storyApi'
import CategoryMultiSelect from '../../components/admin/CategoryMultiSelect'
import type { StoryRequestPayload } from '../../types/story'
import type { Category } from '../../types/category'

const StoryCreatePage = () => {
  const navigate = useNavigate()
  const [title, setTitle] = React.useState('')
  const [authorName, setAuthorName] = React.useState('')
  const [storyStatus, setStoryStatus] = React.useState<StoryRequestPayload['storyStatus']>('ONGOING')
  const [categoryIds, setCategoryIds] = React.useState<string[]>([])
  const [categories, setCategories] = React.useState<Category[]>([])
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    categoryApi.listAdmin().then(setCategories).catch(() => setCategories([]))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const payload: StoryRequestPayload = {
        slug: '',
        title,
        coverImageUrl: '',
        authorName,
        shortDescription: '',
        storyStatus,
        totalChapters: 0,
        hot: false,
        recommended: false,
        categoryIds,
        summarySections: [],
      }
      await storyApi.create(payload)
      navigate('/admin/stories')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tạo truyện thất bại')
    } finally {
      setSaving(false)
    }
  }

  const fieldClass = 'w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-900'

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">Thêm truyện nhanh</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-slate-700">Tên truyện</label>
            <input className={fieldClass} value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm mb-1 text-slate-700">Tác giả</label>
            <input className={fieldClass} value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-slate-700">Trạng thái</label>
            <select className={fieldClass} value={storyStatus} onChange={(e) => setStoryStatus(e.target.value as any)}>
              <option value="ONGOING">Đang ra</option>
              <option value="COMPLETED">Hoàn thành</option>
              <option value="PAUSED">Tạm dừng</option>
              <option value="DROPPED">Drop</option>
            </select>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-2 text-slate-800">Thể loại</h3>
          <CategoryMultiSelect categories={categories} selectedIds={categoryIds} onChange={setCategoryIds} />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 disabled:opacity-50"
          disabled={saving}
        >
          {saving ? 'Đang lưu...' : 'Lưu'}
        </button>
      </form>
      <p className="text-sm text-slate-500">Thông tin chi tiết (ảnh bìa, mô tả, tóm tắt) sẽ chỉnh sau khi tạo.</p>
    </div>
  )
}

export default StoryCreatePage