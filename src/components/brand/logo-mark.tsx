import { cn } from "@/lib/utils"

const SOURCES = {
  blue: "/assets/brand/logo-icon.svg",
  white: "/assets/brand/logo-icon-white.svg",
} as const

// The "A" icon on its own, for small spaces. Source: Asapways brand guide.
function LogoMark({
  className,
  variant = "blue",
}: {
  className?: string
  variant?: keyof typeof SOURCES
}) {
  return (
    <img
      src={SOURCES[variant]}
      alt="Asapways"
      className={cn("h-10 w-auto", className)}
    />
  )
}

export { LogoMark }
