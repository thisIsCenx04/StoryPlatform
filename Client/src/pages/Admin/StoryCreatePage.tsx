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
      setError(err instanceof Error ? err.message : 'T55o truy63n th59t b55i')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em]" style={{ color: 'var(--accent)' }}>
          Truy63n
        </p>
        <h1 className="text-2xl font-semibold">Thm truy63n nhanh</h1>
        <p className="text-sm admin-muted">T55o b57n ghi c01 b57n tr0663c, b67 sung chi ti65t sau.</p>
      </div>
      <form className="admin-card p-5 space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Tn truy63n</label>
            <input className="admin-input w-full" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Tc gi57</label>
            <input className="admin-input w-full" value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Tr55ng thi</label>
            <select className="admin-input w-full" value={storyStatus} onChange={(e) => setStoryStatus(e.target.value as any)}>
              <option value="ONGOING">03ang ra</option>
              <option value="COMPLETED">Hon thnh</option>
              <option value="PAUSED">T55m d69ng</option>
              <option value="DROPPED">Drop</option>
            </select>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-2">Th69 lo55i</h3>
          <CategoryMultiSelect categories={categories} selectedIds={categoryIds} onChange={setCategoryIds} />
        </div>
        {error && <p className="text-sm" style={{ color: '#ff8b8b' }}>{error}</p>}
        <button type="submit" className="admin-button admin-button-primary" disabled={saving}>
          {saving ? '03ang l06u...' : 'L06u'}
        </button>
      </form>
      <p className="text-sm admin-muted">
        Th00ng tin chi ti65t (57nh ba, m00 t57, tm t69t) s63 040661c ch65nh 67 b0663c c67p nh67t.
      </p>
    </div>
  )
}

export default StoryCreatePage
