import type { Category } from '../../types/category'
import type { Story } from '../../types/story'
import StoryCard from './StoryCard'

interface Props {
  stories: Story[]
  categories?: Category[]
}

const StoryList = ({ stories, categories }: Props) => {
  if (!stories.length) {
    return <p className="text-sm muted">Không có truyện.</p>
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stories.map((story) => (
        <StoryCard key={story.id} story={story} categories={categories} />
      ))}
    </div>
  )
}

export default StoryList
