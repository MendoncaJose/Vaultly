import { prisma } from '../../lib/prisma'
import { env } from '../../config/env'
import { finnhubProvider } from './finnhub.provider'
import type { NormalizedQuote, QuoteResult } from './market-data.types'
import type { PriceSnapshot } from '../../generated/prisma'

const TTL_MS = env.MARKET_DATA_CACHE_TTL_SECONDS * 1000

function snapshotToQuote(s: PriceSnapshot): NormalizedQuote {
  const price = Number(s.price)
  return {
    symbol: s.symbol,
    price,
    change: s.change != null ? Number(s.change) : 0,
    changePercent: s.changePercent != null ? Number(s.changePercent) : 0,
    high: s.high != null ? Number(s.high) : price,
    low: s.low != null ? Number(s.low) : price,
    open: s.open != null ? Number(s.open) : price,
    previousClose: s.previousClose != null ? Number(s.previousClose) : price,
    timestamp: s.capturedAt,
  }
}

async function saveSnapshot(quote: NormalizedQuote, assetType: string): Promise<void> {
  await prisma.priceSnapshot.create({
    data: {
      symbol: quote.symbol,
      assetType: assetType as Parameters<typeof prisma.priceSnapshot.create>[0]['data']['assetType'],
      price: quote.price,
      change: quote.change,
      changePercent: quote.changePercent,
      high: quote.high,
      low: quote.low,
      open: quote.open,
      previousClose: quote.previousClose,
    },
  })
}

async function getValidSnapshot(
  symbol: string,
): Promise<{ snapshot: NormalizedQuote; stale: boolean } | null> {
  const latest = await prisma.priceSnapshot.findFirst({
    where: { symbol },
    orderBy: { capturedAt: 'desc' },
  })

  if (!latest) return null

  const age = Date.now() - latest.capturedAt.getTime()
  const stale = age > TTL_MS

  return { snapshot: snapshotToQuote(latest), stale }
}

export async function getQuote(symbol: string, assetType: string): Promise<QuoteResult> {
  const cached = await getValidSnapshot(symbol)

  if (cached && !cached.stale) {
    return { quote: cached.snapshot, fromCache: true, stale: false }
  }

  try {
    const quote = await finnhubProvider.getQuote(symbol)
    await saveSnapshot(quote, assetType)
    return { quote, fromCache: false, stale: false }
  } catch {
    if (cached) {
      return { quote: cached.snapshot, fromCache: true, stale: true }
    }
    throw new Error(`Failed to fetch quote for ${symbol} and no cached data available`)
  }
}

export async function getQuotes(
  symbols: { symbol: string; assetType: string }[],
): Promise<QuoteResult[]> {
  const unique = [...new Map(symbols.map((s) => [s.symbol, s])).values()]
  return Promise.all(unique.map((s) => getQuote(s.symbol, s.assetType)))
}
