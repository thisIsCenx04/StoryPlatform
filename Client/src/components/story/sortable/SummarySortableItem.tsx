import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import type { ReactNode, CSSProperties, HTMLAttributes } from 'react'

type RenderProps = {
  setNodeRef: (node: HTMLElement | null) => void
  style: CSSProperties
  handleProps: HTMLAttributes<HTMLElement>
  isDragging: boolean
}

export const SortableItem = ({
  id,
  children,
}: {
  id: string | number
  children: (props: RenderProps) => ReactNode
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  }

  return <>{children({ setNodeRef, style, handleProps: { ...attributes, ...listeners }, isDragging })}</>
}
