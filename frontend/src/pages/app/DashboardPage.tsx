import { useState } from 'react'
import { Topbar } from '../../components/ui/Topbar'
import { MetricCard } from '../../components/ui/MetricCard'
import { AllocationChart } from '../../components/dashboard/AllocationChart'
import { TopMovers } from '../../components/dashboard/TopMovers'
import { RecentTransactions } from '../../components/dashboard/RecentTransactions'
import { useDashboard } from '../../lib/queries/dashboard'
import { useUpdateCurrency } from '../../lib/queries/auth'
import { useAuth } from '../../context/auth.context'
import { formatCurrency, formatPercent } from '../../lib/format'
import type { Period } from '../../types/dashboard'

const PERIODS: Period[] = ['TODAY', '7D', '1M', '3M', '1Y', 'ALL']

export default function DashboardPage() {
  const [period, setPeriod] = useState<Period>('ALL')
  const { data, isLoading, isError } = useDashboard(period)
  const { user } = useAuth()
  const { mutate: updateCurrency, isPending: updatingCurrency } = useUpdateCurrency()
  const activeCurrency = data?.currency ?? user?.preferredCurrency ?? 'EUR'

  return (
    <div className="flex flex-col min-h-full">
      <Topbar
        title="Dashboard"
        actions={
          <>
          <div className="flex items-center gap-1 bg-slate border border-iron rounded-sm p-0.5">
            {(['EUR', 'USD'] as const).map((c) => (
              <button
                key={c}
                onClick={() => updateCurrency(c)}
                disabled={updatingCurrency}
                className={[
                  'px-3 py-1 rounded-sm text-caption transition-colors',
                  activeCurrency === c ? 'bg-iron text-chalk-glow' : 'text-ash hover:text-chalk',
                ].join(' ')}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 bg-slate border border-iron rounded-sm p-0.5">
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={[
                  'px-3 py-1 rounded-sm text-caption transition-colors',
                  period === p
                    ? 'bg-iron text-chalk-glow'
                    : 'text-ash hover:text-chalk',
                ].join(' ')}
              >
                {p}
              </button>
            ))}
          </div>
          </>
        }
      />

      <div className="flex-1 p-8 flex flex-col gap-6">
        {isLoading && (
          <div className="flex items-center justify-center flex-1">
            <p className="text-caption text-ash">Loading portfolio…</p>
          </div>
        )}

        {isError && (
          <div className="flex items-center justify-center flex-1">
            <p className="text-caption text-loss">Failed to load dashboard. Check your connection.</p>
          </div>
        )}

        {data && (
          <>
            {/* Metric cards */}
            <div className="grid grid-cols-3 gap-4">
              <MetricCard
                label="Portfolio value"
                value={formatCurrency(data.totalValue, data.currency)}
              />
              <MetricCard
                label="Total P/L"
                value={formatCurrency(data.totalPl, data.currency)}
                change={data.totalPl}
                changePercent={data.totalPlPercent}
              />
              <MetricCard
                label="Daily P/L"
                value={formatCurrency(data.dailyPl, data.currency)}
                change={data.dailyPl}
                changePercent={data.dailyPlPercent}
              />
            </div>

            {/* Mid row: allocation + top movers */}
            <div className="grid grid-cols-[1fr_280px] gap-4">
              <AllocationChart byType={data.holdings.byType} currency={data.currency} />
              <TopMovers
                gainers={data.topGainers}
                losers={data.topLosers}
                currency={data.currency}
              />
            </div>

            {/* Holdings summary row */}
            {data.holdings.all.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {(['STOCK', 'ETF', 'CRYPTO'] as const).map((type) => {
                  const holdings = data.holdings.byType[type]
                  const value = holdings.reduce((s, h) => s + h.currentValue, 0)
                  const pl = holdings.reduce((s, h) => s + h.pl, 0)
                  if (holdings.length === 0) return null
                  return (
                    <MetricCard
                      key={type}
                      label={`${type} (${holdings.length})`}
                      value={formatCurrency(value, data.currency)}
                      change={pl}
                    />
                  )
                })}
              </div>
            )}

            {/* Stats row */}
            <div className="flex items-center gap-6 text-caption text-ash">
              <span>
                <span className="text-chalk tabular-nums">{data.holdings.all.length}</span> open positions
              </span>
              <span>
                <span className="text-chalk tabular-nums">{data.activeAlerts}</span> active alerts
              </span>
              <span>
                Total cost{' '}
                <span className="text-chalk tabular-nums">
                  {formatCurrency(data.totalCost, data.currency)}
                </span>
              </span>
              {data.totalValue > 0 && (
                <span>
                  Return{' '}
                  <span
                    className={[
                      'tabular-nums',
                      data.totalPlPercent >= 0 ? 'text-ember-gold' : 'text-loss',
                    ].join(' ')}
                  >
                    {formatPercent(data.totalPlPercent)}
                  </span>
                </span>
              )}
            </div>

            {/* Recent transactions */}
            <RecentTransactions transactions={data.recentTransactions} />
          </>
        )}
      </div>
    </div>
  )
}
