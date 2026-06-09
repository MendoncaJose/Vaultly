import { Router } from 'express'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { quote } from './market-data.controller'

const router = Router()

router.get('/quote', authMiddleware, quote)

export { router as marketDataRouter }
