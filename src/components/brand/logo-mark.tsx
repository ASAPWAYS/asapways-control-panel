import { cn } from "@/lib/utils"

// Placeholder mark until the real logo lands in public/assets/auth/white-logo.png (currently a blank 1x1 file).
function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 48"
      fill="currentColor"
      className={cn("h-10 w-auto text-white", className)}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20 2L36 46H4L20 2ZM24 14L21.5 24H27L16 40L18.5 28H14L21 14H24Z"
      />
    </svg>
  )
}

export { LogoMark }
