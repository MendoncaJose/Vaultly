import { prisma } from '../../lib/prisma'
import { env } from '../../config/env'
import { frankfurterProvider } from './frankfurter.provider'
import type { FxRate } from './fx.types'
import type { CurrencyCode } from '../../generated/prisma'

const TTL_MS = env.FX_RATE_CACHE_TTL_SECONDS * 1000

async function getCachedRate(from: string, to: string): Promise<FxRate | null> {
  const snapshot = await prisma.fxRateSnapshot.findFirst({
    where: {
      fromCurrency: from as CurrencyCode,
      toCurrency: to as CurrencyCode,
    },
    orderBy: { capturedAt: 'desc' },
  })

  if (!snapshot) return null

  const age = Date.now() - snapshot.capturedAt.getTime()
  if (age > TTL_MS) return null

  return {
    fromCurrency: snapshot.fromCurrency,
    toCurrency: snapshot.toCurrency,
    rate: Number(snapshot.rate),
    fetchedAt: snapshot.capturedAt,
  }
}

async function saveSnapshot(rate: FxRate): Promise<void> {
  await prisma.fxRateSnapshot.create({
    data: {
      fromCurrency: rate.fromCurrency as CurrencyCode,
      toCurrency: rate.toCurrency as CurrencyCode,
      rate: rate.rate,
      provider: 'FRANKFURTER',
    },
  })
}

export async function getRate(from: string, to: string): Promise<FxRate> {
  if (from === to) {
    return { fromCurrency: from, toCurrency: to, rate: 1, fetchedAt: new Date() }
  }

  const cached = await getCachedRate(from, to)
  if (cached) return cached

  const rate = await frankfurterProvider.getRate(from, to)
  await saveSnapshot(rate)
  return rate
}

export function convertAmount(amount: number, rate: number): number {
  return amount * rate
}
