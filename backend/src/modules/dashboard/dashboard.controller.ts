import type { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { getDashboardSummary, type Period } from './dashboard.service'
import type { AuthRequest } from '../../middlewares/auth.middleware'

const querySchema = z.object({
  period: z.enum(['TODAY', '7D', '1M', '3M', '1Y', 'ALL']).default('ALL'),
})

export async function summary(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthRequest).userId
    const { period } = querySchema.parse(req.query)
    const data = await getDashboardSummary(userId, period as Period)
    res.status(200).json(data)
  } catch (err) {
    next(err)
  }
}
