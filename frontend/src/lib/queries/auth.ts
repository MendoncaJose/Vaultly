import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api, setAccessToken } from '../api-client'
import { useAuth } from '../../context/auth.context'
import type { PublicUser } from '../../types/auth'

export function useUpdateCurrency() {
  const queryClient = useQueryClient()
  const { setAuth, accessToken } = useAuth()

  return useMutation({
    mutationFn: (currency: string) =>
      api.patch<{ user: PublicUser }>('/auth/me', { preferredCurrency: currency }),
    onSuccess: ({ user }) => {
      if (accessToken) {
        setAccessToken(accessToken)
        setAuth(user, accessToken)
      }
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
