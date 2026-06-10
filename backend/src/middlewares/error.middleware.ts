import { ZodError } from 'zod'
import type { Request, Response, NextFunction } from 'express'

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ error: 'Not found' })
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ZodError) {
    res.status(400).json({ error: 'Validation error', issues: err.flatten().fieldErrors })
    return
  }

  if (err instanceof Error) {
    const status = (err as Error & { status?: number }).status ?? 500
    if (status >= 500) {
      console.error(err.stack)
      const message =
        process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
      res.status(status).json({ error: message })
    } else {
      res.status(status).json({ error: err.message })
    }
    return
  }

  console.error('Unknown error:', err)
  res.status(500).json({ error: 'Internal Server Error' })
}
