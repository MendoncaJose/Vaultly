import { useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Topbar } from '../../components/ui/Topbar'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Modal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import { BuyForm } from '../../components/portfolio/BuyForm'
import { useWatchlist, useAddToWatchlist, useRemoveFromWatchlist } from '../../lib/queries/watchlist'
import { formatCurrency, plColor } from '../../lib/format'
import type { WatchlistItem } from '../../types/watchlist'

const addSchema = z.object({
  symbol: z.string().min(1, 'Required').transform((s) => s.toUpperCase()),
  assetType: z.enum(['STOCK', 'ETF', 'CRYPTO']),
  currency: z.enum(['EUR', 'USD']),
})

type AddFormValues = { symbol: string; assetType: 'STOCK' | 'ETF' | 'CRYPTO'; currency: 'EUR' | 'USD' }

function AddWatchlistModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { mutateAsync, isPending } = useAddToWatchlist()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddFormValues>({
    resolver: zodResolver(addSchema) as Resolver<AddFormValues>,
    defaultValues: { assetType: 'STOCK', currency: 'USD' },
  })

  async function onSubmit(data: AddFormValues) {
    await mutateAsync(data)
    reset()
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Add to watchlist">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex gap-3">
          <Input label="Symbol" placeholder="AAPL" error={errors.symbol?.message} className="flex-1" {...register('symbol')} />
          <div className="flex-1 flex flex-col gap-1.5">
            <label className="text-caption text-silver">Type</label>
            <select className="w-full bg-carbon border border-iron rounded-sm px-3 py-2.5 text-caption text-chalk focus:outline-none focus:border-ember-gold transition-colors" {...register('assetType')}>
              <option value="STOCK">STOCK</option>
              <option value="ETF">ETF</option>
              <option value="CRYPTO">CRYPTO</option>
            </select>
          </div>
          <div className="flex-1 flex flex-col gap-1.5">
            <label className="text-caption text-silver">Currency</label>
            <select className="w-full bg-carbon border border-iron rounded-sm px-3 py-2.5 text-caption text-chalk focus:outline-none focus:border-ember-gold transition-colors" {...register('currency')}>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-2">
          <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" className="flex-1" disabled={isPending}>{isPending ? 'Adding…' : 'Add'}</Button>
        </div>
      </form>
    </Modal>
  )
}

function WatchlistRow({ item }: { item: WatchlistItem }) {
  const { mutate: remove } = useRemoveFromWatchlist()
  const [buyOpen, setBuyOpen] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between py-3 border-b border-iron/50 last:border-0">
        <div className="flex-1">
          <p className="text-caption font-medium text-chalk">{item.asset.symbol}</p>
          <p className="text-caption text-ash">{item.asset.name} · {item.asset.type}</p>
        </div>
        {item.quote ? (
          <div className="flex-1 text-right">
            <p className="text-caption text-chalk tabular-nums">
              {formatCurrency(item.quote.price, item.asset.currency)}
            </p>
            <p className={['text-caption tabular-nums', plColor(item.quote.change)].join(' ')}>
              {item.quote.change >= 0 ? '+' : ''}{item.quote.changePercent.toFixed(2)}%
              {item.stale && <span className="ml-1 text-ash">(stale)</span>}
            </p>
          </div>
        ) : (
          <p className="text-caption text-ash flex-1 text-right">No quote</p>
        )}
        <div className="flex gap-2 ml-6">
          <Button size="sm" onClick={() => setBuyOpen(true)}>Buy</Button>
          <Button size="sm" variant="ghost" onClick={() => remove(item.id)}>Remove</Button>
        </div>
      </div>
      <BuyForm
        open={buyOpen}
        onClose={() => setBuyOpen(false)}
        symbol={item.asset.symbol}
        assetType={item.asset.type}
        assetName={item.asset.name}
        defaultCurrency={item.asset.currency}
      />
    </>
  )
}

export default function WatchlistPage() {
  const [addOpen, setAddOpen] = useState(false)
  const { data, isLoading } = useWatchlist()

  return (
    <div className="flex flex-col min-h-full">
      <Topbar
        title="Watchlist"
        actions={<Button size="sm" onClick={() => setAddOpen(true)}>Add symbol</Button>}
      />
      <div className="flex-1 p-8">
        {isLoading && <p className="text-caption text-ash">Loading…</p>}
        {data && data.items.length === 0 && (
          <Card className="flex items-center justify-center h-32">
            <p className="text-caption text-ash">Watchlist is empty. Add a symbol to track.</p>
          </Card>
        )}
        {data && data.items.length > 0 && (
          <Card padding="sm">
            {data.items.map((item) => <WatchlistRow key={item.id} item={item} />)}
          </Card>
        )}
      </div>
      <AddWatchlistModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  )
}
