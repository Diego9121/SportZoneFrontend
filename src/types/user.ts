export type UserRole = 'admin' | 'vendedor'

export interface AppUser {
  name: string
  email: string
  role: UserRole
  avatarUrl?: string
}
