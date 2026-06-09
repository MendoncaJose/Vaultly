import type { Request, Response, NextFunction } from 'express'
import { createBuyTransactionSchema, createSellTransactionSchema } from './transaction.schema'
import { buyTransaction, sellTransaction, listTransactions } from './transaction.service'
import type { AuthRequest } from '../../middlewares/auth.middleware'

export async function buy(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthRequest).userId
    const input = createBuyTransactionSchema.parse(req.body)
    const transaction = await buyTransaction(userId, input)
    res.status(201).json({ transaction })
  } catch (err) {
    next(err)
  }
}

export async function sell(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthRequest).userId
    const input = createSellTransactionSchema.parse(req.body)
    const transaction = await sellTransaction(userId, input)
    res.status(201).json({ transaction })
  } catch (err) {
    next(err)
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthRequest).userId
    const transactions = await listTransactions(userId)
    res.status(200).json({ transactions })
  } catch (err) {
    next(err)
  }
}
