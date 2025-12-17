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
      .catch((err) => setError(err instanceof Error ? err.message : 'Không t?i du?c truy?n'))
  }, [id])

  const handleSubmit = async (payload: StoryRequestPayload) => {
    if (!id) return
    await storyApi.update(id, payload)
    navigate('/admin/stories')
  }

  if (error) return <p className="text-red-500">{error}</p>
  if (!story) return <p className="text-white">Ðang t?i...</p>
  return <StoryForm initialValue={story} onSubmit={handleSubmit} />
}

export default StoryEditPage