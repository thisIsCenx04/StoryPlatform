import { useEffect, useState } from 'react'

import { categoryApi } from '../../../services/api/categoryApi'
import type { Category } from '../../../types/category'
import type { Story, StoryRequestPayload, StoryStatus, StorySummarySection } from '../../../types/story'
import StoryStatusBadge from '../../../components/story/StoryStatusBadge'
import StorySummaryEditor from '../../../components/story/StorySummaryEditor'
import CategoryMultiSelect from '../../../components/admin/CategoryMultiSelect'

interface Props {
  initialValue?: Story
  onSubmit: (payload: StoryRequestPayload) => Promise<void>
}

const defaultSection = (): StorySummarySection => ({ sortOrder: 1, textContent: '', imageUrl: '' })

const StoryForm = ({ initialValue, onSubmit }: Props) => {
  const [form, setForm] = useState<StoryRequestPayload & { summarySections: StorySummarySection[] }>(() =>
    initialValue
      ? {
          slug: initialValue.slug,
          title: initialValue.title,
          coverImageUrl: initialValue.coverImageUrl || '',
          authorName: initialValue.authorName || '',
          shortDescription: initialValue.shortDescription || '',
          storyStatus: initialValue.storyStatus,
          totalChapters: initialValue.totalChapters ?? 0,
          hot: initialValue.hot,
          recommended: initialValue.recommended,
          categoryIds: initialValue.categoryIds ?? [],
          summarySections:
            initialValue.summarySections && initialValue.summarySections.length > 0
              ? initialValue.summarySections.map((s, idx) => ({
                  ...s,
                  tempId: s.id ?? `init-${idx + 1}`,
                }))
              : [defaultSection()],
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

  const fieldClass = 'w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-900'
  const toggleClass = (active: boolean) =>
    `px-4 py-2 rounded-full text-sm font-semibold border ${active ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-300'}`

  useEffect(() => {
    categoryApi.listAdmin().then(setCategories).catch(() => setCategories([]))
  }, [])

  const handleChange = (field: keyof StoryRequestPayload, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setError(null)
    try {
      // normalize summary sections: drop tempId, drop non-UUID id, resequence sortOrder
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      const cleanedSections = (form.summarySections || []).map((s, idx) => ({
        id: s.id && uuidRegex.test(s.id) ? s.id : undefined, // will be ignored by backend (new ids)
        sortOrder: idx + 1,
        textContent: s.textContent || '',
        imageUrl: s.imageUrl || '',
      }))
      const payload: StoryRequestPayload = { ...form, summarySections: cleanedSections }
      await onSubmit(payload)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="space-y-4" onSubmit={submit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1 text-slate-700">Slug</label>
          <input className={fieldClass} value={form.slug} onChange={(e) => handleChange('slug', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1 text-slate-700">Tiêu đề</label>
          <input className={fieldClass} value={form.title} onChange={(e) => handleChange('title', e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1 text-slate-700">Ảnh bìa</label>
          <input className={fieldClass} value={form.coverImageUrl} onChange={(e) => handleChange('coverImageUrl', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1 text-slate-700">Tác giả</label>
          <input className={fieldClass} value={form.authorName} onChange={(e) => handleChange('authorName', e.target.value)} />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1 text-slate-700">Mô tả ngắn</label>
        <textarea
          className={fieldClass}
          rows={3}
          value={form.shortDescription}
          onChange={(e) => handleChange('shortDescription', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div>
          <label className="block text-sm mb-1 text-slate-700">Trạng thái</label>
          <select
            className={fieldClass}
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
          <label className="block text-sm mb-1 text-slate-700">Tổng số chap</label>
          <input
            type="number"
            className={fieldClass}
            value={form.totalChapters}
            onChange={(e) => handleChange('totalChapters', Number(e.target.value))}
          />
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-7">
          <button type="button" className={toggleClass(form.hot)} onClick={() => handleChange('hot', !form.hot)}>
            {form.hot ? 'Hot: Bật' : 'Hot: Tắt'}
          </button>
          <button
            type="button"
            className={toggleClass(form.recommended)}
            onClick={() => handleChange('recommended', !form.recommended)}
          >
            {form.recommended ? 'Đề cử: Bật' : 'Đề cử: Tắt'}
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2 text-slate-800">Thể loại</h3>
        <CategoryMultiSelect
          categories={categories}
          selectedIds={form.categoryIds}
          onChange={(ids) => setForm((prev) => ({ ...prev, categoryIds: ids }))}
        />
      </div>

      <StorySummaryEditor
        value={form.summarySections}
        onChange={(sections) => setForm((prev) => ({ ...prev, summarySections: sections }))}
      />

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
