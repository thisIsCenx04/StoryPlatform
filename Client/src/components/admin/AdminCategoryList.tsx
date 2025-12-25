import type { Category } from '../../types/category'

interface Props {
  categories: Category[]
  onEdit: (category: Category) => void
  onDelete: (id: string) => void
}

const AdminCategoryList = ({ categories, onEdit, onDelete }: Props) => {
  if (!categories.length) return <p className="text-sm admin-muted">Chưa có thể loại.</p>

  return (
    <div className="admin-card overflow-x-auto">
      <table className="admin-table text-sm">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Slug</th>
            <th className="text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.name}</td>
              <td className="admin-muted">{cat.slug}</td>
              <td className="text-right space-x-3">
                <button className="text-sm" style={{ color: 'var(--accent)' }} onClick={() => onEdit(cat)}>
                  Sửa
                </button>
                <button className="text-sm" style={{ color: '#ff8b8b' }} onClick={() => onDelete(cat.id)}>
                  Xóa
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
