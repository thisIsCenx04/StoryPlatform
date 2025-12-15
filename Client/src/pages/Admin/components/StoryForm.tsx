import { useEffect, useState } from 'react'

import { categoryApi } from '../../../services/api/storyApi'
import type { Category, Story, StoryRequestPayload, StoryStatus, StorySummarySection } from '../../../types/story'
import StoryStatusBadge from '../../../components/story/StoryStatusBadge'

interface Props {
  initialValue?: Story
  onSubmit: (payload: StoryRequestPayload) => Promise<void>
}

const defaultSection = (): StorySummarySection => ({ sortOrder: 1, textContent: '', imageUrl: '' })

const StoryForm = ({ initialValue, onSubmit }: Props) => {
  const [form, setForm] = useState<StoryRequestPayload>(() =>
    initialValue
      ? {
          slug: initialValue.slug,
          title: initialValue.title,
          coverImageUrl: initialValue.coverImageUrl,
          authorName: initialValue.authorName,
          shortDescription: initialValue.shortDescription,
          storyStatus: initialValue.storyStatus,
          totalChapters: initialValue.totalChapters,
          hot: initialValue.hot,
          recommended: initialValue.recommended,
          categoryIds: initialValue.categoryIds,
          summarySections: initialValue.summarySections.length ? initialValue.summarySections : [defaultSection()],
        }
      : {
          slug: '',
          title: '',
          coverImageUrl: '',
          authorName: '',
          shortDescription: '',
          storyStatus: 'ONGOING',
          totalChapters: 0,
          hot: false,
          recommended: false,
          categoryIds: [],
          summarySections: [defaultSection()],
        }
  )
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    categoryApi.list().then(setCategories).catch(() => setCategories([]))
  }, [])

  const handleChange = (field: keyof StoryRequestPayload, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSectionChange = (idx: number, field: keyof StorySummarySection, value: any) => {
    setForm((prev) => {
      const next = [...prev.summarySections]
      next[idx] = { ...next[idx], [field]: value }
      return { ...prev, summarySections: next }
    })
  }

  const addSection = () => {
    setForm((prev) => ({
      ...prev,
      summarySections: [...prev.summarySections, { sortOrder: prev.summarySections.length + 1, textContent: '', imageUrl: '' }],
    }))
  }

  const removeSection = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      summarySections: prev.summarySections.filter((_, i) => i !== idx),
    }))
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await onSubmit(form)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại')
    } finally {
      setSaving(false)
    }
  }

  const toggleCategory = (id: string) => {
    setForm((prev) => {
      const exists = prev.categoryIds.includes(id)
      return {
        ...prev,
        categoryIds: exists ? prev.categoryIds.filter((c) => c !== id) : [...prev.categoryIds, id],
      }
    })
  }

  return (
    <form className="space-y-4" onSubmit={submit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Slug</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={form.slug}
            onChange={(e) => handleChange('slug', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Tiêu đề</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Ảnh bìa</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={form.coverImageUrl}
            onChange={(e) => handleChange('coverImageUrl', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Tác giả</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={form.authorName}
            onChange={(e) => handleChange('authorName', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1">Mô tả ngắn</label>
        <textarea
          className="w-full border rounded px-3 py-2"
          rows={3}
          value={form.shortDescription}
          onChange={(e) => handleChange('shortDescription', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm mb-1">Trạng thái</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={form.storyStatus}
            onChange={(e) => handleChange('storyStatus', e.target.value as StoryStatus)}
          >
            <option value="ONGOING">Đang ra</option>
            <option value="COMPLETED">Hoàn thành</option>
            <option value="PAUSED">Tạm dừng</option>
            <option value="DROPPED">Drop</option>
          </select>
          <div className="mt-2">
            <StoryStatusBadge status={form.storyStatus} />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Tổng số chap</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            value={form.totalChapters}
            onChange={(e) => handleChange('totalChapters', Number(e.target.value))}
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.hot} onChange={(e) => handleChange('hot', e.target.checked)} /> Hot
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.recommended}
              onChange={(e) => handleChange('recommended', e.target.checked)}
            />{' '}
            Đề cử
          </label>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2">Thể loại</h3>
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2">
              <input type="checkbox" checked={form.categoryIds.includes(cat.id)} onChange={() => toggleCategory(cat.id)} />
              {cat.name}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Tóm tắt</h3>
          <button type="button" className="text-emerald-600 text-sm" onClick={addSection}>
            + Thêm block
          </button>
        </div>
        {form.summarySections.map((section, idx) => (
          <div key={idx} className="border rounded p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Block #{idx + 1}</span>
              {form.summarySections.length > 1 && (
                <button type="button" className="text-rose-600 text-xs" onClick={() => removeSection(idx)}>
                  Xóa
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs mb-1">Thứ tự</label>
                <input
                  type="number"
                  className="w-full border rounded px-2 py-1"
                  value={section.sortOrder}
                  onChange={(e) => handleSectionChange(idx, 'sortOrder', Number(e.target.value))}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs mb-1">Ảnh</label>
                <input
                  className="w-full border rounded px-2 py-1"
                  value={section.imageUrl || ''}
                  onChange={(e) => handleSectionChange(idx, 'imageUrl', e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs mb-1">Nội dung</label>
              <textarea
                className="w-full border rounded px-2 py-1"
                rows={3}
                value={section.textContent || ''}
                onChange={(e) => handleSectionChange(idx, 'textContent', e.target.value)}
              />
            </div>
          </div>
        ))}
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
  )
}

export default StoryForm
