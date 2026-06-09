import { useState } from 'react'
import { Table, Thead, Tbody, Tr, Th, Td } from '../ui/Table'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { BuyForm } from './BuyForm'
import { SellForm } from './SellForm'
import type { Holding } from '../../types/holdings'
import { formatCurrency, plColor } from '../../lib/format'

interface HoldingsTableProps {
  holdings: Holding[]
  dashboardHoldings?: Record<string, { currentValue: number; pl: number; plPercent: number; currentPrice: number }>
  defaultCurrency?: string
}

interface ActionState {
  type: 'buy' | 'sell'
  holding: Holding
}

export function HoldingsTable({ holdings, dashboardHoldings = {}, defaultCurrency = 'EUR' }: HoldingsTableProps) {
  const [action, setAction] = useState<ActionState | null>(null)

  if (holdings.length === 0) {
    return (
      <Card className="flex items-center justify-center h-32">
        <p className="text-caption text-ash">No holdings yet. Add a buy transaction to get started.</p>
      </Card>
    )
  }

  return (
    <>
      <Card padding="none">
        <Table>
          <Thead>
            <Tr>
              <Th>Asset</Th>
              <Th className="text-right">Quantity</Th>
              <Th className="text-right">Avg. buy price</Th>
              <Th className="text-right">Current price</Th>
              <Th className="text-right">Current value</Th>
              <Th className="text-right">P/L</Th>
              <Th className="text-right">P/L %</Th>
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            {holdings.map((h) => {
              const live = dashboardHoldings[h.assetId]
              const qty = Number(h.quantity)
              const avgPrice = Number(h.averageBuyPrice)
              const currentPrice = live?.currentPrice ?? null
              const currentValue = live?.currentValue ?? null
              const pl = live?.pl ?? null
              const plPercent = live?.plPercent ?? null

              return (
                <Tr key={h.id}>
                  <Td>
                    <p className="font-medium text-chalk">{h.asset.symbol}</p>
                    <p className="text-ash truncate max-w-32">{h.asset.name}</p>
                  </Td>
                  <Td className="text-right tabular-nums">{qty.toFixed(4)}</Td>
                  <Td className="text-right tabular-nums">
                    {formatCurrency(avgPrice, h.currency)}
                  </Td>
                  <Td className="text-right tabular-nums">
                    {currentPrice != null ? formatCurrency(currentPrice, defaultCurrency) : <span className="text-ash">—</span>}
                  </Td>
                  <Td className="text-right tabular-nums">
                    {currentValue != null ? formatCurrency(currentValue, defaultCurrency) : <span className="text-ash">—</span>}
                  </Td>
                  <Td className={['text-right tabular-nums', pl != null ? plColor(pl) : 'text-ash'].join(' ')}>
                    {pl != null ? formatCurrency(pl, defaultCurrency) : '—'}
                  </Td>
                  <Td className={['text-right tabular-nums', plPercent != null ? plColor(plPercent) : 'text-ash'].join(' ')}>
                    {plPercent != null ? `${plPercent >= 0 ? '+' : ''}${plPercent.toFixed(2)}%` : '—'}
                  </Td>
                  <Td>
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" onClick={() => setAction({ type: 'buy', holding: h })}>
                        Buy
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setAction({ type: 'sell', holding: h })}
                      >
                        Sell
                      </Button>
                    </div>
                  </Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </Card>

      {action?.type === 'buy' && (
        <BuyForm
          open
          onClose={() => setAction(null)}
          symbol={action.holding.asset.symbol}
          assetType={action.holding.asset.type}
          assetName={action.holding.asset.name}
          defaultCurrency={defaultCurrency}
        />
      )}
      {action?.type === 'sell' && (
        <SellForm
          open
          onClose={() => setAction(null)}
          symbol={action.holding.asset.symbol}
          assetType={action.holding.asset.type}
          assetName={action.holding.asset.name}
          maxQuantity={Number(action.holding.quantity)}
          defaultCurrency={defaultCurrency}
        />
      )}
    </>
  )
}
