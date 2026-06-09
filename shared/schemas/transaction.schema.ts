import { z } from 'zod'
import { AssetType, CurrencyCode } from '../enums'

const baseTransactionSchema = z.object({
  symbol: z.string().min(1).max(20).transform((s) => s.toUpperCase()),
  assetType: z.nativeEnum(AssetType),
  name: z.string().min(1).max(200).optional(),
  exchange: z.string().max(50).optional(),
  quantity: z.number().positive('Quantity must be positive'),
  pricePerUnit: z.number().positive('Price must be positive'),
  fee: z.number().min(0, 'Fee cannot be negative').default(0),
  currency: z.nativeEnum(CurrencyCode),
  transactedAt: z
    .string()
    .datetime()
    .optional()
    .transform((v) => (v ? new Date(v) : new Date())),
})

export const createBuyTransactionSchema = baseTransactionSchema

export const createSellTransactionSchema = baseTransactionSchema

export type CreateBuyTransactionInput = z.infer<typeof createBuyTransactionSchema>
export type CreateSellTransactionInput = z.infer<typeof createSellTransactionSchema>
