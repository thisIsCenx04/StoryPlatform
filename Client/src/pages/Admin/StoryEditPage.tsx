import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import StoryForm from './components/StoryForm'
import { storyApi } from '../../services/api/storyApi'
import type { Story, StoryRequestPayload } from '../../types/story'

const StoryEditPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [story, setStory] = useState<Story | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    storyApi
      .adminGet(id)
      .then((data) =>
        setStory({
          ...data,
          summarySections: data.summarySections ?? [],
          categoryIds: data.categoryIds ?? [],
        })
      )
      .catch((err) => setError(err instanceof Error ? err.message : 'Kh00ng t57i 040661c truy63n'))
  }, [id])

  const handleSubmit = async (payload: StoryRequestPayload) => {
    if (!id) return
    await storyApi.update(id, payload)
    navigate('/admin/stories')
  }

  if (error) return <p className="text-sm" style={{ color: '#ff8b8b' }}>{error}</p>
  if (!story) return <p className="admin-muted">03ang t57i...</p>

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em]" style={{ color: 'var(--accent)' }}>
          Truy63n
        </p>
        <h1 className="text-2xl font-semibold">Ch65nh s61a truy63n</h1>
        <p className="text-sm admin-muted">C67p nh67t n61i dung, ph09n lo55i v tr55ng thi.</p>
      </div>
      <StoryForm initialValue={story} onSubmit={handleSubmit} />
    </div>
  )
}

export default StoryEditPage
