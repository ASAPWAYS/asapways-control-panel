import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { DetailPanel, DetailRow } from "@/components/ui/detail-row"
import { StatusDot } from "@/components/ui/status-dot"
import type { BillTransaction } from "@/lib/mock/users"

function BillDetailDialog({
  bill,
  open,
  onOpenChange,
}: {
  bill: BillTransaction | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!bill) return null

  const { detail } = bill

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-[calc(100%-2rem)] overflow-y-auto rounded-3xl bg-background p-6 sm:max-w-lg">
        <DialogTitle className="text-xl font-semibold text-foreground">
          Bill Details:
        </DialogTitle>

        <DetailPanel>
          <DetailRow label="Transaction ID" value={detail.transactionId} />
          <DetailRow label="Transaction Type:" value={detail.transactionType} />
          <DetailRow label="Description:" value={detail.description} />
          {detail.fields.map((field) => (
            <DetailRow key={field.label} label={field.label} value={field.value} />
          ))}
          <DetailRow label="Transaction Date:" value={detail.date} />
          <DetailRow label="Amount:" value={detail.amount} />
        </DetailPanel>

        <h3 className="text-base font-semibold text-foreground">
          Transaction Status:
        </h3>
        <DetailPanel>
          <DetailRow
            label="Status:"
            value={<StatusDot tone="good" label="Successful" />}
          />
        </DetailPanel>
      </DialogContent>
    </Dialog>
  )
}

export { BillDetailDialog }
