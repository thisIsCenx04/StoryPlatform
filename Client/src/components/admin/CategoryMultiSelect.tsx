import type { Category } from '../../types/category'

interface Props {
  categories: Category[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
  dark?: boolean
}

const CategoryMultiSelect = ({ categories, selectedIds, onChange, dark = false }: Props) => {
  const remaining = categories.filter((c) => !selectedIds.includes(c.id))
  const add = (id: string) => {
    if (!id) return
    onChange([...selectedIds, id])
  }
  const remove = (id: string) => onChange(selectedIds.filter((c) => c !== id))

  const baseInput = dark
    ? 'w-full border rounded px-3 py-2 bg-slate-800 text-white border-slate-700'
    : 'w-full border rounded px-3 py-2 bg-white text-slate-900 border-slate-300'

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {selectedIds.map((id) => {
          const cat = categories.find((c) => c.id === id)
          return (
            <span
              key={id}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs border border-emerald-200"
            >
              {cat?.name || id}
              <button type="button" className="text-emerald-700 hover:text-emerald-900" onClick={() => remove(id)}>
                ×
              </button>
            </span>
          )
        })}
        {!selectedIds.length && (
          <span className={dark ? 'text-slate-400 text-sm' : 'text-slate-500 text-sm'}>Chưa chọn</span>
        )}
      </div>
      <select className={baseInput} value="" onChange={(e) => add(e.target.value)}>
        <option value="">-- Chọn thể loại --</option>
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