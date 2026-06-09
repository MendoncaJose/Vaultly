import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api-client'
import type { Holding } from '../../types/holdings'

export function useHoldings(assetType?: string) {
  const params = assetType ? `?assetType=${assetType}` : ''
  return useQuery({
    queryKey: ['holdings', assetType ?? 'all'],
    queryFn: () => api.get<{ holdings: Holding[] }>(`/holdings${params}`),
    staleTime: 30_000,
  })
}

interface BuyInput {
  symbol: string
  assetType: string
  name?: string
  quantity: number
  pricePerUnit: number
  fee: number
  currency: string
  transactedAt?: string
}

interface SellInput extends BuyInput {}

export function useBuyTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: BuyInput) => api.post('/transactions/buy', input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['holdings'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useSellTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: SellInput) => api.post('/transactions/sell', input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['holdings'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
