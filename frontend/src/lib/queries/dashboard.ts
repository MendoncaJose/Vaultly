import { useQuery } from '@tanstack/react-query'
import { api } from '../api-client'
import type { DashboardData, Period } from '../../types/dashboard'

export function useDashboard(period: Period = 'ALL') {
  return useQuery({
    queryKey: ['dashboard', period],
    queryFn: () => api.get<DashboardData>(`/dashboard?period=${period}`),
    staleTime: 30_000,
  })
}

export function useDashboardHoldingsMap() {
  const { data } = useDashboard('ALL')
  if (!data) return { map: {}, currency: 'EUR' }
  const map: Record<string, { currentValue: number; pl: number; plPercent: number; currentPrice: number }> = {}
  for (const h of data.holdings.all) {
    map[h.assetId] = {
      currentValue: h.currentValue,
      pl: h.pl,
      plPercent: h.plPercent,
      currentPrice: h.currentPrice,
    }
  }
  return { map, currency: data.currency }
}
