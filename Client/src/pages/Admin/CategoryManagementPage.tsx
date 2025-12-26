import React from 'react'

import AdminCategoryForm from '../../components/admin/AdminCategoryForm'
import AdminCategoryList from '../../components/admin/AdminCategoryList'
import { categoryApi } from '../../services/api/categoryApi'
import { storyApi } from '../../services/api/storyApi'
import type { Category, CategoryPayload } from '../../types/category'

const CategoryManagementPage = () => {
  const [categories, setCategories] = React.useState<Category[]>([])
  const [storyCounts, setStoryCounts] = React.useState<Record<string, number>>({})
  const [editing, setEditing] = React.useState<Category | null>(null)
  const [keyword, setKeyword] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [modalOpen, setModalOpen] = React.useState(false)

  const load = async () => {
    try {
      const [categoryData, storyList] = await Promise.all([
        categoryApi.listAdmin(),
        storyApi.adminList(),
      ])
      setCategories(categoryData)
      const counts: Record<string, number> = {}
      storyList.forEach((story) => {
        story.categoryIds?.forEach((id) => {
          counts[id] = (counts[id] ?? 0) + 1
        })
      })
      setStoryCounts(counts)
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
    const count = storyCounts[id] ?? 0
    if (count > 0) {
      alert(`Không thể xóa thể loại này vì đang có ${count} truyện.`)
      return
    }
    const target = categories.find((cat) => cat.id === id)
    const name = target?.name ?? 'thể loại'
    if (!confirm(`Xóa thể loại "${name}"?`)) return
    try {
      await categoryApi.remove(id)
      alert('Đã xóa thể loại thành công.')
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể xóa thể loại')
    }
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

      <AdminCategoryList
        categories={filtered}
        storyCounts={storyCounts}
        onEdit={startEdit}
        onDelete={handleDelete}
      />

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

