export type StoryStatus = 'ONGOING' | 'COMPLETED' | 'PAUSED' | 'DROPPED'

export interface StorySummarySection {
  id?: string
  tempId?: string
  sortOrder: number
  textContent?: string
  imageUrl?: string
}

export interface Story {
  id: string
  slug: string
  title: string
  coverImageUrl?: string
  authorName?: string
  shortDescription?: string
  storyStatus: StoryStatus
  totalChapters: number
  hot: boolean
  recommended: boolean
  viewCount?: number
  likeCount?: number
  categoryIds: string[]
  summarySections: StorySummarySection[]
}

export interface Category {
  id: string
  name: string
  slug: string
}

export interface StoryRequestPayload {
  slug: string
  title: string
  coverImageUrl?: string
  authorName?: string
  shortDescription?: string
  storyStatus: StoryStatus
  totalChapters: number
  hot: boolean
  recommended: boolean
  categoryIds: string[]
  summarySections: StorySummarySection[]
}
