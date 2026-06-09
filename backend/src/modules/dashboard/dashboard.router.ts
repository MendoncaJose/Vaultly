import { Router } from 'express'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { summary } from './dashboard.controller'

const router = Router()

router.use(authMiddleware)
router.get('/', summary)

export { router as dashboardRouter }
