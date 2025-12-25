const STORAGE_KEY = 'storysite_theme'

export type ThemeMode = 'light' | 'dark'

const defaultTheme: ThemeMode =
  (typeof window !== 'undefined' && (localStorage.getItem(STORAGE_KEY) as ThemeMode | null)) || 'light'

let currentTheme: ThemeMode = defaultTheme
const listeners = new Set<(theme: ThemeMode) => void>()

const persist = (theme: ThemeMode) => {
  currentTheme = theme
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, theme)
  }
  listeners.forEach((l) => l(currentTheme))
}

export const themeStore = {
  getTheme: () => currentTheme,
  setTheme: (theme: ThemeMode) => persist(theme),
  toggle: () => persist(currentTheme === 'dark' ? 'light' : 'dark'),
  subscribe: (listener: (theme: ThemeMode) => void) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}
