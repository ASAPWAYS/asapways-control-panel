import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

function DetailPanel({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn("rounded-2xl bg-card px-4", className)}>{children}</div>
}

function DetailRow({
  label,
  value,
  valueClassName,
}: {
  label: string
  value: ReactNode
  valueClassName?: string
}) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-border py-3 text-sm last:border-b-0">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span
        className={cn(
          "text-right font-medium text-foreground",
          valueClassName
        )}
      >
        {value}
      </span>
    </div>
  )
}

export { DetailPanel, DetailRow }
