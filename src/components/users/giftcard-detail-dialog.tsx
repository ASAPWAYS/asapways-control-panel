import { useState } from "react"
import { Check, ImageIcon, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  FullScreenDialog,
  FullScreenDialogContent,
} from "@/components/ui/full-screen-dialog"
import { ConfirmActionDialog } from "@/components/ui/confirm-action-dialog"
import { DetailPanel, DetailRow } from "@/components/ui/detail-row"
import { StatusDot } from "@/components/ui/status-dot"
import { cn } from "@/lib/utils"
import type { UserGiftcardTransaction } from "@/lib/mock/users"

function GiftcardDetailDialog({
  transaction,
  open,
  onOpenChange,
}: {
  transaction: UserGiftcardTransaction | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [confirmAction, setConfirmAction] = useState<"deny" | "approve" | null>(
    null
  )

  if (!transaction) return null

  const { detail } = transaction
  const isPending = transaction.status === "pending-approval"

  return (
    <>
      <FullScreenDialog open={open} onOpenChange={onOpenChange}>
        <FullScreenDialogContent>
          <header className="flex items-center justify-between border-b border-border px-6 py-5 lg:px-10">
            <h1 className="text-xl font-semibold text-foreground">
              Giftcard Details:
            </h1>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onOpenChange(false)}
            >
              <X className="size-4" />
              <span className="sr-only">Close</span>
            </Button>
          </header>

          <div className="flex-1 overflow-y-auto px-6 py-8 lg:px-10">
            <div className="mx-auto flex max-w-2xl flex-col gap-6">
              <DetailPanel>
                <DetailRow label="Giftcard Name:" value={detail.giftcardName} />
                <DetailRow label="Card Type:" value={detail.cardType} />
              </DetailPanel>

              <div>
                <h3 className="mb-4 text-base font-semibold text-foreground">
                  Transaction Details:
                </h3>
                <DetailPanel>
                  <DetailRow label="Transaction ID" value={detail.transactionId} />
                  <DetailRow
                    label="Card Category:"
                    value={detail.cardCategory}
                    valueClassName="max-w-[65%]"
                  />
                  <DetailRow
                    label="Giftcard Amount:"
                    value={detail.giftcardAmount}
                  />
                  <DetailRow label="Rate:" value={detail.rate} />
                  <DetailRow label="E - Code" value={detail.eCode} />
                </DetailPanel>
              </div>

              <div className="flex gap-3">
                {[0, 1, 2].map((index) => (
                  <div
                    key={index}
                    className="flex size-20 items-center justify-center rounded-xl bg-muted"
                  >
                    <ImageIcon className="size-6 text-muted-foreground" />
                  </div>
                ))}
              </div>

              <div>
                <h3 className="mb-4 text-base font-semibold text-foreground">
                  Payment Details:
                </h3>
                <DetailPanel>
                  <DetailRow label="Payment Mode:" value={detail.paymentMode} />
                  <DetailRow
                    label={
                      detail.paymentMode.toLowerCase().includes("usdt")
                        ? "USDT Wallet:"
                        : "Bank Account:"
                    }
                    value={detail.walletAddress}
                  />
                  <DetailRow
                    label="Amount to receive:"
                    value={detail.amountToReceive}
                  />
                  <DetailRow
                    label="Status:"
                    value={
                      <StatusDot
                        tone={isPending ? "warning" : "good"}
                        label={isPending ? "Awaiting Confirmation" : "Confirmed"}
                      />
                    }
                  />
                </DetailPanel>
              </div>
            </div>
          </div>

          <footer className="border-t border-border px-6 py-5 lg:px-10">
            <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
              <Button
                variant="destructive"
                className={cn(
                  "h-11 gap-2 rounded-full bg-status-critical px-6 text-white hover:bg-status-critical/90"
                )}
                onClick={() => setConfirmAction("deny")}
              >
                Deny
              </Button>
              <button
                type="button"
                className="text-sm font-medium text-foreground hover:underline"
                onClick={() => onOpenChange(false)}
              >
                Report
              </button>
              <Button
                className="h-11 gap-2 rounded-full bg-status-good px-6 text-white hover:bg-status-good/90"
                onClick={() => setConfirmAction("approve")}
              >
                Approve
                <Check className="size-4" />
              </Button>
            </div>
          </footer>
        </FullScreenDialogContent>
      </FullScreenDialog>

      <ConfirmActionDialog
        open={confirmAction === "deny"}
        onOpenChange={(next) => setConfirmAction(next ? "deny" : null)}
        tone="critical"
        title="Want to Deny this Giftcard Transaction?"
        description="Are you sure you want to continue with this action?"
        reasonLabel="Enter Reason"
        reasonPlaceholder="Input the reason for denying this giftcard"
        reasonRequired
        noteText="**Note: This reason would be displayed to the user"
        confirmLabel="Deny"
        onConfirm={() => {
          setConfirmAction(null)
          onOpenChange(false)
        }}
      />

      <ConfirmActionDialog
        open={confirmAction === "approve"}
        onOpenChange={(next) => setConfirmAction(next ? "approve" : null)}
        tone="good"
        title="Approve Giftcard?"
        description="Are you sure you want to continue with this action?"
        reasonLabel="Remark ( Optional )"
        reasonPlaceholder="Input the reason for denying this giftcard"
        noteText="**Note: This reason would be displayed to the user"
        confirmLabel="Approve"
        onConfirm={() => {
          setConfirmAction(null)
          onOpenChange(false)
        }}
      />
    </>
  )
}

export { GiftcardDetailDialog }
