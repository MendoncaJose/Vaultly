import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Card } from '../ui/Card'
import type { HoldingSummary } from '../../types/dashboard'
import { formatCurrency } from '../../lib/format'

const TYPE_COLORS: Record<string, string> = {
  STOCK: '#cc9166',
  ETF: '#ae9357',
  CRYPTO: '#777a88',
}

interface AllocationChartProps {
  byType: { STOCK: HoldingSummary[]; ETF: HoldingSummary[]; CRYPTO: HoldingSummary[] }
  currency: string
}

export function AllocationChart({ byType, currency }: AllocationChartProps) {
  const data = Object.entries(byType)
    .map(([type, holdings]) => ({
      type,
      value: holdings.reduce((s, h) => s + h.currentValue, 0),
    }))
    .filter((d) => d.value > 0)

  if (data.length === 0) {
    return (
      <Card className="flex items-center justify-center h-48">
        <p className="text-caption text-ash">No holdings yet</p>
      </Card>
    )
  }

  return (
    <Card>
      <p className="text-caption text-ash mb-4">Allocation</p>
      <div className="flex items-center gap-6">
        <ResponsiveContainer width={140} height={140}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="type"
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={65}
              strokeWidth={0}
            >
              {data.map((entry) => (
                <Cell key={entry.type} fill={TYPE_COLORS[entry.type] ?? '#464853'} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#1c1d22', border: '1px solid #2e3038', borderRadius: 10 }}
              labelStyle={{ color: '#fff0cc' }}
              formatter={(value) => [formatCurrency(Number(value), currency), '']}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="flex flex-col gap-2">
          {data.map((entry) => (
            <div key={entry.type} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: TYPE_COLORS[entry.type] ?? '#464853' }}
              />
              <span className="text-caption text-ash w-12">{entry.type}</span>
              <span className="text-caption text-chalk tabular-nums">
                {formatCurrency(entry.value, currency)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
