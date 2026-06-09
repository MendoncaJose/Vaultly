import { Card } from '../ui/Card'
import type { HoldingSummary } from '../../types/dashboard'
import { formatCurrency, formatPercent, plColor } from '../../lib/format'

interface TopMoversProps {
  gainers: HoldingSummary[]
  losers: HoldingSummary[]
  currency: string
}

function MoverRow({ h, currency }: { h: HoldingSummary; currency: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-iron/50 last:border-0">
      <div>
        <p className="text-caption text-chalk font-medium">{h.symbol}</p>
        <p className="text-caption text-ash truncate max-w-28">{h.name}</p>
      </div>
      <div className="text-right">
        <p className={['text-caption tabular-nums font-medium', plColor(h.pl)].join(' ')}>
          {formatPercent(h.plPercent)}
        </p>
        <p className="text-caption text-ash tabular-nums">
          {formatCurrency(h.currentValue, currency)}
        </p>
      </div>
    </div>
  )
}

export function TopMovers({ gainers, losers, currency }: TopMoversProps) {
  return (
    <div className="flex flex-col gap-4">
      {gainers.length > 0 && (
        <Card padding="sm">
          <p className="text-caption text-ash mb-2">Top gainers</p>
          {gainers.map((h) => (
            <MoverRow key={h.holdingId} h={h} currency={currency} />
          ))}
        </Card>
      )}
      {losers.length > 0 && (
        <Card padding="sm">
          <p className="text-caption text-ash mb-2">Top losers</p>
          {losers.map((h) => (
            <MoverRow key={h.holdingId} h={h} currency={currency} />
          ))}
        </Card>
      )}
      {gainers.length === 0 && losers.length === 0 && (
        <Card className="flex items-center justify-center h-24">
          <p className="text-caption text-ash">No holdings yet</p>
        </Card>
      )}
    </div>
  )
}
