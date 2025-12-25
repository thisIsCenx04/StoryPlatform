import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { useTheme } from '../hooks/useTheme'
import { storyApi } from '../services/api/storyApi'
import type { Story } from '../types/story'

const Header = () => {
  const { theme, toggle } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [stories, setStories] = useState<Story[]>([])
  const [isFocused, setIsFocused] = useState(false)
  const isActive = (path: string) => location.pathname.startsWith(path)

  useEffect(() => {
    storyApi
      .list()
      .then((data) => setStories(data))
      .catch(() => setStories([]))
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const q = params.get('q') ?? ''
    if (q && q !== keyword) {
      setKeyword(q)
    }
  }, [keyword, location.search])

  const suggestions = useMemo(() => {
    const q = keyword.trim().toLowerCase()
    if (!q) return []
    return stories
      .map((story) => {
        const title = story.title?.toLowerCase() ?? ''
        const author = story.authorName?.toLowerCase() ?? ''
        const slug = story.slug?.toLowerCase() ?? ''
        let score = -1
        if (title.startsWith(q)) score = 0
        else if (title.includes(q)) score = 1
        else if (author.includes(q)) score = 2
        else if (slug.includes(q)) score = 3
        if (score < 0) return null
        return { story, score }
      })
      .filter((item): item is { story: Story; score: number } => Boolean(item))
      .sort((a, b) => {
        if (a.score !== b.score) return a.score - b.score
        const viewsDiff = (b.story.viewCount ?? 0) - (a.story.viewCount ?? 0)
        if (viewsDiff !== 0) return viewsDiff
        return a.story.title.localeCompare(b.story.title)
      })
      .slice(0, 6)
      .map((item) => item.story)
  }, [keyword, stories])

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = keyword.trim()
    navigate(`/stories${value ? `?q=${encodeURIComponent(value)}` : ''}`)
  }

  const selectSuggestion = (story: Story) => {
    setKeyword(story.title)
    navigate(`/stories?q=${encodeURIComponent(story.title)}`)
  }

  return (
    <header
      className="sticky top-0 z-20 shadow-sm"
      style={{
        background: 'linear-gradient(120deg, rgba(59, 130, 246, 0.12), rgba(147, 197, 253, 0.18))',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-6 text-sm" style={{ color: 'var(--text)' }}>
        <Link
          to="/"
          className="text-lg font-semibold tracking-wide hover:opacity-90 px-2 py-1 rounded-md"
          style={{ color: 'var(--text)', background: 'rgba(59, 130, 246, 0.12)' }}
        >
          StoryHub
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            to="/"
            className={`px-1 py-1 transition-colors ${isActive('/') ? 'font-semibold border-b-2 pb-1' : ''}`}
            style={
              isActive('/')
                ? { borderColor: 'var(--accent)', color: 'var(--accent)' }
                : { color: 'var(--text)', borderColor: 'transparent' }
            }
          >
            Trang chủ
          </Link>
          <Link
            to="/stories"
            className={`px-1 py-1 transition-colors ${isActive('/stories') ? 'font-semibold border-b-2 pb-1' : ''}`}
            style={
              isActive('/stories')
                ? { borderColor: 'var(--accent)', color: 'var(--accent)' }
                : { color: 'var(--text)', borderColor: 'transparent' }
            }
          >
            Truyện
          </Link>
          <Link
            to="/donate"
            className={`px-1 py-1 transition-colors ${isActive('/donate') ? 'font-semibold border-b-2 pb-1' : ''}`}
            style={
              isActive('/donate')
                ? { borderColor: 'var(--accent)', color: 'var(--accent)' }
                : { color: 'var(--text)', borderColor: 'transparent' }
            }
          >
            Ủng hộ
          </Link>
        </nav>

        <div className="flex-1" />

        <form onSubmit={submitSearch} className="flex items-center gap-2">
          <div className="relative hidden sm:block">
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Tìm truyện..."
              className="h-10 rounded-full px-4 text-sm w-64"
              style={{ border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
            />
            {isFocused && suggestions.length > 0 && (
              <div
                className="absolute left-0 right-0 mt-2 rounded-2xl border shadow-lg overflow-hidden"
                style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
              >
                {suggestions.map((story) => (
                  <button
                    key={story.id}
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectSuggestion(story)}
                    className="w-full text-left px-4 py-2 text-sm hover:opacity-80"
                    style={{ color: 'var(--text)' }}
                  >
                    <div className="font-medium">{story.title}</div>
                    {story.authorName && <div className="text-xs muted">{story.authorName}</div>}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="hidden sm:flex items-center justify-center h-10 px-4 rounded-full text-sm font-semibold"
            style={{ background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)' }}
          >
            Tìm
          </button>
        </form>

        <button
          onClick={toggle}
          className="flex items-center justify-center h-10 w-10 rounded-full border"
          style={{ borderColor: 'var(--border)', background: 'var(--card)', color: 'var(--text)' }}
          aria-label="Toggle theme"
          title={theme === 'dark' ? 'Chuyển sang sáng' : 'Chuyển sang tối'}
        >
          {theme === 'dark' ? '☀' : '🌙'}
        </button>
      </div>
    </header>
  )
}

export default Header
