import { useEffect, useState } from 'react'

import { categoryApi } from '../../../services/api/categoryApi'
import type { Category } from '../../../types/category'
import type { Story, StoryRequestPayload, StoryStatus, StorySummarySection } from '../../../types/story'
import StoryStatusBadge from '../../../components/story/StoryStatusBadge'
import StorySummaryEditor from '../../../components/story/StorySummaryEditor'
import CategoryMultiSelect from '../../../components/admin/CategoryMultiSelect'
import { uploadApi } from '../../../services/api/uploadApi'

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
  const [uploading, setUploading] = useState(false)

  const toggleClass = (active: boolean) =>
    `admin-button ${active ? 'admin-button-primary' : 'admin-button-secondary'} text-sm`

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
        id: s.id && uuidRegex.test(s.id) ? s.id : undefined,
        sortOrder: idx + 1,
        textContent: s.textContent || '',
        imageUrl: s.imageUrl || '',
      }))
      const payload: StoryRequestPayload = { ...form, summarySections: cleanedSections }
      await onSubmit(payload)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'L06u th59t b55i')
    } finally {
      setSaving(false)
    }
  }

  const handleUpload = async (file?: File | null) => {
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const response = await uploadApi.uploadCover(file)
      handleChange('coverImageUrl', response.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload 57nh th59t b55i')
    } finally {
      setUploading(false)
    }
  }

  return (
    <form className="space-y-6" onSubmit={submit}>
      <div className="admin-card p-5 space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Slug</label>
                <input className="admin-input w-full" value={form.slug} onChange={(e) => handleChange('slug', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm mb-1">Tiu 0467</label>
                <input
                  className="admin-input w-full"
                  value={form.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Tc gi57</label>
                <input
                  className="admin-input w-full"
                  value={form.authorName}
                  onChange={(e) => handleChange('authorName', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">56nh ba (URL)</label>
                <input
                  className="admin-input w-full"
                  value={form.coverImageUrl}
                  onChange={(e) => handleChange('coverImageUrl', e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="admin-panel p-4 space-y-3">
              <div className="text-sm font-semibold">T57i 57nh ba</div>
              <input
                type="file"
                accept="image/*"
                className="admin-input w-full"
                onChange={(e) => handleUpload(e.target.files?.[0])}
              />
              <div className="text-xs admin-muted">
                {uploading ? '03ang t57i 57nh...' : 'Ch69n 57nh 0469 upload ln h63 th63ng.'}
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">M00 t57 ng69n</label>
              <textarea
                className="admin-input w-full"
                rows={3}
                value={form.shortDescription}
                onChange={(e) => handleChange('shortDescription', e.target.value)}
              />
            </div>
          </div>

          <div className="admin-panel p-4 space-y-3">
            <div className="text-sm font-semibold">Xem tr0663c 57nh ba</div>
            <div
              className="rounded-lg border"
              style={{
                borderColor: 'var(--border)',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(147, 197, 253, 0.16))',
                aspectRatio: '3 / 4',
              }}
            >
              {form.coverImageUrl ? (
                <img
                  src={form.coverImageUrl}
                  alt="Cover preview"
                  className="h-full w-full object-cover rounded-lg"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-xs admin-muted">
                  Ch06a c 57nh ba
                </div>
              )}
            </div>
            <div className="text-xs admin-muted">Dn link 57nh ba 0469 hi69n th67 b57n xem tr0663c.</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div>
            <label className="block text-sm mb-1">Tr55ng thi</label>
            <select
              className="admin-input w-full"
              value={form.storyStatus}
              onChange={(e) => handleChange('storyStatus', e.target.value as StoryStatus)}
            >
              <option value="ONGOING">03ang ra</option>
              <option value="COMPLETED">Hon thnh</option>
              <option value="PAUSED">T55m d69ng</option>
              <option value="DROPPED">Drop</option>
            </select>
            <div className="mt-2">
              <StoryStatusBadge status={form.storyStatus} />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">T67ng s63 ch0601ng</label>
            <input
              type="number"
              className="admin-input w-full"
              value={form.totalChapters}
              onChange={(e) => handleChange('totalChapters', Number(e.target.value))}
            />
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-7">
            <button type="button" className={toggleClass(form.hot)} onClick={() => handleChange('hot', !form.hot)}>
              {form.hot ? 'Hot: B67t' : 'Hot: T69t'}
            </button>
            <button
              type="button"
              className={toggleClass(form.recommended)}
              onClick={() => handleChange('recommended', !form.recommended)}
            >
              {form.recommended ? '0367 c61: B67t' : '0367 c61: T69t'}
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2">Th69 lo55i</h3>
          <CategoryMultiSelect
            categories={categories}
            selectedIds={form.categoryIds}
            onChange={(ids) => setForm((prev) => ({ ...prev, categoryIds: ids }))}
          />
        </div>
      </div>

      <div className="admin-card p-5">
        <StorySummaryEditor
          value={form.summarySections}
          onChange={(sections) => setForm((prev) => ({ ...prev, summarySections: sections }))}
        />
      </div>

      {error && <p className="text-sm" style={{ color: '#ff8b8b' }}>{error}</p>}
      <button type="submit" className="admin-button admin-button-primary" disabled={saving || uploading}>
        {saving ? '03ang l06u...' : uploading ? '03ang upload...' : 'L06u'}
      </button>
    </form>
  )
}

export default StoryForm
