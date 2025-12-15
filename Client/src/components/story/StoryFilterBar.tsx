interface Props {
  onFilter: (filters: { hot?: boolean; recommended?: boolean; keyword?: string }) => void
}

const StoryFilterBar = ({ onFilter }: Props) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    onFilter({
      keyword: String(form.get('keyword') ?? ''),
      hot: form.get('hot') === 'on',
      recommended: form.get('recommended') === 'on',
    })
  }

  return (
    <form
      className="flex flex-wrap items-center gap-3 bg-white border border-slate-200 rounded-lg p-3 mb-4"
      onSubmit={handleSubmit}
    >
      <input
        name="keyword"
        placeholder="Tìm kiếm truyện..."
        className="flex-1 min-w-[200px] border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="hot" /> Hot
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="recommended" /> Đề cử
      </label>
      <button
        type="submit"
        className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 text-sm font-medium"
      >
        Lọc
      </button>
    </form>
  )
}

export default StoryFilterBar
