import StoryForm from './components/StoryForm'
import { storyApi } from '../../services/api/storyApi'
import type { StoryRequestPayload } from '../../types/story'
import { useNavigate } from 'react-router-dom'

const StoryCreatePage = () => {
  const navigate = useNavigate()

  const handleSubmit = async (payload: StoryRequestPayload) => {
    await storyApi.create(payload)
    navigate('/admin/stories')
  }

  return <StoryForm onSubmit={handleSubmit} />
}

export default StoryCreatePage
