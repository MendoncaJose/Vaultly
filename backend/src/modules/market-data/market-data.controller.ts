import type { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { getQuote } from './market-data.service'
import { AssetType } from '../../generated/prisma'

const quoteQuerySchema = z.object({
  symbol: z.string().min(1).max(20).transform((s) => s.toUpperCase()),
  assetType: z.nativeEnum(AssetType),
})

export async function quote(req: Request, res: Response, next: NextFunction) {
  try {
    const query = quoteQuerySchema.parse(req.query)
    const result = await getQuote(query.symbol, query.assetType)
    res.status(200).json({
      ...result.quote,
      fromCache: result.fromCache,
      stale: result.stale,
    })
  } catch (err) {
    next(err)
  }
}
