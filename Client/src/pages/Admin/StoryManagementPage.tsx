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
      setError(err instanceof Error ? err.message : 'Kh00ng th69 t57i danh sch truy63n')
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
    if (!confirm('Xa truy63n ny?')) return
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
      setError(err instanceof Error ? err.message : 'Kh00ng c67p nh67t 040661c tr55ng thi')
    }
  }

  const pillClass = (active: boolean) =>
    `admin-button ${active ? 'admin-button-primary' : 'admin-button-secondary'} text-xs px-3 py-1`

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em]" style={{ color: 'var(--accent)' }}>
            Truy63n
          </p>
          <h1 className="text-2xl font-semibold">Qu57n l05 truy63n</h1>
          <p className="text-sm admin-muted">T55o m63i, ch65nh s61a, 04nh d59u n67i b67t.</p>
        </div>
        <Link to="/admin/stories/create" className="admin-button admin-button-primary">
          Thm truy63n
        </Link>
      </div>

      <div className="admin-card p-4 flex flex-wrap items-center gap-3">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="admin-input w-full max-w-md"
          placeholder="Tm ki65m truy63n..."
        />
        <span className="text-xs admin-muted">T67ng: {filtered.length}</span>
      </div>

      {error && <p className="text-sm" style={{ color: '#ff8b8b' }}>{error}</p>}
      {loading && <p className="text-sm admin-muted">03ang t57i...</p>}

      <div className="admin-card overflow-x-auto">
        <table className="admin-table text-sm">
          <thead>
            <tr>
              <th>Tn</th>
              <th>Tr55ng thi</th>
              <th>Hot</th>
              <th>0367 c61</th>
              <th className="text-right">Thao tc</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((story) => (
              <tr key={story.id}>
                <td>{story.title}</td>
                <td>
                  <StoryStatusBadge status={story.storyStatus} />
                </td>
                <td>
                  <button className={pillClass(story.hot)} onClick={() => toggleFlag(story, 'hot')}>
                    {story.hot ? 'B67t' : 'T69t'}
                  </button>
                </td>
                <td>
                  <button className={pillClass(story.recommended)} onClick={() => toggleFlag(story, 'recommended')}>
                    {story.recommended ? 'B67t' : 'T69t'}
                  </button>
                </td>
                <td className="text-right space-x-3">
                  <Link className="text-sm" style={{ color: 'var(--accent)' }} to={`/admin/stories/${story.id}/edit`}>
                    S61a
                  </Link>
                  <button className="text-sm" style={{ color: '#ff8b8b' }} onClick={() => handleDelete(story.id)}>
                    Xa
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
