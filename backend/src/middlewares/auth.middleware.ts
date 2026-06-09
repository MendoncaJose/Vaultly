import type { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../lib/jwt'

export interface AuthRequest extends Request {
  userId: string
  userEmail: string
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid Authorization header' })
    return
  }

  const token = authHeader.slice(7)
  try {
    const payload = verifyAccessToken(token)
    ;(req as AuthRequest).userId = payload.userId
    ;(req as AuthRequest).userEmail = payload.email
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired access token' })
  }
}
