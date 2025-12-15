import type { AuthUser } from '../types/common'

const STORAGE_KEY = 'storysite_auth'

let currentUser: AuthUser | null = loadFromStorage()
const listeners = new Set<(user: AuthUser | null) => void>()

function loadFromStorage(): AuthUser | null {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? (JSON.parse(stored) as AuthUser) : null
}

function persist(user: AuthUser | null) {
  currentUser = user
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
  listeners.forEach((l) => l(currentUser))
}

export const authStore = {
  getUser: () => currentUser,
  subscribe: (listener: (user: AuthUser | null) => void) => {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
  setUser: (user: AuthUser | null) => persist(user),
  clear: () => persist(null),
}
