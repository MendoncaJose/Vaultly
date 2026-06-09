import { useState } from 'react'
import { Topbar } from '../../components/ui/Topbar'
import { Button } from '../../components/ui/Button'
import { BuyForm } from '../../components/portfolio/BuyForm'
import { HoldingsTable } from '../../components/portfolio/HoldingsTable'
import { useHoldings } from '../../lib/queries/holdings'
import { useDashboardHoldingsMap } from '../../lib/queries/dashboard'

export default function EtfsPage() {
  const [buyOpen, setBuyOpen] = useState(false)
  const { data, isLoading } = useHoldings('ETF')
  const { map, currency } = useDashboardHoldingsMap()

  return (
    <div className="flex flex-col min-h-full">
      <Topbar
        title="ETFs"
        actions={
          <Button size="sm" onClick={() => setBuyOpen(true)}>
            Adicionar compra
          </Button>
        }
      />
      <div className="flex-1 p-8">
        {isLoading && <p className="text-caption text-ash">Loading…</p>}
        {data && (
          <HoldingsTable
            holdings={data.holdings}
            dashboardHoldings={map}
            defaultCurrency={currency}
          />
        )}
      </div>

      <BuyForm
        open={buyOpen}
        onClose={() => setBuyOpen(false)}
        assetType="ETF"
        defaultCurrency={currency}
      />
    </div>
  )
}
