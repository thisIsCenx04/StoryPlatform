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

  const getKey = (section: StorySummarySection) => section.id ?? section.tempId ?? section.sortOrder

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = value.findIndex((item) => getKey(item) === active.id)
      const newIndex = value.findIndex((item) => getKey(item) === over.id)
      const reordered = arrayMove(value, oldIndex, newIndex).map((section, idx) => ({
        ...section,
        sortOrder: idx + 1,
      }))
      onChange(reordered)
    }
  }

  const handleFieldChange = (id: string | number, field: keyof StorySummarySection, val: any) => {
    const updated = value.map((section) => (getKey(section) === id ? { ...section, [field]: val } : section))
    onChange(updated)
  }

  const addBlock = () => {
    const id = `temp-${nextId}`
    setNextId((n) => n + 1)
    onChange([
      ...value,
      {
        tempId: id,
        sortOrder: value.length + 1,
        textContent: '',
        imageUrl: '',
      },
    ])
  }

  const removeBlock = (id: string | number) => {
    onChange(
      value
        .filter((s) => getKey(s) !== id)
        .map((s, idx) => ({
          ...s,
          sortOrder: idx + 1,
        }))
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800">Tóm tắt (kéo thả để sắp xếp)</h3>
        <button type="button" className="text-emerald-600 text-sm" onClick={addBlock}>
          + Thêm block
        </button>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={value.map((v) => getKey(v))} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {value.map((section) => (
              <SortableItem key={getKey(section)} id={getKey(section)}>
                {({ setNodeRef, style, handleProps }) => (
                  <div
                    ref={setNodeRef}
                    style={style}
                    className="border rounded p-3 space-y-3 bg-white text-slate-900 border-slate-200 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">Block #{section.sortOrder}</span>
                      <div className="flex items-center gap-3">
                        <span
                          className="cursor-grab text-slate-400 hover:text-slate-600 text-sm"
                          title="Kéo để sắp xếp"
                          {...handleProps}
                        >
                          ↕
                        </span>
                        {value.length > 1 && (
                          <button
                            type="button"
                            className="text-rose-600 text-xs"
                        onClick={() => removeBlock(getKey(section))}
                          >
                            Xóa
                          </button>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs mb-1 text-slate-600">Nội dung</label>
                      <textarea
                        className="w-full border rounded px-2 py-1 bg-white text-slate-900 border-slate-300"
                        rows={3}
                        value={section.textContent || ''}
                        onChange={(e) => handleFieldChange(getKey(section), 'textContent', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1 text-slate-600">Ảnh</label>
                      <input
                        className="w-full border rounded px-2 py-1 bg-white text-slate-900 border-slate-300"
                        value={section.imageUrl || ''}
                        onChange={(e) => handleFieldChange(getKey(section), 'imageUrl', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}

export default StorySummaryEditor
