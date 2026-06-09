import type { Request, Response, NextFunction } from 'express'
import { listNotifications, markAsRead } from './notification.service'
import type { AuthRequest } from '../../middlewares/auth.middleware'

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthRequest).userId
    const notifications = await listNotifications(userId)
    res.status(200).json({ notifications })
  } catch (err) {
    next(err)
  }
}

export async function read(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthRequest).userId
    const id = req.params['id'] as string
    const notification = await markAsRead(userId, id)
    res.status(200).json({ notification })
  } catch (err) {
    next(err)
  }
}
