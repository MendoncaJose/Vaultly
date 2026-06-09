import { prisma } from '../../lib/prisma'
import type { AssetType, CurrencyCode } from '../../generated/prisma'

interface UpsertAssetInput {
  symbol: string
  assetType: AssetType
  name?: string
  exchange?: string
  currency: CurrencyCode
}

export async function upsertAsset(input: UpsertAssetInput) {
  return prisma.asset.upsert({
    where: { symbol_type: { symbol: input.symbol, type: input.assetType } },
    create: {
      symbol: input.symbol,
      type: input.assetType,
      name: input.name ?? input.symbol,
      exchange: input.exchange ?? null,
      currency: input.currency,
      provider: 'FINNHUB',
      providerSymbol: input.symbol,
    },
    update: {
      ...(input.name ? { name: input.name } : {}),
      ...(input.exchange ? { exchange: input.exchange } : {}),
    },
  })
}
