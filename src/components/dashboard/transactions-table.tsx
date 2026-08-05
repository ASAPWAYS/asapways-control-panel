import { ChevronsUpDown, ChevronDown } from "lucide-react"

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
import { StatusBadge } from "@/components/dashboard/status-badge"
import type { Transaction } from "@/lib/mock/dashboard"

const columns = [
  "ID",
  "User",
  "Giftcard",
  "Description",
  "Amount",
  "Rate",
  "Status",
  "Date",
] as const

function TransactionsTable({ data }: { data: Transaction[] }) {
  return (
    <div className="rounded-2xl bg-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">
          Recent Giftcard Transactions
        </h2>
        <a
          href="#"
          className="text-sm font-medium text-primary hover:underline"
        >
          See All
        </a>
      </div>

      <div className="mt-4">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              {columns.map((column) => (
                <TableHead
                  key={column}
                  className="text-xs text-muted-foreground"
                >
                  <span className="inline-flex items-center gap-1">
                    <ChevronsUpDown className="size-3" />
                    {column}
                  </span>
                </TableHead>
              ))}
              <TableHead className="text-xs text-muted-foreground">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((transaction, index) => (
              <TableRow
                key={`${transaction.id}-${index}`}
                className="border-border"
              >
                <TableCell className="font-medium text-foreground">
                  {transaction.id}
                </TableCell>
                <TableCell className="text-foreground">
                  {transaction.user}
                </TableCell>
                <TableCell className="text-foreground">
                  {transaction.giftcard}
                </TableCell>
                <TableCell className="whitespace-normal text-muted-foreground">
                  {transaction.description}
                </TableCell>
                <TableCell className="text-foreground">
                  {transaction.amount}
                </TableCell>
                <TableCell className="text-foreground">
                  {transaction.rate}
                </TableCell>
                <TableCell>
                  <StatusBadge status={transaction.status} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {transaction.date}
                </TableCell>
                <TableCell>
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
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Approve</DropdownMenuItem>
                      <DropdownMenuItem variant="destructive">
                        Reject
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export { TransactionsTable }
