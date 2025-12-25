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
      .catch((err) => setError(err instanceof Error ? err.message : 'Không tải được truyện'))
  }, [id])

  const handleSubmit = async (payload: StoryRequestPayload) => {
    if (!id) return
    await storyApi.update(id, payload)
    navigate('/admin/stories')
  }

  if (error) return <p className="text-sm" style={{ color: '#ff8b8b' }}>{error}</p>
  if (!story) return <p className="admin-muted">Đang tải...</p>

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em]" style={{ color: 'var(--accent)' }}>
          Truyện
        </p>
        <h1 className="text-2xl font-semibold">Chỉnh sửa truyện</h1>
        <p className="text-sm admin-muted">Cập nhật nội dung, phân loại và trạng thái.</p>
      </div>
      <StoryForm initialValue={story} onSubmit={handleSubmit} />
    </div>
  )
}

export default StoryEditPage
