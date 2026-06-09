import { useQuery } from '@tanstack/react-query'
import { api } from '../api-client'
import type { DashboardData, Period } from '../../types/dashboard'

export function useDashboard(period: Period) {
  return useQuery({
    queryKey: ['dashboard', period],
    queryFn: () => api.get<DashboardData>(`/dashboard?period=${period}`),
    staleTime: 30_000,
  })
}
