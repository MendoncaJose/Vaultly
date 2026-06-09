import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { useBuyTransaction } from '../../lib/queries/holdings'

const schema = z.object({
  symbol: z.string().min(1, 'Symbol required').transform((s) => s.toUpperCase()),
  name: z.string().optional(),
  quantity: z.coerce.number().positive('Must be positive'),
  pricePerUnit: z.coerce.number().positive('Must be positive'),
  fee: z.coerce.number().min(0).default(0),
  currency: z.enum(['EUR', 'USD']),
})

type FormValues = z.infer<typeof schema>

interface BuyFormProps {
  open: boolean
  onClose: () => void
  symbol?: string
  assetType: string
  assetName?: string
  defaultCurrency: string
}

export function BuyForm({
  open,
  onClose,
  symbol = '',
  assetType,
  assetName = '',
  defaultCurrency,
}: BuyFormProps) {
  const { mutateAsync, isPending } = useBuyTransaction()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      symbol,
      name: assetName,
      fee: 0,
      currency: defaultCurrency as 'EUR' | 'USD',
    },
  })

  async function onSubmit(data: FormValues) {
    await mutateAsync({
      symbol: data.symbol,
      assetType,
      name: data.name,
      quantity: data.quantity,
      pricePerUnit: data.pricePerUnit,
      fee: data.fee,
      currency: data.currency,
    })
    reset()
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Adicionar compra">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex gap-3">
          <Input
            label="Symbol"
            type="text"
            placeholder="AAPL"
            error={errors.symbol?.message}
            className="flex-1"
            readOnly={!!symbol}
            {...register('symbol')}
          />
          <Input
            label="Name (optional)"
            type="text"
            placeholder="Apple Inc."
            className="flex-1"
            {...register('name')}
          />
        </div>
        <div className="flex gap-3">
          <Input
            label="Quantity"
            type="number"
            step="any"
            placeholder="0.00"
            error={errors.quantity?.message}
            className="flex-1"
            {...register('quantity')}
          />
          <Input
            label="Price per unit"
            type="number"
            step="any"
            placeholder="0.00"
            error={errors.pricePerUnit?.message}
            className="flex-1"
            {...register('pricePerUnit')}
          />
        </div>
        <div className="flex gap-3">
          <Input
            label="Fee"
            type="number"
            step="any"
            placeholder="0.00"
            error={errors.fee?.message}
            className="flex-1"
            {...register('fee')}
          />
          <div className="flex-1 flex flex-col gap-1.5">
            <label className="text-caption text-silver">Currency</label>
            <select
              className="w-full bg-carbon border border-iron rounded-sm px-3 py-2.5 text-caption text-chalk focus:outline-none focus:border-ember-gold transition-colors"
              {...register('currency')}
            >
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-2">
          <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={isPending}>
            {isPending ? 'Adding…' : 'Adicionar compra'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
