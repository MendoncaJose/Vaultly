import { Card } from '../ui/Card'
import { Table, Thead, Tbody, Tr, Th, Td } from '../ui/Table'
import { Badge } from '../ui/Badge'
import type { RecentTransaction } from '../../types/dashboard'
import { formatCurrency, formatDate } from '../../lib/format'

interface RecentTransactionsProps {
  transactions: RecentTransaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  if (transactions.length === 0) {
    return (
      <Card className="flex items-center justify-center h-24">
        <p className="text-caption text-ash">No transactions yet</p>
      </Card>
    )
  }

  return (
    <Card padding="none">
      <div className="px-6 py-4 border-b border-iron">
        <p className="text-caption text-ash">Recent transactions</p>
      </div>
      <Table>
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>Asset</Th>
            <Th>Type</Th>
            <Th className="text-right">Qty</Th>
            <Th className="text-right">Price</Th>
            <Th className="text-right">Net amount</Th>
          </Tr>
        </Thead>
        <Tbody>
          {transactions.map((tx) => (
            <Tr key={tx.id}>
              <Td className="text-ash">{formatDate(tx.transactedAt)}</Td>
              <Td>
                <span className="font-medium">{tx.asset.symbol}</span>
                <span className="ml-2 text-ash">{tx.asset.type}</span>
              </Td>
              <Td>
                <Badge variant={tx.type === 'BUY' ? 'gold' : 'muted'}>{tx.type}</Badge>
              </Td>
              <Td className="text-right tabular-nums">{Number(tx.quantity).toFixed(4)}</Td>
              <Td className="text-right tabular-nums">
                {formatCurrency(Number(tx.pricePerUnit), tx.currency)}
              </Td>
              <Td className="text-right tabular-nums">
                {formatCurrency(Number(tx.netAmount), tx.currency)}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Card>
  )
}
