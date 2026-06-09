import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { env } from './config/env'
import { errorHandler, notFoundHandler } from './middlewares/error.middleware'
import { authRouter } from './modules/auth/auth.router'
import { marketDataRouter } from './modules/market-data/market-data.router'

export const app = express()

app.use(helmet())
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()
})

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/auth', authRouter)
app.use('/market-data', marketDataRouter)

app.use(notFoundHandler)
app.use(errorHandler)
