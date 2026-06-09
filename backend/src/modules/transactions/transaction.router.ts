import { Router } from 'express'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { buy, sell, list } from './transaction.controller'

const router = Router()

router.use(authMiddleware)

router.post('/buy', buy)
router.post('/sell', sell)
router.get('/', list)

export { router as transactionRouter }
