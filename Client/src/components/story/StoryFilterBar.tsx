import { useRef } from 'react'

interface Props {
  onFilter: (filters: { hot?: boolean; recommended?: boolean; keyword?: string }) => void
}

const StoryFilterBar = ({ onFilter }: Props) => {
  const formRef = useRef<HTMLFormElement | null>(null)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    onFilter({
      keyword: String(form.get('keyword') ?? ''),
      hot: form.get('hot') === 'on',
      recommended: form.get('recommended') === 'on',
    })
  }

  const handleClear = () => {
    formRef.current?.reset()
    onFilter({ keyword: '', hot: false, recommended: false })
  }

  return (
    <form ref={formRef} className="surface flex flex-wrap items-center gap-3 rounded-lg p-3 mb-4" onSubmit={handleSubmit}>
      <input
        name="keyword"
        placeholder="Tìm kiếm truyện..."
        className="flex-1 min-w-[200px] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        style={{ background: 'var(--input-bg)', color: 'var(--text)', border: '1px solid var(--border)' }}
      />
      <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--text)' }}>
        <input type="checkbox" name="hot" /> Hot
      </label>
      <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--text)' }}>
        <input type="checkbox" name="recommended" /> Đề cử
      </label>
      <button
        type="submit"
        className="px-4 py-2 rounded text-sm font-medium accent-btn"
        style={{ border: '1px solid var(--border)' }}
      >
        Lọc
      </button>
      <button
        type="button"
        onClick={handleClear}
        className="px-4 py-2 rounded text-sm font-medium"
        style={{ border: '1px solid var(--border)', color: 'var(--text)' }}
      >
        Xóa
      </button>
    </form>
  )
}

export default StoryFilterBar
