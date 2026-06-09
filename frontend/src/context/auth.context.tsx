import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { PublicUser } from '../types/auth'

interface AuthContextValue {
  user: PublicUser | null
  accessToken: string | null
  setAuth: (user: PublicUser, accessToken: string) => void
  clearAuth: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  const setAuth = useCallback((u: PublicUser, token: string) => {
    setUser(u)
    setAccessToken(token)
  }, [])

  const clearAuth = useCallback(() => {
    setUser(null)
    setAccessToken(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, accessToken, setAuth, clearAuth, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
