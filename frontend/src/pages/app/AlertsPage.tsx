import { useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Topbar } from '../../components/ui/Topbar'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import {
  useAlerts, useCreateAlert, useToggleAlert, useDeleteAlert,
  useNotifications, useMarkNotificationRead,
} from '../../lib/queries/alerts'
import { formatDate } from '../../lib/format'
import type { Alert } from '../../types/alerts'

const createSchema = z.object({
  symbol: z.string().min(1, 'Required').transform((s) => s.toUpperCase()),
  assetType: z.enum(['STOCK', 'ETF', 'CRYPTO']),
  alertType: z.enum(['PRICE_ABOVE', 'PRICE_BELOW', 'DAILY_CHANGE_PERCENT']),
  targetValue: z.coerce.number().positive('Must be positive'),
  currency: z.enum(['EUR', 'USD']),
})

type CreateFormValues = {
  symbol: string
  assetType: 'STOCK' | 'ETF' | 'CRYPTO'
  alertType: 'PRICE_ABOVE' | 'PRICE_BELOW' | 'DAILY_CHANGE_PERCENT'
  targetValue: number
  currency: 'EUR' | 'USD'
}

function CreateAlertModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { mutateAsync, isPending } = useCreateAlert()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateFormValues>({
    resolver: zodResolver(createSchema) as Resolver<CreateFormValues>,
    defaultValues: { assetType: 'STOCK', alertType: 'PRICE_ABOVE', currency: 'USD' },
  })

  async function onSubmit(data: CreateFormValues) {
    await mutateAsync(data)
    reset()
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Create alert">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex gap-3">
          <Input label="Symbol" placeholder="AAPL" error={errors.symbol?.message} className="flex-1" {...register('symbol')} />
          <div className="flex-1 flex flex-col gap-1.5">
            <label className="text-caption text-silver">Asset type</label>
            <select className="w-full bg-carbon border border-iron rounded-sm px-3 py-2.5 text-caption text-chalk focus:outline-none focus:border-ember-gold" {...register('assetType')}>
              <option value="STOCK">STOCK</option>
              <option value="ETF">ETF</option>
              <option value="CRYPTO">CRYPTO</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex-1 flex flex-col gap-1.5">
            <label className="text-caption text-silver">Alert type</label>
            <select className="w-full bg-carbon border border-iron rounded-sm px-3 py-2.5 text-caption text-chalk focus:outline-none focus:border-ember-gold" {...register('alertType')}>
              <option value="PRICE_ABOVE">Price above</option>
              <option value="PRICE_BELOW">Price below</option>
              <option value="DAILY_CHANGE_PERCENT">Daily change %</option>
            </select>
          </div>
          <Input label="Target value" type="number" step="any" placeholder="0.00" error={errors.targetValue?.message} className="flex-1" {...register('targetValue')} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-caption text-silver">Currency</label>
          <select className="w-full bg-carbon border border-iron rounded-sm px-3 py-2.5 text-caption text-chalk focus:outline-none focus:border-ember-gold" {...register('currency')}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
        <div className="flex gap-3 mt-2">
          <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" className="flex-1" disabled={isPending}>{isPending ? 'Creating…' : 'Create alert'}</Button>
        </div>
      </form>
    </Modal>
  )
}

function AlertRow({ alert }: { alert: Alert }) {
  const { mutate: toggle } = useToggleAlert()
  const { mutate: del } = useDeleteAlert()

  return (
    <div className="flex items-center justify-between py-3 border-b border-iron/50 last:border-0">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-caption font-medium text-chalk">{alert.asset.symbol}</span>
          <Badge variant={alert.isActive ? 'gold' : 'muted'}>
            {alert.isActive ? 'Active' : 'Inactive'}
          </Badge>
          {alert.triggeredAt && <Badge variant="muted">Triggered</Badge>}
        </div>
        <p className="text-caption text-ash">
          {alert.type.replace(/_/g, ' ').toLowerCase()} {Number(alert.targetValue).toFixed(2)}
          {alert.triggeredAt && <span className="ml-2">· {formatDate(alert.triggeredAt)}</span>}
        </p>
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="ghost" onClick={() => toggle({ id: alert.id, isActive: !alert.isActive })}>
          {alert.isActive ? 'Disable' : 'Enable'}
        </Button>
        <Button size="sm" variant="danger" onClick={() => del(alert.id)}>Delete</Button>
      </div>
    </div>
  )
}

export default function AlertsPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const { data: alertsData, isLoading: alertsLoading } = useAlerts()
  const { data: notifData } = useNotifications()
  const { mutate: markRead } = useMarkNotificationRead()

  const unread = notifData?.notifications.filter((n) => !n.isRead) ?? []

  return (
    <div className="flex flex-col min-h-full">
      <Topbar
        title="Alerts"
        actions={<Button size="sm" onClick={() => setCreateOpen(true)}>Create alert</Button>}
      />
      <div className="flex-1 p-8 flex flex-col gap-6">
        {/* Unread notifications */}
        {unread.length > 0 && (
          <Card padding="sm">
            <p className="text-caption text-ash mb-3">Notifications ({unread.length})</p>
            {unread.map((n) => (
              <div key={n.id} className="flex items-start justify-between py-2 border-b border-iron/50 last:border-0">
                <div>
                  <p className="text-caption font-medium text-chalk">{n.title}</p>
                  <p className="text-caption text-ash">{n.message}</p>
                  <p className="text-caption text-steel mt-0.5">{formatDate(n.createdAt)}</p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => markRead(n.id)}>Mark read</Button>
              </div>
            ))}
          </Card>
        )}

        {/* Alerts list */}
        {alertsLoading && <p className="text-caption text-ash">Loading…</p>}
        {alertsData && alertsData.alerts.length === 0 && (
          <Card className="flex items-center justify-center h-32">
            <p className="text-caption text-ash">No alerts. Create one to get notified.</p>
          </Card>
        )}
        {alertsData && alertsData.alerts.length > 0 && (
          <Card padding="sm">
            {alertsData.alerts.map((a) => <AlertRow key={a.id} alert={a} />)}
          </Card>
        )}
      </div>
      <CreateAlertModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  )
}
