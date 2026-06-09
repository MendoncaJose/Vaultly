import type { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { addToWatchlist, getWatchlist, removeFromWatchlist } from './watchlist.service'
import type { AuthRequest } from '../../middlewares/auth.middleware'
import { AssetType, CurrencyCode } from '../../generated/prisma'

const addSchema = z.object({
  symbol: z.string().min(1).max(20).transform((s) => s.toUpperCase()),
  assetType: z.nativeEnum(AssetType),
  name: z.string().min(1).max(200).optional(),
  exchange: z.string().max(50).optional(),
  currency: z.nativeEnum(CurrencyCode),
})

export async function add(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthRequest).userId
    const input = addSchema.parse(req.body)
    const item = await addToWatchlist(userId, input)
    res.status(201).json({ item })
  } catch (err) {
    next(err)
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthRequest).userId
    const items = await getWatchlist(userId)
    res.status(200).json({ items })
  } catch (err) {
    next(err)
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthRequest).userId
    const id = req.params['id'] as string
    await removeFromWatchlist(userId, id)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
