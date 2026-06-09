import { prisma } from '../../lib/prisma'
import { getQuote } from '../market-data/market-data.service'
import { getRate, convertAmount } from '../fx/fx.service'
import type { CurrencyCode } from '../../generated/prisma'

export type Period = 'TODAY' | '7D' | '1M' | '3M' | '1Y' | 'ALL'

interface HoldingSummary {
  holdingId: string
  assetId: string
  symbol: string
  name: string
  type: string
  quantity: number
  averageBuyPrice: number
  totalCost: number
  currentPrice: number
  currentValue: number
  pl: number
  plPercent: number
  dailyChange: number
  dailyChangePercent: number
  currency: string
  stale: boolean
}

function periodToDate(period: Period): Date | null {
  const now = new Date()
  switch (period) {
    case 'TODAY': {
      const d = new Date(now)
      d.setHours(0, 0, 0, 0)
      return d
    }
    case '7D': return new Date(now.getTime() - 7 * 86400_000)
    case '1M': return new Date(now.getTime() - 30 * 86400_000)
    case '3M': return new Date(now.getTime() - 90 * 86400_000)
    case '1Y': return new Date(now.getTime() - 365 * 86400_000)
    case 'ALL': return null
  }
}

export async function getDashboardSummary(userId: string, period: Period = 'ALL') {
  const [portfolio, user] = await Promise.all([
    prisma.portfolio.findUnique({
      where: { userId },
      include: {
        holdings: {
          where: { status: 'OPEN' },
          include: { asset: { select: { symbol: true, name: true, type: true, currency: true } } },
        },
      },
    }),
    prisma.user.findUnique({ where: { id: userId }, select: { preferredCurrency: true } }),
  ])

  if (!portfolio || !user) throw Object.assign(new Error('Portfolio not found'), { status: 404 })

  const preferredCurrency = user.preferredCurrency as CurrencyCode

  // Fetch quotes for all open holdings in parallel
  const quoteResults = await Promise.allSettled(
    portfolio.holdings.map((h) =>
      getQuote(h.asset.symbol, h.asset.type).then((r) => ({ holdingId: h.id, result: r })),
    ),
  )

  // Get FX rates needed
  const assetCurrencies = new Set(portfolio.holdings.map((h) => h.asset.currency as string))
  const fxRateMap = new Map<string, number>()
  fxRateMap.set(preferredCurrency, 1)

  await Promise.allSettled(
    [...assetCurrencies].map(async (currency) => {
      if (currency === preferredCurrency) return
      const rate = await getRate(currency, preferredCurrency)
      fxRateMap.set(currency, rate.rate)
    }),
  )

  // Build holding summaries
  const holdingSummaries: HoldingSummary[] = []

  for (const holding of portfolio.holdings) {
    const quoteResult = quoteResults.find(
      (r) => r.status === 'fulfilled' && r.value.holdingId === holding.id,
    )
    if (!quoteResult || quoteResult.status !== 'fulfilled') continue

    const { result, holdingId } = quoteResult.value
    const { quote, stale } = result
    const assetCurrency = holding.asset.currency as string
    const fxRate = fxRateMap.get(assetCurrency) ?? 1

    const quantity = Number(holding.quantity)
    const averageBuyPrice = Number(holding.averageBuyPrice)
    const totalCost = Number(holding.totalCost)
    const currentPrice = convertAmount(quote.price, fxRate)
    const currentValue = quantity * currentPrice
    const costInPreferred = convertAmount(totalCost, fxRate)
    const pl = currentValue - costInPreferred
    const plPercent = costInPreferred > 0 ? (pl / costInPreferred) * 100 : 0
    const dailyChange = convertAmount(quote.change, fxRate)
    const dailyChangePercent = quote.changePercent

    holdingSummaries.push({
      holdingId,
      assetId: holding.assetId,
      symbol: holding.asset.symbol,
      name: holding.asset.name,
      type: holding.asset.type,
      quantity,
      averageBuyPrice: convertAmount(averageBuyPrice, fxRate),
      totalCost: costInPreferred,
      currentPrice,
      currentValue,
      pl,
      plPercent,
      dailyChange: quantity * dailyChange,
      dailyChangePercent,
      currency: preferredCurrency,
      stale,
    })
  }

  // Aggregates
  const totalValue = holdingSummaries.reduce((s, h) => s + h.currentValue, 0)
  const totalCost = holdingSummaries.reduce((s, h) => s + h.totalCost, 0)
  const totalPl = totalValue - totalCost
  const totalPlPercent = totalCost > 0 ? (totalPl / totalCost) * 100 : 0
  const dailyPl = holdingSummaries.reduce((s, h) => s + h.dailyChange, 0)
  const dailyPlPercent = totalValue > 0 ? (dailyPl / (totalValue - dailyPl)) * 100 : 0

  const byType = {
    STOCK: holdingSummaries.filter((h) => h.type === 'STOCK'),
    ETF: holdingSummaries.filter((h) => h.type === 'ETF'),
    CRYPTO: holdingSummaries.filter((h) => h.type === 'CRYPTO'),
  }

  const sorted = [...holdingSummaries].sort((a, b) => b.plPercent - a.plPercent)
  const topGainers = sorted.slice(0, 3)
  const topLosers = sorted.slice(-3).reverse()

  // Transactions filtered by period
  const since = periodToDate(period)
  const recentTransactions = await prisma.transaction.findMany({
    where: {
      portfolioId: portfolio.id,
      ...(since ? { transactedAt: { gte: since } } : {}),
    },
    include: { asset: { select: { symbol: true, name: true, type: true } } },
    orderBy: { transactedAt: 'desc' },
    take: 10,
  })

  const activeAlerts = await prisma.alert.count({ where: { userId, isActive: true } })

  return {
    totalValue,
    totalCost,
    totalPl,
    totalPlPercent,
    dailyPl,
    dailyPlPercent,
    currency: preferredCurrency,
    holdings: { all: holdingSummaries, byType },
    topGainers,
    topLosers,
    recentTransactions,
    activeAlerts,
  }
}
