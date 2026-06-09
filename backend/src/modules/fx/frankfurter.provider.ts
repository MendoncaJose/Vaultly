import type { FxProvider, FxRate } from './fx.types'

interface FrankfurterResponse {
  amount: number
  base: string
  date: string
  rates: Record<string, number>
}

async function fetchRate(from: string, to: string): Promise<FxRate> {
  if (from === to) {
    return { fromCurrency: from, toCurrency: to, rate: 1, fetchedAt: new Date() }
  }

  const url = `https://api.frankfurter.app/latest?from=${from}&to=${to}`
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`Frankfurter request failed: ${res.status} ${res.statusText}`)
  }

  const data = (await res.json()) as FrankfurterResponse
  const rate = data.rates[to]

  if (rate == null) {
    throw new Error(`No rate returned for ${from}→${to}`)
  }

  return { fromCurrency: from, toCurrency: to, rate, fetchedAt: new Date() }
}

export const frankfurterProvider: FxProvider = {
  getRate(from: string, to: string): Promise<FxRate> {
    return fetchRate(from, to)
  },
}
