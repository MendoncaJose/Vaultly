import { prisma } from '../../lib/prisma'
import { upsertAsset } from '../assets/asset.service'
import type { AssetType, CurrencyCode } from '../../generated/prisma'
import type { CreateBuyTransactionInput, CreateSellTransactionInput } from './transaction.schema'

async function getPortfolioId(userId: string): Promise<string> {
  const portfolio = await prisma.portfolio.findUnique({ where: { userId } })
  if (!portfolio) throw Object.assign(new Error('Portfolio not found'), { status: 404 })
  return portfolio.id
}

export async function buyTransaction(userId: string, input: CreateBuyTransactionInput) {
  const portfolioId = await getPortfolioId(userId)

  const asset = await upsertAsset({
    symbol: input.symbol,
    assetType: input.assetType as AssetType,
    name: input.name,
    exchange: input.exchange,
    currency: input.currency as CurrencyCode,
  })

  const grossAmount = input.quantity * input.pricePerUnit
  const netAmount = grossAmount + input.fee

  return prisma.$transaction(async (tx) => {
    const transaction = await tx.transaction.create({
      data: {
        portfolioId,
        assetId: asset.id,
        userId,
        type: 'BUY',
        quantity: input.quantity,
        pricePerUnit: input.pricePerUnit,
        fee: input.fee,
        currency: input.currency as CurrencyCode,
        grossAmount,
        netAmount,
        transactedAt: input.transactedAt,
      },
    })

    const existing = await tx.holding.findUnique({
      where: { portfolioId_assetId: { portfolioId, assetId: asset.id } },
    })

    if (existing && existing.status === 'OPEN') {
      const newQuantity = Number(existing.quantity) + input.quantity
      const newTotalCost = Number(existing.totalCost) + netAmount
      const newAvgPrice = newTotalCost / newQuantity

      await tx.holding.update({
        where: { id: existing.id },
        data: {
          quantity: newQuantity,
          totalCost: newTotalCost,
          averageBuyPrice: newAvgPrice,
        },
      })
    } else if (existing && existing.status === 'CLOSED') {
      await tx.holding.update({
        where: { id: existing.id },
        data: {
          quantity: input.quantity,
          totalCost: netAmount,
          averageBuyPrice: netAmount / input.quantity,
          status: 'OPEN',
        },
      })
    } else {
      await tx.holding.create({
        data: {
          portfolioId,
          assetId: asset.id,
          quantity: input.quantity,
          totalCost: netAmount,
          averageBuyPrice: netAmount / input.quantity,
          currency: input.currency as CurrencyCode,
          status: 'OPEN',
        },
      })
    }

    return transaction
  })
}

export async function sellTransaction(userId: string, input: CreateSellTransactionInput) {
  const portfolioId = await getPortfolioId(userId)

  const asset = await upsertAsset({
    symbol: input.symbol,
    assetType: input.assetType as AssetType,
    name: input.name,
    exchange: input.exchange,
    currency: input.currency as CurrencyCode,
  })

  const holding = await prisma.holding.findUnique({
    where: { portfolioId_assetId: { portfolioId, assetId: asset.id } },
  })

  if (!holding || holding.status === 'CLOSED') {
    throw Object.assign(new Error('No open holding for this asset'), { status: 400 })
  }

  const currentQuantity = Number(holding.quantity)
  if (input.quantity > currentQuantity) {
    throw Object.assign(
      new Error(`Insufficient quantity: have ${currentQuantity}, selling ${input.quantity}`),
      { status: 400 },
    )
  }

  const grossAmount = input.quantity * input.pricePerUnit
  const netAmount = grossAmount - input.fee

  return prisma.$transaction(async (tx) => {
    const transaction = await tx.transaction.create({
      data: {
        portfolioId,
        assetId: asset.id,
        userId,
        type: 'SELL',
        quantity: input.quantity,
        pricePerUnit: input.pricePerUnit,
        fee: input.fee,
        currency: input.currency as CurrencyCode,
        grossAmount,
        netAmount,
        transactedAt: input.transactedAt,
      },
    })

    const newQuantity = currentQuantity - input.quantity
    const removedCost = Number(holding.averageBuyPrice) * input.quantity
    const newTotalCost = Number(holding.totalCost) - removedCost

    if (newQuantity === 0) {
      await tx.holding.update({
        where: { id: holding.id },
        data: { quantity: 0, totalCost: 0, status: 'CLOSED' },
      })
    } else {
      await tx.holding.update({
        where: { id: holding.id },
        data: {
          quantity: newQuantity,
          totalCost: newTotalCost,
        },
      })
    }

    return transaction
  })
}

export async function listTransactions(userId: string, portfolioId?: string) {
  const pid = portfolioId ?? (await getPortfolioId(userId))
  return prisma.transaction.findMany({
    where: { portfolioId: pid },
    include: { asset: { select: { symbol: true, name: true, type: true } } },
    orderBy: { transactedAt: 'desc' },
  })
}
