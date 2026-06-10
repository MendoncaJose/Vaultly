import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api-client'
import type { WatchlistItem } from '../../types/watchlist'

export function useWatchlist() {
  return useQuery({
    queryKey: ['watchlist'],
    queryFn: () => api.get<{ items: WatchlistItem[] }>('/watchlist'),
    staleTime: 30_000,
  })
}

export function useAddToWatchlist() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: { symbol: string; assetType: string; currency: string }) =>
      api.post('/watchlist', input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['watchlist'] }),
  })
}

export function useRemoveFromWatchlist() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/watchlist/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['watchlist'] }),
  })
}
