import { env } from '../../config/env'
import type { MarketDataProvider, NormalizedQuote } from './market-data.types'

interface FinnhubQuoteResponse {
  c: number   // current price
  d: number   // change
  dp: number  // percent change
  h: number   // high
  l: number   // low
  o: number   // open
  pc: number  // previous close
  t: number   // timestamp (unix)
}

async function fetchQuote(symbol: string): Promise<NormalizedQuote> {
  const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${env.FINNHUB_API_KEY}`
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`Finnhub request failed: ${res.status} ${res.statusText}`)
  }

  const data = (await res.json()) as FinnhubQuoteResponse

  if (!data.c || data.c === 0) {
    throw new Error(`No quote data for symbol: ${symbol}`)
  }

  return {
    symbol,
    price: data.c,
    change: data.d ?? data.c - data.pc,
    changePercent: data.dp ?? ((data.c - data.pc) / data.pc) * 100,
    high: data.h,
    low: data.l,
    open: data.o,
    previousClose: data.pc,
    timestamp: new Date(data.t * 1000),
  }
}

export const finnhubProvider: MarketDataProvider = {
  getQuote(symbol: string): Promise<NormalizedQuote> {
    return fetchQuote(symbol)
  },

  async getQuotes(symbols: string[]): Promise<NormalizedQuote[]> {
    const unique = [...new Set(symbols)]
    const results = await Promise.allSettled(unique.map(fetchQuote))
    return results
      .filter((r): r is PromiseFulfilledResult<NormalizedQuote> => r.status === 'fulfilled')
      .map((r) => r.value)
  },
}
