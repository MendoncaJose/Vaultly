import { Topbar } from '../../components/ui/Topbar'
import { Card } from '../../components/ui/Card'
import { Table, Thead, Tbody, Tr, Th, Td } from '../../components/ui/Table'
import { Badge } from '../../components/ui/Badge'
import { useTransactions } from '../../lib/queries/transactions'
import { formatCurrency, formatDate } from '../../lib/format'

export default function TransactionsPage() {
  const { data, isLoading, isError } = useTransactions()

  return (
    <div className="flex flex-col min-h-full">
      <Topbar title="Transactions" />
      <div className="flex-1 p-8">
        {isLoading && <p className="text-caption text-ash">Loading…</p>}
        {isError && <p className="text-caption text-loss">Failed to load transactions.</p>}

        {data && data.transactions.length === 0 && (
          <Card className="flex items-center justify-center h-32">
            <p className="text-caption text-ash">No transactions yet.</p>
          </Card>
        )}

        {data && data.transactions.length > 0 && (
          <Card padding="none">
            <Table>
              <Thead>
                <Tr>
                  <Th>Date</Th>
                  <Th>Asset</Th>
                  <Th>Type</Th>
                  <Th className="text-right">Quantity</Th>
                  <Th className="text-right">Price</Th>
                  <Th className="text-right">Fee</Th>
                  <Th className="text-right">Gross</Th>
                  <Th className="text-right">Net</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.transactions.map((tx) => (
                  <Tr key={tx.id}>
                    <Td className="text-ash">{formatDate(tx.transactedAt)}</Td>
                    <Td>
                      <span className="font-medium">{tx.asset.symbol}</span>
                      <span className="ml-2 text-ash text-caption">{tx.asset.type}</span>
                    </Td>
                    <Td>
                      <Badge variant={tx.type === 'BUY' ? 'gold' : 'muted'}>{tx.type}</Badge>
                    </Td>
                    <Td className="text-right tabular-nums">{Number(tx.quantity).toFixed(4)}</Td>
                    <Td className="text-right tabular-nums">
                      {formatCurrency(Number(tx.pricePerUnit), tx.currency)}
                    </Td>
                    <Td className="text-right tabular-nums text-ash">
                      {formatCurrency(Number(tx.fee), tx.currency)}
                    </Td>
                    <Td className="text-right tabular-nums">
                      {formatCurrency(Number(tx.grossAmount), tx.currency)}
                    </Td>
                    <Td className="text-right tabular-nums font-medium">
                      {formatCurrency(Number(tx.netAmount), tx.currency)}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Card>
        )}
      </div>
    </div>
  )
}
