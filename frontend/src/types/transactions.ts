export interface Transaction {
  id: string
  type: 'BUY' | 'SELL'
  quantity: string
  pricePerUnit: string
  fee: string
  grossAmount: string
  netAmount: string
  currency: string
  transactedAt: string
  createdAt: string
  asset: { symbol: string; name: string; type: string }
}
