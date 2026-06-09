import { prisma } from '../../lib/prisma'
import { upsertAsset } from '../assets/asset.service'
import { getQuote } from '../market-data/market-data.service'
import type { AssetType, CurrencyCode } from '../../generated/prisma'

interface AddWatchlistInput {
  symbol: string
  assetType: AssetType
  name?: string
  exchange?: string
  currency: CurrencyCode
}

export async function addToWatchlist(userId: string, input: AddWatchlistInput) {
  const asset = await upsertAsset({
    symbol: input.symbol,
    assetType: input.assetType,
    name: input.name,
    exchange: input.exchange,
    currency: input.currency,
  })

  const existing = await prisma.watchlistItem.findUnique({
    where: { userId_assetId: { userId, assetId: asset.id } },
  })
  if (existing) throw Object.assign(new Error('Asset already in watchlist'), { status: 409 })

  return prisma.watchlistItem.create({
    data: { userId, assetId: asset.id },
    include: { asset: { select: { id: true, symbol: true, name: true, type: true, currency: true } } },
  })
}

export async function getWatchlist(userId: string) {
  const items = await prisma.watchlistItem.findMany({
    where: { userId },
    include: { asset: { select: { id: true, symbol: true, name: true, type: true, currency: true } } },
    orderBy: { createdAt: 'desc' },
  })

  const withQuotes = await Promise.all(
    items.map(async (item) => {
      try {
        const result = await getQuote(item.asset.symbol, item.asset.type)
        return { ...item, quote: result.quote, stale: result.stale }
      } catch {
        return { ...item, quote: null, stale: false }
      }
    }),
  )

  return withQuotes
}

export async function removeFromWatchlist(userId: string, watchlistItemId: string) {
  const item = await prisma.watchlistItem.findUnique({ where: { id: watchlistItemId } })
  if (!item || item.userId !== userId) {
    throw Object.assign(new Error('Watchlist item not found'), { status: 404 })
  }
  await prisma.watchlistItem.delete({ where: { id: watchlistItemId } })
}
