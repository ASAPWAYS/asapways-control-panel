import { cn } from "@/lib/utils"

// Full horizontal logo (white, for the dark UI). Source: Asapways brand guide.
function Logo({ className }: { className?: string }) {
  return (
    <img
      src="/assets/brand/logo-horizontal-white.svg"
      alt="Asapways"
      className={cn("h-7 w-auto", className)}
    />
  )
}

export { Logo }
