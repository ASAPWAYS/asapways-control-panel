import { ChevronDown, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import type { FilterOption } from "@/lib/types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function FilterSelect({
  label,
  icon: Icon,
  options,
  value,
  onChange,
  className,
}: {
  label: string
  icon?: LucideIcon
  options: FilterOption[]
  value: string
  onChange: (value: string) => void
  className?: string
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className={cn(
              "inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-border bg-transparent px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent aria-expanded:bg-accent",
              className
            )}
          >
            {Icon ? <Icon className="size-3.5 text-muted-foreground" /> : null}
            {label}
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </button>
        }
      />
      <DropdownMenuContent align="start">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              value === option.value && "bg-accent text-accent-foreground"
            )}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { FilterSelect }
