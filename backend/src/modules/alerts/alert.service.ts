import { prisma } from '../../lib/prisma'
import { upsertAsset } from '../assets/asset.service'
import type { AlertType, AssetType, CurrencyCode } from '../../generated/prisma'

interface CreateAlertInput {
  symbol: string
  assetType: AssetType
  alertType: AlertType
  targetValue: number
  currency: CurrencyCode
}

interface UpdateAlertInput {
  isActive?: boolean
  targetValue?: number
}

export async function createAlert(userId: string, input: CreateAlertInput) {
  const asset = await upsertAsset({
    symbol: input.symbol,
    assetType: input.assetType,
    currency: input.currency,
  })

  return prisma.alert.create({
    data: {
      userId,
      assetId: asset.id,
      type: input.alertType,
      targetValue: input.targetValue,
      isActive: true,
    },
    include: { asset: { select: { symbol: true, name: true, type: true } } },
  })
}

export async function listAlerts(userId: string) {
  return prisma.alert.findMany({
    where: { userId },
    include: { asset: { select: { symbol: true, name: true, type: true } } },
    orderBy: { createdAt: 'desc' },
  })
}

export async function updateAlert(userId: string, alertId: string, input: UpdateAlertInput) {
  const alert = await prisma.alert.findUnique({ where: { id: alertId } })
  if (!alert || alert.userId !== userId) {
    throw Object.assign(new Error('Alert not found'), { status: 404 })
  }

  return prisma.alert.update({
    where: { id: alertId },
    data: {
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
      ...(input.targetValue !== undefined ? { targetValue: input.targetValue } : {}),
    },
    include: { asset: { select: { symbol: true, name: true, type: true } } },
  })
}

export async function deleteAlert(userId: string, alertId: string) {
  const alert = await prisma.alert.findUnique({ where: { id: alertId } })
  if (!alert || alert.userId !== userId) {
    throw Object.assign(new Error('Alert not found'), { status: 404 })
  }
  await prisma.alert.delete({ where: { id: alertId } })
}
