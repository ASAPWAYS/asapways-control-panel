import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { DetailPanel, DetailRow } from "@/components/ui/detail-row"
import { StatusDot, type StatusTone } from "@/components/ui/status-dot"
import { formatNaira } from "@/lib/format-number"
import type { ApiTransaction, TransactionStatus } from "@/lib/api/transactions"

const statusTone: Record<TransactionStatus, StatusTone> = {
  SUCCESSFUL: "good",
  PENDING: "warning",
  REJECTED: "critical",
  FAILED: "critical",
  REVERSAL: "neutral",
}

function TransactionDetailDialog({
  transaction,
  open,
  onOpenChange,
}: {
  transaction: ApiTransaction | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!transaction) return null

  const { tradeTransactable, walletTransactable, billTransactable } = transaction

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-[calc(100%-2rem)] overflow-y-auto rounded-3xl bg-background p-6 sm:max-w-3xl">
        <DialogTitle className="text-xl font-semibold text-foreground">
          Transaction Details
        </DialogTitle>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <h3 className="mb-2 text-base font-semibold text-foreground">General</h3>
            <DetailPanel>
              <DetailRow label="Reference:" value={transaction.transactionReference} />
              <DetailRow label="Type:" value={transaction.transactionType} />
              <DetailRow label="Entry:" value={transaction.entry} />
              <DetailRow
                label="User:"
                value={
                  transaction.user?.fullName ??
                  transaction.user?.username ??
                  transaction.user?.email ??
                  "—"
                }
              />
              <DetailRow
                label="Status:"
                value={
                  <StatusDot tone={statusTone[transaction.status]} label={transaction.status} />
                }
              />
              <DetailRow label="Date:" value={new Date(transaction.createdAt).toLocaleString()} />
            </DetailPanel>
          </div>

          <div>
            <h3 className="mb-2 text-base font-semibold text-foreground">Balance</h3>
            <DetailPanel>
              <DetailRow label="Amount:" value={formatNaira(transaction.amount)} />
              <DetailRow label="Fee:" value={formatNaira(transaction.transactionFee)} />
              <DetailRow label="Balance Before:" value={formatNaira(transaction.amountBefore)} />
              <DetailRow label="Balance After:" value={formatNaira(transaction.amountAfter)} />
            </DetailPanel>
          </div>

          {tradeTransactable ? (
            <div className="md:col-span-2">
              <h3 className="mb-2 text-base font-semibold text-foreground">Gift Card Trade</h3>
              <DetailPanel className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                <DetailRow
                  label="Gift Card:"
                  value={tradeTransactable.giftCardSubCategory?.giftcardCategory.name ?? "—"}
                />
                <DetailRow
                  label="Category:"
                  value={tradeTransactable.giftCardSubCategory?.name ?? "—"}
                />
                <DetailRow label="Card Amount:" value={tradeTransactable.amount} />
                <DetailRow label="Rate:" value={tradeTransactable.rate} />
                <DetailRow label="E-Code:" value={tradeTransactable.ecode ?? "—"} />
                {tradeTransactable.address ? (
                  <DetailRow label="Wallet Address:" value={tradeTransactable.address} />
                ) : null}
                <DetailRow
                  label="Attachments:"
                  value={
                    tradeTransactable.attachments.length > 0
                      ? `${tradeTransactable.attachments.length} file(s)`
                      : "None"
                  }
                />
              </DetailPanel>
            </div>
          ) : null}

          {walletTransactable ? (
            <div className="md:col-span-2">
              <h3 className="mb-2 text-base font-semibold text-foreground">Wallet Detail</h3>
              <DetailPanel className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                <DetailRow label="Wallet Type:" value={walletTransactable.walletType} />
                {walletTransactable.bankName ? (
                  <DetailRow label="Bank:" value={walletTransactable.bankName} />
                ) : null}
                {walletTransactable.accountName ? (
                  <DetailRow label="Account Name:" value={walletTransactable.accountName} />
                ) : null}
                {walletTransactable.accountNumber ? (
                  <DetailRow label="Account Number:" value={walletTransactable.accountNumber} />
                ) : null}
                <DetailRow label="Charge:" value={formatNaira(walletTransactable.charge)} />
              </DetailPanel>
            </div>
          ) : null}

          {billTransactable ? (
            <div className="md:col-span-2">
              <h3 className="mb-2 text-base font-semibold text-foreground">Bill Payment</h3>
              <DetailPanel className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                <DetailRow label="Bill Type:" value={billTransactable.billType} />
                <DetailRow label="Provider:" value={billTransactable.billProvider} />
                {billTransactable.phoneNumber ? (
                  <DetailRow label="Phone Number:" value={billTransactable.phoneNumber} />
                ) : null}
                {billTransactable.productName ? (
                  <DetailRow label="Product:" value={billTransactable.productName} />
                ) : null}
              </DetailPanel>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { TransactionDetailDialog }
