import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { DetailPanel, DetailRow } from "@/components/ui/detail-row"
import { StatusDot } from "@/components/ui/status-dot"
import type { UserWithdrawal } from "@/lib/mock/users"

function WithdrawalDetailDialog({
  withdrawal,
  open,
  onOpenChange,
}: {
  withdrawal: UserWithdrawal | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!withdrawal) return null

  const { detail } = withdrawal
  const isApproved = detail.status === "approved"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-[calc(100%-2rem)] overflow-y-auto rounded-3xl bg-background p-6 sm:max-w-lg">
        <DialogTitle className="text-xl font-semibold text-foreground">
          Withdrawal Details:
        </DialogTitle>

        <DetailPanel>
          <DetailRow label="Transaction ID" value={detail.transactionId} />
          <DetailRow label="Receiver's Name:" value={detail.receiverName} />
          <DetailRow label="Receiver's Bank:" value={detail.receiverBank} />
          <DetailRow
            label="Receiver's Account Number:"
            value={detail.receiverAccountNumber}
          />
          <DetailRow label="Remark:" value={detail.remark} />
          <DetailRow label="Withdrawal Date:" value={detail.withdrawalDate} />
          <DetailRow label="Amount Withdraw:" value={detail.amountWithdrawn} />
        </DetailPanel>

        <h3 className="text-base font-semibold text-foreground">Admin:</h3>
        <DetailPanel>
          <DetailRow
            label="Status:"
            value={
              <StatusDot
                tone={isApproved ? "good" : "warning"}
                label={isApproved ? "Approved" : "Pending"}
              />
            }
          />
          <DetailRow label="Admin Personnel:" value={detail.adminPersonnel} />
        </DetailPanel>

        <div className="flex justify-end">
          <Button
            disabled={isApproved}
            className="h-11 gap-2 rounded-full bg-status-good px-6 text-white hover:bg-status-good/90"
          >
            {isApproved ? "Approved" : "Approve"}
            <Check className="size-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { WithdrawalDetailDialog }
