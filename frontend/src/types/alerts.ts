export interface Alert {
  id: string
  type: 'PRICE_ABOVE' | 'PRICE_BELOW' | 'DAILY_CHANGE_PERCENT'
  targetValue: string
  isActive: boolean
  triggeredAt: string | null
  createdAt: string
  asset: { symbol: string; name: string; type: string }
}

export interface Notification {
  id: string
  type: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
}
