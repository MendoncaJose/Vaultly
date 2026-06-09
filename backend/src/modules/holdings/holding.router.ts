import { Router } from 'express'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { list } from './holding.controller'

const router = Router()

router.use(authMiddleware)
router.get('/', list)

export { router as holdingRouter }
