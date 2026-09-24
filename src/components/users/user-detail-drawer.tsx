import { useState } from "react"
import { ArrowUpDown } from "lucide-react"

import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { SearchInput } from "@/components/ui/search-input"
import { FilterSelect } from "@/components/ui/filter-select"
import { Pagination } from "@/components/ui/pagination"
import { StatusDot } from "@/components/ui/status-dot"
import { Button } from "@/components/ui/button"
import { UserTransactionsTable } from "@/components/users/user-transactions-table"
import { GiftcardDetailDialog } from "@/components/users/giftcard-detail-dialog"
import { WithdrawalHistoryTable } from "@/components/users/withdrawal-history-table"
import { WithdrawalDetailDialog } from "@/components/users/withdrawal-detail-dialog"
import { BillPaymentTable } from "@/components/users/bill-payment-table"
import { BillDetailDialog } from "@/components/users/bill-detail-dialog"
import { AboutAccountTab } from "@/components/users/about-account-tab"
import { AdminActionsTab } from "@/components/users/admin-actions-tab"
import { sortOrderOptions } from "@/lib/mock/users"
import type {
  BillTransaction,
  UserGiftcardTransaction,
  UserWithdrawal,
} from "@/lib/mock/users"
import type { AdaptedUser } from "@/lib/api/adapters"

const accountTabs = [
  "Giftcard Transactions",
  "Withdrawal History",
  "Bill Payment",
  "Reports",
  "About Account",
  "Admin Settings",
] as const

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function TabToolbar({
  sortOrder,
  onSortOrderChange,
}: {
  sortOrder: string
  onSortOrderChange: (value: string) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <SearchInput placeholder="Search..." className="w-48" />
      <FilterSelect
        label="Sort Order"
        options={sortOrderOptions}
        value={sortOrder}
        onChange={onSortOrderChange}
      />
      <Button variant="outline" className="h-10 gap-2 rounded-full border-border px-4">
        Filter
        <ArrowUpDown className="size-3.5" />
      </Button>
    </div>
  )
}

function UserDetailDrawer({
  user,
  open,
  onOpenChange,
  onUserUpdated,
}: {
  user: AdaptedUser | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUserUpdated: () => void
}) {
  const [txFilter, setTxFilter] = useState<"all" | "pending">("all")
  const [txSortOrder, setTxSortOrder] = useState("all")
  const [txPage, setTxPage] = useState(1)
  const [activeTransaction, setActiveTransaction] =
    useState<UserGiftcardTransaction | null>(null)

  const [withdrawalSortOrder, setWithdrawalSortOrder] = useState("all")
  const [withdrawalPage, setWithdrawalPage] = useState(1)
  const [activeWithdrawal, setActiveWithdrawal] = useState<UserWithdrawal | null>(
    null
  )

  const [billSortOrder, setBillSortOrder] = useState("all")
  const [billPage, setBillPage] = useState(1)
  const [activeBill, setActiveBill] = useState<BillTransaction | null>(null)

  if (!user) return null

  const filteredTransactions =
    txFilter === "pending"
      ? user.transactions.filter((t) => t.status === "pending-approval")
      : user.transactions

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <div className="flex flex-col items-center px-6 pt-4 pb-6 text-center">
            <div className="flex size-28 items-center justify-center rounded-full bg-muted text-3xl font-semibold text-muted-foreground">
              {getInitials(user.name)}
            </div>
            <h2 className="mt-4 text-2xl font-bold text-foreground">
              {user.name}
            </h2>
            <p className="mt-1 text-muted-foreground">{user.email}</p>

            <div className="mt-6 flex items-center gap-6">
              <div className="text-center">
                <StatusDot
                  tone={user.status === "verified" ? "good" : "critical"}
                  label={user.status === "verified" ? "Verified" : "Unverified"}
                  className="justify-center text-base"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Account Status
                </p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <p className="font-semibold text-foreground">
                  {user.dateCreated}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Date Created
                </p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <p className="font-semibold text-foreground">
                  Level {user.kycLevel}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">KYC Level</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="Giftcard Transactions" className="px-6">
            <TabsList
              variant="line"
              className="h-auto justify-start gap-6 border-b border-border pb-0"
            >
              {accountTabs.map((tab) => (
                <TabsTrigger key={tab} value={tab} className="px-0 pb-3 text-sm">
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="Giftcard Transactions" className="pt-5 pb-8">
              <Tabs
                value={txFilter}
                onValueChange={(value) => setTxFilter(value as "all" | "pending")}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <TabsList variant="line" className="h-auto gap-6 p-0">
                    <TabsTrigger value="all" className="px-0 pb-2 text-sm">
                      All Transaction
                    </TabsTrigger>
                    <TabsTrigger value="pending" className="px-0 pb-2 text-sm">
                      Pending Approval
                    </TabsTrigger>
                  </TabsList>

                  <TabToolbar
                    sortOrder={txSortOrder}
                    onSortOrderChange={setTxSortOrder}
                  />
                </div>
              </Tabs>

              <div className="mt-4 rounded-2xl bg-card p-2">
                <UserTransactionsTable
                  data={filteredTransactions}
                  onViewDetails={setActiveTransaction}
                />
              </div>

              <Pagination
                page={txPage}
                pageCount={4}
                onPageChange={setTxPage}
                className="mt-6"
              />
            </TabsContent>

            <TabsContent value="Withdrawal History" className="pt-5 pb-8">
              <div className="flex flex-wrap items-center justify-end gap-3">
                <TabToolbar
                  sortOrder={withdrawalSortOrder}
                  onSortOrderChange={setWithdrawalSortOrder}
                />
              </div>

              <div className="mt-4 rounded-2xl bg-card p-2">
                <WithdrawalHistoryTable
                  data={user.withdrawals}
                  onViewDetails={setActiveWithdrawal}
                />
              </div>

              <Pagination
                page={withdrawalPage}
                pageCount={4}
                onPageChange={setWithdrawalPage}
                className="mt-6"
              />
            </TabsContent>

            <TabsContent value="Bill Payment" className="pt-5 pb-8">
              <div className="flex flex-wrap items-center justify-end gap-3">
                <TabToolbar
                  sortOrder={billSortOrder}
                  onSortOrderChange={setBillSortOrder}
                />
              </div>

              <div className="mt-4 rounded-2xl bg-card p-2">
                <BillPaymentTable data={user.bills} onViewDetails={setActiveBill} />
              </div>

              <Pagination
                page={billPage}
                pageCount={4}
                onPageChange={setBillPage}
                className="mt-6"
              />
            </TabsContent>

            <TabsContent
              value="Reports"
              className="py-16 text-center text-sm text-muted-foreground"
            >
              Reports coming soon.
            </TabsContent>

            <TabsContent value="About Account" className="pt-5 pb-8">
              <AboutAccountTab user={user} />
            </TabsContent>

            <TabsContent value="Admin Settings" className="pt-5 pb-8">
              <AdminActionsTab user={user} onUserUpdated={onUserUpdated} />
            </TabsContent>
          </Tabs>
        </DrawerContent>
      </Drawer>

      <GiftcardDetailDialog
        transaction={activeTransaction}
        open={activeTransaction !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setActiveTransaction(null)
        }}
      />

      <WithdrawalDetailDialog
        withdrawal={activeWithdrawal}
        open={activeWithdrawal !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setActiveWithdrawal(null)
        }}
      />

      <BillDetailDialog
        bill={activeBill}
        open={activeBill !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setActiveBill(null)
        }}
      />
    </>
  )
}

export { UserDetailDrawer }
