import { useEffect, useState } from 'react'

import { themeStore, type ThemeMode } from '../store/themeStore'

export const useTheme = () => {
  const [theme, setTheme] = useState<ThemeMode>(() => themeStore.getTheme())

  useEffect(() => {
    const unsub = themeStore.subscribe(setTheme)
    return () => {
      if (unsub) unsub()
    }
  }, [])

  const set = (mode: ThemeMode) => themeStore.setTheme(mode)
  const toggle = () => themeStore.toggle()

  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
  }, [theme])

  return { theme, setTheme: set, toggle }
}
