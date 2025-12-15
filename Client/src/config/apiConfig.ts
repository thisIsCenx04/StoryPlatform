const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'
const ADMIN_LOGIN_API_PATH = import.meta.env.VITE_API_ADMIN_LOGIN_PATH ?? '/__internal__/auth/login'
const ADMIN_LOGIN_PAGE_PATH = import.meta.env.VITE_ADMIN_LOGIN_PAGE ?? '/__internal__/login'

export const apiConfig = {
  baseUrl: API_BASE_URL,
  adminLoginApiPath: ADMIN_LOGIN_API_PATH,
  adminLoginPagePath: ADMIN_LOGIN_PAGE_PATH,
}

export const buildApiUrl = (path: string) => `${apiConfig.baseUrl}${path}`
