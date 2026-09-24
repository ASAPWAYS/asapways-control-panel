import { ChevronDown } from "lucide-react"

function DatePill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium text-foreground">
        {value}
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </span>
    </div>
  )
}

function DateRangeFilter({ from, to }: { from: string; to: string }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <DatePill label="From" value={from} />
      <span className="text-muted-foreground">—</span>
      <DatePill label="To" value={to} />
    </div>
  )
}

export { DateRangeFilter }
