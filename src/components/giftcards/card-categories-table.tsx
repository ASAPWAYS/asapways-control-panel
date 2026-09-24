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
import type { CardCategory } from "@/lib/mock/giftcards"

const columns = [
  "Category",
  "Description",
  "Amount",
  "Trade Count",
  "Status",
  "Date Added",
] as const

function CardCategoriesTable({ data }: { data: CardCategory[] }) {
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
          <TableHead className="text-xs text-muted-foreground" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((category) => (
          <TableRow key={category.id} className="border-border">
            <TableCell className="font-medium text-foreground">
              {category.category}
            </TableCell>
            <TableCell className="whitespace-normal text-muted-foreground">
              {category.description}
            </TableCell>
            <TableCell className="text-foreground">{category.amountRange}</TableCell>
            <TableCell className="text-foreground">{category.tradeCount}</TableCell>
            <TableCell>
              <StatusDot
                tone={category.status === "active" ? "good" : "warning"}
                label={category.status === "active" ? "Active" : "Non - Active"}
              />
            </TableCell>
            <TableCell className="text-muted-foreground">
              {category.dateAdded}
            </TableCell>
            <TableCell>
              <Button
                size="sm"
                className="rounded-full bg-primary px-3 text-primary-foreground hover:bg-primary/90"
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

export { CardCategoriesTable }
