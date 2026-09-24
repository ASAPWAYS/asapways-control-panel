import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { StatTileRow } from "@/components/ui/stat-tile-row"
import type { AppUser } from "@/lib/mock/users"

function AllDetailsDialog({
  user,
  open,
  onOpenChange,
}: {
  user: AppUser | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!user) return null

  const s = user.accountSummary

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-[calc(100%-2rem)] overflow-y-auto rounded-3xl bg-background p-6 sm:max-w-2xl">
        <DialogTitle className="text-xl font-semibold text-foreground">
          All Details
        </DialogTitle>

        <StatTileRow
          items={[
            { value: s.currentWalletBalance, label: "Current Wallet Balance" },
            {
              value: s.giftcardsTradedToday,
              label: "Number Of Giftcards Traded Today",
            },
            { value: s.withdrawalsToday, label: "Withdrawal Made Today" },
            { value: s.billPaymentsToday, label: "Bill Payment Made Today" },
          ]}
        />

        <div className="border-t border-border pt-5">
          <h3 className="mb-4 text-base font-semibold text-foreground">
            Giftcard Details
          </h3>
          <StatTileRow
            items={[
              {
                value: s.totalGiftcardTransactions,
                label: "Total Giftcard Transactions",
              },
              { value: s.giftcardTradedMost, label: "Giftcard Traded Most" },
              { value: s.highestGiftcardTraded, label: "Highest Giftcard Traded" },
              {
                value: s.totalGiftcardValue,
                label: "Total Value of Giftcards Traded",
              },
            ]}
          />
        </div>

        <div className="border-t border-border pt-5">
          <h3 className="mb-4 text-base font-semibold text-foreground">
            Withdrawal Details
          </h3>
          <StatTileRow
            items={[
              { value: s.totalWithdrawals, label: "Total Withdrawal" },
              { value: s.lastWithdrawalDate, label: "Last Withdrawal Made" },
              { value: s.highestWithdrawal, label: "Highest Withdrawal Made" },
              { value: s.totalWithdrawn, label: "Total Amount Withdrawn" },
            ]}
          />
        </div>

        <div className="border-t border-border pt-5">
          <h3 className="mb-4 text-base font-semibold text-foreground">
            Bill Payment Details
          </h3>
          <StatTileRow
            items={[
              { value: s.totalBillsTransactions, label: "Total Bills Transaction" },
              { value: s.lastBillDate, label: "Last Bill Transaction" },
              { value: s.mostUsedBillType, label: "Most Used Bill Transaction" },
              { value: s.totalBillsSpent, label: "Total Amount Spent" },
            ]}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { AllDetailsDialog }
