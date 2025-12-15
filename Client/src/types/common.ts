export type UserRole = 'ADMIN' | 'EDITOR' | 'USER'

export type AuthToken = string

export interface AuthUser {
  username: string
  role: UserRole
  token: AuthToken
}
