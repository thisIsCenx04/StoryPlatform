import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { SortableItem } from './sortable/SummarySortableItem'
import type { StorySummarySection } from '../../types/story'
import type { DragEndEvent } from '@dnd-kit/core'
import { useState } from 'react'

interface Props {
  value: StorySummarySection[]
  onChange: (sections: StorySummarySection[]) => void
}

const StorySummaryEditor = ({ value, onChange }: Props) => {
  const [nextId, setNextId] = useState(() => value.length + 1)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = value.findIndex((item) => item.id === active.id)
      const newIndex = value.findIndex((item) => item.id === over.id)
      const reordered = arrayMove(value, oldIndex, newIndex).map((section, idx) => ({
        ...section,
        sortOrder: idx + 1,
      }))
      onChange(reordered)
    }
  }

  const handleFieldChange = (id: string | number, field: keyof StorySummarySection, val: any) => {
    const updated = value.map((section) => (section.id === id ? { ...section, [field]: val } : section))
    onChange(updated)
  }

  const addBlock = () => {
    const id = `new-${nextId}`
    setNextId((n) => n + 1)
    onChange([
      ...value,
      {
        id,
        sortOrder: value.length + 1,
        textContent: '',
        imageUrl: '',
      },
    ])
  }

  const removeBlock = (id: string | number) => {
    onChange(
      value
        .filter((s) => s.id !== id)
        .map((s, idx) => ({
          ...s,
          sortOrder: idx + 1,
        }))
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Tóm tắt (kéo thả để sắp xếp)</h3>
        <button type="button" className="text-emerald-600 text-sm" onClick={addBlock}>
          + Thêm block
        </button>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={value.map((v) => v.id ?? v.sortOrder)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {value.map((section) => (
              <SortableItem key={section.id ?? section.sortOrder} id={section.id ?? section.sortOrder}>
                <div className="border rounded p-3 space-y-3 bg-white shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Block #{section.sortOrder}</span>
                    {value.length > 1 && (
                      <button
                        type="button"
                        className="text-rose-600 text-xs"
                        onClick={() => removeBlock(section.id ?? section.sortOrder)}
                      >
                        Xóa
                      </button>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Nội dung</label>
                    <textarea
                      className="w-full border rounded px-2 py-1"
                      rows={3}
                      value={section.textContent || ''}
                      onChange={(e) => handleFieldChange(section.id ?? section.sortOrder, 'textContent', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Ảnh</label>
                    <input
                      className="w-full border rounded px-2 py-1"
                      value={section.imageUrl || ''}
                      onChange={(e) => handleFieldChange(section.id ?? section.sortOrder, 'imageUrl', e.target.value)}
                    />
                  </div>
                </div>
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}

export default StorySummaryEditor
