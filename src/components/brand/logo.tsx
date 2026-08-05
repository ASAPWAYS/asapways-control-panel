import { cn } from "@/lib/utils"
import { LogoMark } from "@/components/brand/logo-mark"

function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <LogoMark className="h-7" />
      <span className="text-lg font-semibold text-white">AsapWays</span>
    </div>
  )
}

export { Logo }
