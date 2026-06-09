import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { useSellTransaction } from '../../lib/queries/holdings'

interface SellFormProps {
  open: boolean
  onClose: () => void
  symbol: string
  assetType: string
  assetName: string
  maxQuantity: number
  defaultCurrency: string
}

export function SellForm({
  open,
  onClose,
  symbol,
  assetType,
  assetName,
  maxQuantity,
  defaultCurrency,
}: SellFormProps) {
  const { mutateAsync, isPending } = useSellTransaction()

  type FormValues = {
    quantity: number
    pricePerUnit: number
    fee: number
    currency: 'EUR' | 'USD'
  }

  const schema = z.object({
    quantity: z.coerce.number().positive('Must be positive').max(maxQuantity, `Max ${maxQuantity}`),
    pricePerUnit: z.coerce.number().positive('Must be positive'),
    fee: z.coerce.number().min(0).default(0),
    currency: z.enum(['EUR', 'USD']),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: { fee: 0, currency: defaultCurrency as 'EUR' | 'USD' },
  })

  async function onSubmit(data: FormValues) {
    await mutateAsync({
      symbol,
      assetType,
      name: assetName,
      quantity: data.quantity,
      pricePerUnit: data.pricePerUnit,
      fee: data.fee,
      currency: data.currency,
    })
    reset()
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={`Adicionar venda — ${symbol}`}>
      <p className="text-caption text-ash mb-4">
        Available: <span className="text-chalk tabular-nums">{maxQuantity}</span>
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex gap-3">
          <Input
            label="Quantity"
            type="number"
            step="any"
            placeholder={`max ${maxQuantity}`}
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
          <Button type="submit" variant="danger" className="flex-1" disabled={isPending}>
            {isPending ? 'Selling…' : 'Adicionar venda'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
