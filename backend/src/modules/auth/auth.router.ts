import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { register, login, refresh, logout, me } from './auth.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many login attempts, please try again later' },
})

const router = Router()

router.post('/register', register)
router.post('/login', loginLimiter, login)
router.post('/refresh', refresh)
router.post('/logout', logout)
router.get('/me', authMiddleware, me)

export { router as authRouter }
