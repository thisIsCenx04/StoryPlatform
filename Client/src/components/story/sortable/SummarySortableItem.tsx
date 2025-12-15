import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import type { ReactNode } from 'react'

export const SortableItem = ({ id, children }: { id: string | number; children: ReactNode }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  )
}
