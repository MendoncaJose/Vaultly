export interface FxRate {
  fromCurrency: string
  toCurrency: string
  rate: number
  fetchedAt: Date
}

export interface FxProvider {
  getRate(from: string, to: string): Promise<FxRate>
}
