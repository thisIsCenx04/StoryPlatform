import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import StoryForm from './components/StoryForm'
import { storyApi } from '../../services/api/storyApi'
import type { Story, StoryRequestPayload } from '../../types/story'

const StoryEditPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [story, setStory] = useState<Story | null>(null)

  useEffect(() => {
    if (!id) return
    storyApi.adminList().then((list) => setStory(list.find((s) => s.id === id) ?? null))
  }, [id])

  const handleSubmit = async (payload: StoryRequestPayload) => {
    if (!id) return
    await storyApi.update(id, payload)
    navigate('/admin/stories')
  }

  if (!story) return <p>Đang tải...</p>
  return <StoryForm initialValue={story} onSubmit={handleSubmit} />
}

export default StoryEditPage
