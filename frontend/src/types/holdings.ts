export interface HoldingAsset {
  id: string
  symbol: string
  name: string
  type: string
  currency: string
  exchange: string | null
}

export interface Holding {
  id: string
  assetId: string
  quantity: string
  averageBuyPrice: string
  totalCost: string
  status: 'OPEN' | 'CLOSED'
  currency: string
  asset: HoldingAsset
}
