export type Period = 'TODAY' | '7D' | '1M' | '3M' | '1Y' | 'ALL'

export interface HoldingSummary {
  holdingId: string
  assetId: string
  symbol: string
  name: string
  type: string
  quantity: number
  averageBuyPrice: number
  totalCost: number
  currentPrice: number
  currentValue: number
  pl: number
  plPercent: number
  dailyChange: number
  dailyChangePercent: number
  currency: string
  stale: boolean
}

export interface RecentTransaction {
  id: string
  type: 'BUY' | 'SELL'
  quantity: string
  pricePerUnit: string
  fee: string
  grossAmount: string
  netAmount: string
  currency: string
  transactedAt: string
  asset: { symbol: string; name: string; type: string }
}

export interface DashboardData {
  totalValue: number
  totalCost: number
  totalPl: number
  totalPlPercent: number
  dailyPl: number
  dailyPlPercent: number
  currency: string
  holdings: {
    all: HoldingSummary[]
    byType: { STOCK: HoldingSummary[]; ETF: HoldingSummary[]; CRYPTO: HoldingSummary[] }
  }
  topGainers: HoldingSummary[]
  topLosers: HoldingSummary[]
  recentTransactions: RecentTransaction[]
  activeAlerts: number
}
