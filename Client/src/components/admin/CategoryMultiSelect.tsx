import type { Category } from '../../types/category'

interface Props {
  categories: Category[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
}

const CategoryMultiSelect = ({ categories, selectedIds, onChange }: Props) => {
  const remaining = categories.filter((c) => !selectedIds.includes(c.id))
  const add = (id: string) => {
    if (!id) return
    onChange([...selectedIds, id])
  }
  const remove = (id: string) => onChange(selectedIds.filter((c) => c !== id))

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {selectedIds.map((id) => {
          const cat = categories.find((c) => c.id === id)
          return (
            <span
              key={id}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs border"
              style={{
                background: 'rgba(255, 166, 99, 0.18)',
                borderColor: 'rgba(255, 166, 99, 0.35)',
                color: 'var(--text)',
              }}
            >
              {cat?.name || id}
              <button type="button" className="text-xs" onClick={() => remove(id)}>
                x
              </button>
            </span>
          )
        })}
        {!selectedIds.length && <span className="text-sm admin-muted">Ch06a ch69n</span>}
      </div>
      <select className="admin-input w-full" value="" onChange={(e) => add(e.target.value)}>
        <option value="">-- Ch69n th69 lo55i --</option>
        {remaining.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default CategoryMultiSelect
