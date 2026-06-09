import type { Request, Response, NextFunction } from 'express'
import { registerSchema, loginSchema } from './auth.schema'
import { registerUser, loginUser, refreshSession, logoutUser, getMe } from './auth.service'
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

function clearRefreshCookie(res: Response) {
  res.clearCookie(REFRESH_COOKIE, { path: '/auth' })
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

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const token: string | undefined = req.cookies?.[REFRESH_COOKIE]
    if (!token) {
      res.status(401).json({ error: 'No refresh token' })
      return
    }
    const { user, accessToken, refreshToken } = await refreshSession(token)
    setRefreshCookie(res, refreshToken)
    res.status(200).json({ user, accessToken })
  } catch (err) {
    next(err)
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const token: string | undefined = req.cookies?.[REFRESH_COOKIE]
    if (token) await logoutUser(token)
    clearRefreshCookie(res)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as Request & { userId?: string }).userId
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }
    const user = await getMe(userId)
    res.status(200).json({ user })
  } catch (err) {
    next(err)
  }
}
