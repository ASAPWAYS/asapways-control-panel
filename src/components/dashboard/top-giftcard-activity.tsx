import type { GiftcardActivity } from "@/lib/mock/dashboard"

function TopGiftcardActivity({ items }: { items: GiftcardActivity[] }) {
  return (
    <div className="flex h-full flex-col rounded-2xl bg-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">
          Top Giftcard Activity
        </h2>
        <a
          href="#"
          className="text-sm font-medium text-primary hover:underline"
        >
          See All
        </a>
      </div>

      <div className="mt-4 flex items-center justify-between px-3 text-xs text-muted-foreground">
        <span>Giftcard</span>
        <span>Sells Rate</span>
      </div>

      <ul className="mt-2 flex flex-1 flex-col gap-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between rounded-lg bg-secondary px-3 py-2.5 text-sm"
          >
            <span className="font-medium text-foreground">{item.name}</span>
            <span className="text-muted-foreground">{item.sellsRate}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export { TopGiftcardActivity }
