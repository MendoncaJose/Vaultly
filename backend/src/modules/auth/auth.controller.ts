import type { Request, Response, NextFunction } from 'express'
import { registerSchema, loginSchema } from './auth.schema'
import { registerUser, loginUser } from './auth.service'
import { env } from '../../config/env'

const REFRESH_COOKIE = 'vaultly_rt'

function setRefreshCookie(res: Response, token: string) {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/auth',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const input = registerSchema.parse(req.body)
    const { user, accessToken, refreshToken } = await registerUser(input)
    setRefreshCookie(res, refreshToken)
    res.status(201).json({ user, accessToken })
  } catch (err) {
    next(err)
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const input = loginSchema.parse(req.body)
    const { user, accessToken, refreshToken } = await loginUser(input)
    setRefreshCookie(res, refreshToken)
    res.status(200).json({ user, accessToken })
  } catch (err) {
    next(err)
  }
}
