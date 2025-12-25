import React from 'react'

import AdminCategoryForm from '../../components/admin/AdminCategoryForm'
import AdminCategoryList from '../../components/admin/AdminCategoryList'
import { categoryApi } from '../../services/api/categoryApi'
import type { Category, CategoryPayload } from '../../types/category'

const CategoryManagementPage = () => {
  const [categories, setCategories] = React.useState<Category[]>([])
  const [editing, setEditing] = React.useState<Category | null>(null)
  const [keyword, setKeyword] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [modalOpen, setModalOpen] = React.useState(false)

  const load = async () => {
    try {
      const data = await categoryApi.listAdmin()
      setCategories(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải thể loại')
    }
  }

  React.useEffect(() => {
    load()
  }, [])

  const handleSubmit = async (payload: CategoryPayload, id?: string) => {
    if (id) {
      await categoryApi.update(id, payload)
    } else {
      await categoryApi.create(payload)
    }
    setEditing(null)
    setModalOpen(false)
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa thể loại này?')) return
    await categoryApi.remove(id)
    load()
  }

  const filtered = keyword
    ? categories.filter((c) => c.name.toLowerCase().includes(keyword.toLowerCase()))
    : categories

  const startCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const startEdit = (cat: Category) => {
    setEditing(cat)
    setModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em]" style={{ color: 'var(--accent)' }}>
            Thể loại
          </p>
          <h1 className="text-2xl font-semibold">Quản lý thể loại</h1>
          <p className="text-sm admin-muted">Thêm mới, chỉnh sửa, sắp xếp danh mục.</p>
        </div>
        <button className="admin-button admin-button-primary" onClick={startCreate}>
          + Thêm thể loại
        </button>
      </div>

      <div className="admin-card p-4 flex flex-wrap items-center gap-3">
        <input
          className="admin-input w-full max-w-lg"
          placeholder="Tìm kiếm thể loại..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <span className="text-xs admin-muted">Tổng: {filtered.length}</span>
      </div>

      {error && <p className="text-sm" style={{ color: '#ff8b8b' }}>{error}</p>}

      <AdminCategoryList categories={filtered} onEdit={startEdit} onDelete={handleDelete} />

      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="admin-card w-full max-w-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {editing ? 'Chỉnh sửa thể loại' : 'Thêm thể loại'}
              </h2>
              <button className="admin-button admin-button-secondary" onClick={() => setModalOpen(false)}>
                Đóng
              </button>
            </div>
            <AdminCategoryForm initial={editing} onSubmit={handleSubmit} onCancel={() => setModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryManagementPage
