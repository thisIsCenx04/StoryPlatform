import type { Category } from '../../types/category'

interface Props {
  categories: Category[]
  onEdit: (category: Category) => void
  onDelete: (id: string) => void
}

const AdminCategoryList = ({ categories, onEdit, onDelete }: Props) => {
  if (!categories.length) return <p className="text-sm text-slate-500">Chua co the loai.</p>

  return (
    <div className="overflow-x-auto border rounded">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50">
          <tr className="text-left text-slate-500">
            <th className="px-3 py-2">Ten</th>
            <th className="px-3 py-2">Slug</th>
            <th className="px-3 py-2">Parent</th>
            <th className="px-3 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id} className="border-t">
              <td className="px-3 py-2">{cat.name}</td>
              <td className="px-3 py-2 text-slate-500">{cat.slug}</td>
              <td className="px-3 py-2 text-slate-500">
                {categories.find((c) => c.id === cat.parentId)?.name || '-'}
              </td>
              <td className="px-3 py-2 text-right space-x-3">
                <button className="text-emerald-600" onClick={() => onEdit(cat)}>
                  Sua
                </button>
                <button className="text-rose-600" onClick={() => onDelete(cat.id)}>
                  Xoa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminCategoryList
