const AUTH_STORAGE_KEY = 'sportzone_auth'

export interface AuthSession {
  token: string
  usuarioId: number
  nombre: string
  email: string
  rolNombre: string
  expiraEn: string
}

export function getStoredSession(): AuthSession | null {
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AuthSession) : null
  } catch {
    return null
  }
}

export function setStoredSession(session: AuthSession) {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
}

export function clearStoredSession() {
  window.localStorage.removeItem(AUTH_STORAGE_KEY)
}
