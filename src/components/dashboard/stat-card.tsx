import { ArrowUp, ArrowDown } from "lucide-react"

import { cn } from "@/lib/utils"
import type { StatCardData } from "@/lib/mock/dashboard"

function StatCard({ value, label, trend }: StatCardData) {
  return (
    <div className="rounded-2xl bg-card p-5">
      <div className="flex items-center gap-2">
        <span className="text-3xl font-bold text-foreground">{value}</span>
        {trend ? (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-sm font-medium",
              trend.direction === "up" ? "text-status-good" : "text-status-critical"
            )}
          >
            {trend.direction === "up" ? (
              <ArrowUp className="size-3.5" />
            ) : (
              <ArrowDown className="size-3.5" />
            )}
            {trend.percent}
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

export { StatCard }
