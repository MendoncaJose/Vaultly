import { Router } from 'express'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { add, list, remove } from './watchlist.controller'

const router = Router()

router.use(authMiddleware)
router.post('/', add)
router.get('/', list)
router.delete('/:id', remove)

export { router as watchlistRouter }
