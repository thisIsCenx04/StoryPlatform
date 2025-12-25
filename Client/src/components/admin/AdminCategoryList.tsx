import type { Category } from '../../types/category'

interface Props {
  categories: Category[]
  onEdit: (category: Category) => void
  onDelete: (id: string) => void
}

const AdminCategoryList = ({ categories, onEdit, onDelete }: Props) => {
  if (!categories.length) return <p className="text-sm admin-muted">Ch06a c th69 lo55i.</p>

  return (
    <div className="admin-card overflow-x-auto">
      <table className="admin-table text-sm">
        <thead>
          <tr>
            <th>Tn</th>
            <th>Slug</th>
            <th className="text-right">Thao tc</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.name}</td>
              <td className="admin-muted">{cat.slug}</td>
              <td className="text-right space-x-3">
                <button className="text-sm" style={{ color: 'var(--accent)' }} onClick={() => onEdit(cat)}>
                  S61a
                </button>
                <button className="text-sm" style={{ color: '#ff8b8b' }} onClick={() => onDelete(cat.id)}>
                  Xa
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
