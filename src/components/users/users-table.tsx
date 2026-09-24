import { ChevronsUpDown, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import type { AdaptedUser } from "@/lib/api/adapters"

const columns = [
  "Name",
  "Email Address",
  "KYC Level",
  "Wallet Balance",
  "Date Joined",
  "Status",
  "Last Updated",
] as const

function UsersTable({
  data,
  onSelectUser,
}: {
  data: AdaptedUser[]
  onSelectUser: (user: AdaptedUser) => void
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-border hover:bg-transparent">
          <TableHead className="w-10">
            <Checkbox />
          </TableHead>
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
        {data.map((user) => (
          <TableRow
            key={user.id}
            className="cursor-pointer border-border"
            onClick={() => onSelectUser(user)}
          >
            <TableCell onClick={(event) => event.stopPropagation()}>
              <Checkbox />
            </TableCell>
            <TableCell className="font-medium text-foreground">
              {user.name}
            </TableCell>
            <TableCell className="text-muted-foreground">{user.email}</TableCell>
            <TableCell className="text-foreground">
              Level {user.kycLevel}
            </TableCell>
            <TableCell
              className={
                user.kycLevel <= 1 ? "text-status-warning" : "text-status-good"
              }
            >
              {user.walletBalance}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {user.dateJoined}
            </TableCell>
            <TableCell>
              <StatusDot
                tone={user.status === "verified" ? "good" : "critical"}
                label={user.status === "verified" ? "Verified" : "Unverified"}
              />
            </TableCell>
            <TableCell className="text-muted-foreground">
              {user.lastUpdated}
            </TableCell>
            <TableCell onClick={(event) => event.stopPropagation()}>
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
                  <DropdownMenuItem onClick={() => onSelectUser(user)}>
                    View Profile
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export { UsersTable }
