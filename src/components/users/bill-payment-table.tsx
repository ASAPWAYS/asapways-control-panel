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
import type { BillTransaction } from "@/lib/mock/users"

const columns = [
  "ID",
  "Type",
  "Description",
  "Reference",
  "Amount",
  "Provider",
  "Status",
  "Date",
] as const

function BillPaymentTable({
  data,
  onViewDetails,
}: {
  data: BillTransaction[]
  onViewDetails: (bill: BillTransaction) => void
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
        {data.map((bill, index) => (
          <TableRow key={`${bill.detail.transactionId}-${index}`} className="border-border">
            <TableCell className="font-medium text-foreground">{bill.id}</TableCell>
            <TableCell className="text-foreground">{bill.type}</TableCell>
            <TableCell className="text-muted-foreground">
              {bill.description}
            </TableCell>
            <TableCell className="text-foreground">{bill.reference}</TableCell>
            <TableCell className="text-foreground">{bill.amount}</TableCell>
            <TableCell className="text-foreground">{bill.provider}</TableCell>
            <TableCell>
              <StatusDot tone="good" label="Successful" />
            </TableCell>
            <TableCell className="text-muted-foreground">{bill.date}</TableCell>
            <TableCell>
              <Button
                size="sm"
                className="rounded-full bg-primary px-3 text-primary-foreground hover:bg-primary/90"
                onClick={() => onViewDetails(bill)}
              >
                View More
                <ChevronRight className="size-3.5" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export { BillPaymentTable }
