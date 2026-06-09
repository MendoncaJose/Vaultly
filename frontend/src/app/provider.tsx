import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, type ReactNode } from 'react'
import { AuthProvider, useAuth } from '../context/auth.context'
import { api, setAccessToken } from '../lib/api-client'
import type { PublicUser } from '../types/auth'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
})

function SessionRestorer({ children }: { children: ReactNode }) {
  const { setAuth } = useAuth()

  useEffect(() => {
    api
      .post<{ user: PublicUser; accessToken: string }>('/auth/refresh')
      .then(({ user, accessToken }) => {
        setAccessToken(accessToken)
        setAuth(user, accessToken)
      })
      .catch(() => {
        // no active session — stay logged out
      })
  }, [setAuth])

  return <>{children}</>
}

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SessionRestorer>{children}</SessionRestorer>
      </AuthProvider>
    </QueryClientProvider>
  )
}
