import type { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { listHoldings } from './holding.service'
import type { AuthRequest } from '../../middlewares/auth.middleware'
import { AssetType } from '../../generated/prisma'

const holdingsQuerySchema = z.object({
  assetType: z.nativeEnum(AssetType).optional(),
})

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthRequest).userId
    const { assetType } = holdingsQuerySchema.parse(req.query)
    const holdings = await listHoldings(userId, assetType)
    res.status(200).json({ holdings })
  } catch (err) {
    next(err)
  }
}
