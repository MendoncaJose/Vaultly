import path from 'path'
import { defineConfig } from 'prisma/config'
import { PrismaPg } from '@prisma/adapter-pg'

export default defineConfig({
  schema: path.join(__dirname, '../prisma/schema.prisma'),
  migrate: {
    async adapter(env: Record<string, string | undefined>) {
      return new PrismaPg({ connectionString: env['DATABASE_URL']! })
    },
  },
})
