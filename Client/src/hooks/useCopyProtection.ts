import { useEffect } from 'react'

export const useCopyProtection = (enabled: boolean) => {
  useEffect(() => {
    const prevent = (e: Event) => {
      e.preventDefault()
      e.stopPropagation()
    }

    if (enabled) {
      document.addEventListener('copy', prevent)
      document.addEventListener('cut', prevent)
      document.addEventListener('contextmenu', prevent)
      document.addEventListener('dragstart', prevent)
      document.addEventListener('selectstart', prevent)
    }

    return () => {
      document.removeEventListener('copy', prevent)
      document.removeEventListener('cut', prevent)
      document.removeEventListener('contextmenu', prevent)
      document.removeEventListener('dragstart', prevent)
      document.removeEventListener('selectstart', prevent)
    }
  }, [enabled])
}
