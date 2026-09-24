import { Fragment, type ReactNode } from "react"

function StatTileRow({
  items,
}: {
  items: { value: ReactNode; label: string }[]
}) {
  return (
    <div className="flex items-stretch gap-3">
      {items.map((item, index) => (
        <Fragment key={index}>
          {index > 0 ? (
            <div className="hidden w-px shrink-0 bg-border sm:block" />
          ) : null}
          <div className="flex-1 rounded-2xl bg-card px-3 py-4 text-center">
            <p className="text-lg font-bold text-foreground">{item.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{item.label}</p>
          </div>
        </Fragment>
      ))}
    </div>
  )
}

export { StatTileRow }
