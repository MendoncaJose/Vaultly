import { prisma } from '../../lib/prisma'
import type { AssetType } from '../../generated/prisma'

async function getPortfolioId(userId: string): Promise<string> {
  const portfolio = await prisma.portfolio.findUnique({ where: { userId } })
  if (!portfolio) throw Object.assign(new Error('Portfolio not found'), { status: 404 })
  return portfolio.id
}

export async function listHoldings(userId: string, assetType?: AssetType) {
  const portfolioId = await getPortfolioId(userId)

  return prisma.holding.findMany({
    where: {
      portfolioId,
      status: 'OPEN',
      ...(assetType ? { asset: { type: assetType } } : {}),
    },
    include: {
      asset: {
        select: { id: true, symbol: true, name: true, type: true, currency: true, exchange: true },
      },
    },
    orderBy: { updatedAt: 'desc' },
  })
}
