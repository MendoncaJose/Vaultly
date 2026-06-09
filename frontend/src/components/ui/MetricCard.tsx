import { Card } from './Card'

interface MetricCardProps {
  label: string
  value: string
  change?: number
  changePercent?: number
  currency?: string
  className?: string
}

function ChangeDisplay({ change, changePercent }: { change: number; changePercent?: number }) {
  const isPositive = change >= 0
  const colorClass = isPositive ? 'text-ember-gold' : 'text-loss'
  const sign = isPositive ? '+' : ''

  return (
    <span className={['text-caption tabular-nums', colorClass].join(' ')}>
      {sign}
      {change.toFixed(2)}
      {changePercent !== undefined && (
        <span className="ml-1 text-ash">
          ({sign}
          {changePercent.toFixed(2)}%)
        </span>
      )}
    </span>
  )
}

export function MetricCard({
  label,
  value,
  change,
  changePercent,
  className = '',
}: MetricCardProps) {
  return (
    <Card className={className}>
      <p className="text-caption text-ash mb-2">{label}</p>
      <p className="text-heading-sm text-chalk-glow font-medium tabular-nums">{value}</p>
      {change !== undefined && (
        <div className="mt-1.5">
          <ChangeDisplay change={change} changePercent={changePercent} />
        </div>
      )}
    </Card>
  )
}
