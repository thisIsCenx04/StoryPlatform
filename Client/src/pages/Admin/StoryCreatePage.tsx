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

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em]" style={{ color: 'var(--accent)' }}>
          Truyện
        </p>
        <h1 className="text-2xl font-semibold">Thêm truyện nhanh</h1>
        <p className="text-sm admin-muted">Tạo bản ghi cơ bản trước, bổ sung chi tiết sau.</p>
      </div>
      <form className="admin-card p-5 space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Tên truyện</label>
            <input className="admin-input w-full" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Tác giả</label>
            <input className="admin-input w-full" value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Trạng thái</label>
            <select className="admin-input w-full" value={storyStatus} onChange={(e) => setStoryStatus(e.target.value as any)}>
              <option value="ONGOING">Đang ra</option>
              <option value="COMPLETED">Hoàn thành</option>
              <option value="PAUSED">Tạm dừng</option>
              <option value="DROPPED">Bỏ dở</option>
            </select>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-2">Thể loại</h3>
          <CategoryMultiSelect categories={categories} selectedIds={categoryIds} onChange={setCategoryIds} />
        </div>
        {error && <p className="text-sm" style={{ color: '#ff8b8b' }}>{error}</p>}
        <button type="submit" className="admin-button admin-button-primary" disabled={saving}>
          {saving ? 'Đang lưu...' : 'Lưu'}
        </button>
      </form>
      <p className="text-sm admin-muted">
        Thông tin chi tiết (ảnh bìa, mô tả, tóm tắt) sẽ được chỉnh ở bước cập nhật.
      </p>
    </div>
  )
}

export default StoryCreatePage
