import { useQuery } from '@tanstack/react-query'
import { api } from '../api-client'
import type { Transaction } from '../../types/transactions'

export function useTransactions() {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: () => api.get<{ transactions: Transaction[] }>('/transactions'),
    staleTime: 30_000,
  })
}
