import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  ACCESS_TOKEN_EXPIRES_IN: z.string().default('15m'),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),
  CORS_ORIGIN: z.string().url(),
  FINNHUB_API_KEY: z.string().min(1),
  MARKET_DATA_CACHE_TTL_SECONDS: z.coerce.number().default(300),
  FX_RATE_CACHE_TTL_SECONDS: z.coerce.number().default(86400),
  FX_PROVIDER: z.enum(['FRANKFURTER']).default('FRANKFURTER'),
  BASE_CURRENCY_DEFAULT: z.enum(['EUR', 'USD']).default('EUR'),
  ALERT_CRON_SCHEDULE: z.string().default('0 23 * * *'),
  ALERT_CRON_TIMEZONE: z.string().default('Europe/Lisbon'),
  BCRYPT_ROUNDS: z.coerce.number().int().min(10).max(14).default(12),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌  Invalid environment variables:')
  console.error(parsed.error.flatten().fieldErrors)
  process.exit(1)
}

export const env = parsed.data
