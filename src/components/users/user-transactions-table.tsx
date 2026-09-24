import { ChevronsUpDown, ChevronDown, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusDot } from "@/components/ui/status-dot"
import type { UserGiftcardTransaction } from "@/lib/mock/users"

const columns = [
  "ID",
  "Giftcard",
  "Description",
  "Amount",
  "Payment Method",
  "Status",
  "Date",
] as const

function UserTransactionsTable({
  data,
  onViewDetails,
}: {
  data: UserGiftcardTransaction[]
  onViewDetails: (transaction: UserGiftcardTransaction) => void
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
        {data.map((transaction, index) => {
          const isPending = transaction.status === "pending-approval"

          return (
            <TableRow key={`${transaction.detail.transactionId}-${index}`} className="border-border">
              <TableCell className="font-medium text-foreground">
                {transaction.id}
              </TableCell>
              <TableCell className="text-foreground">{transaction.giftcard}</TableCell>
              <TableCell className="whitespace-normal text-muted-foreground">
                {transaction.description}
              </TableCell>
              <TableCell className="text-foreground">{transaction.amount}</TableCell>
              <TableCell className="text-foreground">
                {transaction.paymentMethod}
              </TableCell>
              <TableCell>
                <StatusDot
                  tone={isPending ? "warning" : "good"}
                  label={isPending ? "Pending Approval" : "Successful"}
                />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {transaction.date}
              </TableCell>
              <TableCell>
                {isPending ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          size="sm"
                          className="rounded-full bg-primary px-3 text-primary-foreground hover:bg-primary/90"
                        >
                          Action
                          <ChevronDown className="size-3.5" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewDetails(transaction)}>
                        Full Giftcard Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>Approve</DropdownMenuItem>
                      <DropdownMenuItem variant="destructive">Deny</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    size="sm"
                    className="rounded-full bg-primary px-3 text-primary-foreground hover:bg-primary/90"
                    onClick={() => onViewDetails(transaction)}
                  >
                    View
                    <ChevronRight className="size-3.5" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export { UserTransactionsTable }
