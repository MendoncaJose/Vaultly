import express from 'express'
import { errorHandler, notFoundHandler } from './middlewares/error.middleware'

export const app = express()

app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use(notFoundHandler)
app.use(errorHandler)
