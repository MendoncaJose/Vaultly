import { Router } from 'express'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { create, list, update, remove } from './alert.controller'

const router = Router()

router.use(authMiddleware)
router.post('/', create)
router.get('/', list)
router.patch('/:id', update)
router.delete('/:id', remove)

export { router as alertRouter }
