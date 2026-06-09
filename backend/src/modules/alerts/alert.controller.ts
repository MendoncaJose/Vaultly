import type { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { createAlert, listAlerts, updateAlert, deleteAlert } from './alert.service'
import type { AuthRequest } from '../../middlewares/auth.middleware'
import { AlertType, AssetType, CurrencyCode } from '../../generated/prisma'

const createSchema = z.object({
  symbol: z.string().min(1).max(20).transform((s) => s.toUpperCase()),
  assetType: z.nativeEnum(AssetType),
  alertType: z.nativeEnum(AlertType),
  targetValue: z.number().positive(),
  currency: z.nativeEnum(CurrencyCode),
})

const updateSchema = z.object({
  isActive: z.boolean().optional(),
  targetValue: z.number().positive().optional(),
})

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthRequest).userId
    const input = createSchema.parse(req.body)
    const alert = await createAlert(userId, input)
    res.status(201).json({ alert })
  } catch (err) {
    next(err)
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthRequest).userId
    const alerts = await listAlerts(userId)
    res.status(200).json({ alerts })
  } catch (err) {
    next(err)
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthRequest).userId
    const id = req.params['id'] as string
    const input = updateSchema.parse(req.body)
    const alert = await updateAlert(userId, id, input)
    res.status(200).json({ alert })
  } catch (err) {
    next(err)
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthRequest).userId
    const id = req.params['id'] as string
    await deleteAlert(userId, id)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
