import type { Category } from '../../types/category'

interface Props {
  categories: Category[]
  storyCounts: Record<string, number>
  onEdit: (category: Category) => void
  onDelete: (id: string) => void
}

const AdminCategoryList = ({ categories, storyCounts, onEdit, onDelete }: Props) => {
  if (!categories.length) return <p className="text-sm admin-muted">Chưa có thể loại.</p>

  return (
    <div className="admin-card overflow-x-auto">
      <table className="admin-table text-sm">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Thẻ slug</th>
            <th className="text-center">Số truyện đang mở</th>
            <th className="text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.name}</td>
              <td className="admin-muted">{cat.slug}</td>
              <td className="text-center">{storyCounts[cat.id] ?? 0}</td>
              <td className="text-right space-x-3">
                <button className="text-sm mr-5" style={{ color: 'var(--accent)' }} onClick={() => onEdit(cat)}>
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
