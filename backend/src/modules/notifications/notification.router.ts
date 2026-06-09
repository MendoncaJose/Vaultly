import { Router } from 'express'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { list, read } from './notification.controller'

const router = Router()

router.use(authMiddleware)
router.get('/', list)
router.patch('/:id/read', read)

export { router as notificationRouter }
