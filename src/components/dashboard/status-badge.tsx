import { StatusDot, type StatusTone } from "@/components/ui/status-dot"
import type { TransactionStatus } from "@/lib/mock/dashboard"

const statusConfig: Record<TransactionStatus, { label: string; tone: StatusTone }> = {
  approved: { label: "Approved", tone: "good" },
  "awaiting-approval": { label: "Awaiting Approval", tone: "warning" },
  failed: { label: "Failed", tone: "critical" },
}

function StatusBadge({ status }: { status: TransactionStatus }) {
  const { label, tone } = statusConfig[status]

  return <StatusDot tone={tone} label={label} />
}

export { StatusBadge }
