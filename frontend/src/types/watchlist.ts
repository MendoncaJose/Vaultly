export interface WatchlistItem {
  id: string
  assetId: string
  createdAt: string
  asset: { id: string; symbol: string; name: string; type: string; currency: string }
  quote: {
    price: number
    change: number
    changePercent: number
  } | null
  stale: boolean
}
