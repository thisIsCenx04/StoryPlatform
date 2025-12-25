import { useState } from 'react'
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
import type { DragEndEvent } from '@dnd-kit/core'

import { SortableItem } from './sortable/SummarySortableItem'
import type { StorySummarySection } from '../../types/story'
import { uploadApi } from '../../services/api/uploadApi'

interface Props {
  value: StorySummarySection[]
  onChange: (sections: StorySummarySection[]) => void
}

const StorySummaryEditor = ({ value, onChange }: Props) => {
  const [nextId, setNextId] = useState(() => value.length + 1)
  const [uploadingId, setUploadingId] = useState<string | number | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

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

  const handlePaste = (id: string | number, rawText: string) => {
    const lines = rawText
      .replace(/\r/g, '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
    if (lines.length <= 1) return false

    const index = value.findIndex((section) => getKey(section) === id)
    if (index === -1) return false

    const current = value[index]
    const merged = current.textContent ? `${current.textContent}\n${lines[0]}` : lines[0]

    const idSeed = nextId
    const newBlocks = lines.slice(1).map((content, idx) => ({
      tempId: `temp-${idSeed + idx}`,
      sortOrder: 0,
      textContent: content,
      imageUrl: '',
    }))
    setNextId(idSeed + newBlocks.length)

    const updated = [...value]
    updated[index] = { ...current, textContent: merged }
    updated.splice(index + 1, 0, ...newBlocks)
    const normalized = updated.map((section, idx) => ({ ...section, sortOrder: idx + 1 }))
    onChange(normalized)
    return true
  }

  const handleImageUpload = async (id: string | number, file?: File | null) => {
    if (!file) return
    setUploadingId(id)
    setUploadError(null)
    try {
      const response = await uploadApi.uploadImage(file)
      handleFieldChange(id, 'imageUrl', response.url)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload 57nh th59t b55i')
    } finally {
      setUploadingId(null)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Tm t69t (ko th57 0469 s69p x65p)</h3>
          <p className="text-xs admin-muted mt-1">Dn nhi67u dng s63 t65 tch thnh nhi67u block.</p>
        </div>
        <button type="button" className="admin-button admin-button-secondary text-sm" onClick={addBlock}>
          + Thm block
        </button>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={value.map((v) => getKey(v))} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {value.map((section) => (
              <SortableItem key={getKey(section)} id={getKey(section)}>
                {({ setNodeRef, style, handleProps }) => (
                  <div ref={setNodeRef} style={style} className="admin-panel p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs admin-muted">Block #{section.sortOrder}</span>
                      <div className="flex items-center gap-3">
                        <span
                          className="cursor-grab text-xs admin-muted"
                          title="Ko 0469 s69p x65p"
                          {...handleProps}
                        >
                          drag
                        </span>
                        {value.length > 1 && (
                          <button
                            type="button"
                            className="text-xs"
                            style={{ color: '#c24158' }}
                            onClick={() => removeBlock(getKey(section))}
                          >
                            Xa
                          </button>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs mb-1 admin-muted">N61i dung</label>
                      <textarea
                        className="admin-input w-full"
                        rows={3}
                        value={section.textContent || ''}
                        onChange={(e) => handleFieldChange(getKey(section), 'textContent', e.target.value)}
                        onPaste={(event) => {
                          const text = event.clipboardData.getData('text')
                          if (text && text.includes('\n')) {
                            event.preventDefault()
                            handlePaste(getKey(section), text)
                          }
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1 admin-muted">56nh minh h69a (upload)</label>
                      <input
                        type="file"
                        accept="image/*"
                        className="admin-input w-full"
                        onChange={(e) => handleImageUpload(getKey(section), e.target.files?.[0])}
                      />
                      {uploadingId === getKey(section) && (
                        <div className="text-xs admin-muted mt-2">03ang t57i 57nh...</div>
                      )}
                      {section.imageUrl && (
                        <img
                          src={section.imageUrl}
                          alt=""
                          className="w-full rounded-lg mt-3"
                          style={{ border: '1px solid var(--border)' }}
                          loading="lazy"
                        />
                      )}
                      {uploadError && <div className="text-xs mt-2" style={{ color: '#c24158' }}>{uploadError}</div>}
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
