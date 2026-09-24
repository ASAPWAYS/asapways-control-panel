import { ChevronsUpDown, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusDot } from "@/components/ui/status-dot"
import type { UserWithdrawal } from "@/lib/mock/users"

const columns = [
  "ID",
  "Recipient",
  "Account Details",
  "Amount",
  "Payment Method",
  "Status",
  "Date",
] as const

function WithdrawalHistoryTable({
  data,
  onViewDetails,
}: {
  data: UserWithdrawal[]
  onViewDetails: (withdrawal: UserWithdrawal) => void
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-border hover:bg-transparent">
          {columns.map((column) => (
            <TableHead key={column} className="text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <ChevronsUpDown className="size-3" />
                {column}
              </span>
            </TableHead>
          ))}
          <TableHead className="text-xs text-muted-foreground">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((withdrawal, index) => (
          <TableRow
            key={`${withdrawal.detail.transactionId}-${index}`}
            className="border-border"
          >
            <TableCell className="font-medium text-foreground">
              {withdrawal.id}
            </TableCell>
            <TableCell className="text-foreground">
              {withdrawal.recipient}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {withdrawal.accountDetails}
            </TableCell>
            <TableCell className="text-foreground">{withdrawal.amount}</TableCell>
            <TableCell className="text-foreground">
              {withdrawal.paymentMethod}
            </TableCell>
            <TableCell>
              <StatusDot
                tone={withdrawal.status === "approved" ? "good" : "warning"}
                label={withdrawal.status === "approved" ? "Successful" : "Pending"}
              />
            </TableCell>
            <TableCell className="text-muted-foreground">
              {withdrawal.date}
            </TableCell>
            <TableCell>
              <Button
                size="sm"
                className="rounded-full bg-primary px-3 text-primary-foreground hover:bg-primary/90"
                onClick={() => onViewDetails(withdrawal)}
              >
                View
                <ChevronRight className="size-3.5" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export { WithdrawalHistoryTable }
