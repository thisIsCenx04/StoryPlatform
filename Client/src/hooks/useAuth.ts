import { useEffect, useState } from 'react'

import { authApi, type LoginPayload } from '../services/api/authApi'
import { authStore } from '../store/authStore'
import type { AuthUser } from '../types/common'

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(() => authStore.getUser())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    return authStore.subscribe(setUser)
  }, [])

  const login = async (payload: LoginPayload) => {
    setLoading(true)
    setError(null)
    try {
      const authUser = await authApi.login(payload)
      authStore.setUser(authUser)
      return authUser
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Co loi xay ra')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => authStore.clear()

  return { user, loading, error, login, logout, isAuthenticated: !!user }
}
