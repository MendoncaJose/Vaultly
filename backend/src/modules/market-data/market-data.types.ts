export interface NormalizedQuote {
  symbol: string
  price: number
  change: number
  changePercent: number
  high: number
  low: number
  open: number
  previousClose: number
  timestamp: Date
}

export interface MarketDataProvider {
  getQuote(symbol: string): Promise<NormalizedQuote>
  getQuotes(symbols: string[]): Promise<NormalizedQuote[]>
}

export interface QuoteResult {
  quote: NormalizedQuote
  fromCache: boolean
  stale: boolean
}
