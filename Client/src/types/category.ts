export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  parentId?: string | null
}

export interface CategoryPayload {
  name: string
  slug: string
  description?: string
  parentId?: string | null
}
