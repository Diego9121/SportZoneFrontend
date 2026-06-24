import { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  clearStoredSession,
  getStoredSession,
  setStoredSession,
} from '@/lib/auth-storage'
import type { AuthSession } from '@/lib/auth-storage'
import { AuthContext } from '@/modules/auth/auth-context'
import type { AuthContextValue } from '@/modules/auth/auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() => getStoredSession())

  const login = useCallback((data: AuthSession) => {
    setStoredSession(data)
    setSession(data)
  }, [])

  const logout = useCallback(() => {
    clearStoredSession()
    setSession(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ session, isAuthenticated: session !== null, login, logout }),
    [session, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
