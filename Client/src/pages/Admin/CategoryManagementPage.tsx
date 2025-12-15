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

  const load = async () => {
    try {
      const data = await categoryApi.listAdmin()
      setCategories(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Khong the tai the loai')
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
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Xoa the loai nay?')) return
    await categoryApi.remove(id)
    load()
  }

  const filtered = keyword
    ? categories.filter((c) => c.name.toLowerCase().includes(keyword.toLowerCase()))
    : categories

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Quan ly the loai</h1>
        <button
          className="text-sm text-emerald-600"
          onClick={() => setEditing({ id: '', name: '', slug: '', description: '', parentId: null })}
        >
          + Them the loai
        </button>
      </div>

      <div className="flex items-center gap-2">
        <input
          className="border rounded px-3 py-2 w-full max-w-md"
          placeholder="Tim kiem the loai..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <AdminCategoryList categories={filtered} onEdit={(c) => setEditing(c)} onDelete={handleDelete} />

      <div className="border rounded p-4 bg-white shadow-sm">
        <h2 className="text-lg font-semibold mb-2">{editing?.id ? 'Chinh sua' : 'Them moi'}</h2>
        <AdminCategoryForm
          initial={editing}
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={() => setEditing(null)}
        />
      </div>
    </div>
  )
}

export default CategoryManagementPage
