import { ArrowRight } from "lucide-react"

function NavRow({
  title,
  subtitle,
  onClick,
}: {
  title: string
  subtitle: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-4 rounded-2xl bg-card px-5 py-4 text-left transition-colors hover:bg-accent"
    >
      <div>
        <p className="font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground">
        <ArrowRight className="size-4" />
      </span>
    </button>
  )
}

export { NavRow }
