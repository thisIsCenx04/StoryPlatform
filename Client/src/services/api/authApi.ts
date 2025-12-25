import { buildApiUrl, apiConfig } from '../../config/apiConfig'
import type { AuthUser } from '../../types/common'

export interface LoginPayload {
  username: string
  password: string
}

export interface LoginResponseDto {
  token: string
  username: string
  role: AuthUser['role']
}

export const authApi = {
  async login(payload: LoginPayload): Promise<AuthUser> {
    const res = await fetch(buildApiUrl(apiConfig.adminLoginApiPath), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      throw new Error('0300ng nh67p th59t b55i')
    }
    const data = (await res.json()) as LoginResponseDto
    return { token: data.token, username: data.username, role: data.role }
  },
}
