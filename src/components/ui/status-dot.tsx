import { cn } from "@/lib/utils"

export type StatusTone = "good" | "warning" | "critical" | "neutral"

const toneClasses: Record<StatusTone, { dot: string; text: string }> = {
  good: { dot: "bg-status-good", text: "text-status-good" },
  warning: { dot: "bg-status-warning", text: "text-status-warning" },
  critical: { dot: "bg-status-critical", text: "text-status-critical" },
  neutral: { dot: "bg-muted-foreground", text: "text-muted-foreground" },
}

function StatusDot({
  tone,
  label,
  className,
}: {
  tone: StatusTone
  label: string
  className?: string
}) {
  const { dot, text } = toneClasses[tone]

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-sm font-medium",
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full", dot)} />
      <span className={text}>{label}</span>
    </span>
  )
}

export { StatusDot }
