import type { TransactionStatus } from "@/lib/mock/dashboard"

const statusConfig: Record<
  TransactionStatus,
  { label: string; dotClassName: string; textClassName: string }
> = {
  approved: {
    label: "Approved",
    dotClassName: "bg-status-good",
    textClassName: "text-status-good",
  },
  "awaiting-approval": {
    label: "Awaiting Approval",
    dotClassName: "bg-status-warning",
    textClassName: "text-status-warning",
  },
  failed: {
    label: "Failed",
    dotClassName: "bg-status-critical",
    textClassName: "text-status-critical",
  },
}

function StatusBadge({ status }: { status: TransactionStatus }) {
  const { label, dotClassName, textClassName } = statusConfig[status]

  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium">
      <span className={`size-1.5 rounded-full ${dotClassName}`} />
      <span className={textClassName}>{label}</span>
    </span>
  )
}

export { StatusBadge }
