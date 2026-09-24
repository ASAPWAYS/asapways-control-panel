import { ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusDot, type StatusTone } from "@/components/ui/status-dot"
import { formatNaira } from "@/lib/format-number"
import { describeTransaction } from "@/lib/api/adapters"
import type { ApiTransaction, TransactionStatus } from "@/lib/api/transactions"

const columns = [
  "Reference",
  "User",
  "Type",
  "Subject",
  "Amount",
  "Status",
  "Date",
] as const

const statusTone: Record<TransactionStatus, StatusTone> = {
  SUCCESSFUL: "good",
  PENDING: "warning",
  REJECTED: "critical",
  FAILED: "critical",
  REVERSAL: "neutral",
}

function AllTransactionsTable({
  data,
  onViewDetails,
}: {
  data: ApiTransaction[]
  onViewDetails: (transaction: ApiTransaction) => void
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-border hover:bg-transparent">
          {columns.map((column) => (
            <TableHead key={column} className="text-xs text-muted-foreground">
              {column}
            </TableHead>
          ))}
          <TableHead className="text-xs text-muted-foreground" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((tx) => {
          const { subject } = describeTransaction(tx)
          return (
            <TableRow key={tx.id} className="border-border">
              <TableCell className="font-medium text-foreground">
                {tx.transactionReference}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {tx.user?.fullName ?? tx.user?.username ?? tx.user?.email ?? "—"}
              </TableCell>
              <TableCell className="text-foreground">{tx.transactionType}</TableCell>
              <TableCell className="text-muted-foreground">{subject}</TableCell>
              <TableCell className="text-foreground">{formatNaira(tx.amount)}</TableCell>
              <TableCell>
                <StatusDot tone={statusTone[tx.status]} label={tx.status} />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(tx.createdAt).toLocaleString()}
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  className="rounded-full bg-primary px-3 text-primary-foreground hover:bg-primary/90"
                  onClick={() => onViewDetails(tx)}
                >
                  View
                  <ChevronRight className="size-3.5" />
                </Button>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export { AllTransactionsTable }
