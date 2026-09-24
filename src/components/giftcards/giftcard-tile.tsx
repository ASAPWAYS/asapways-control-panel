import { cn } from "@/lib/utils"
import type { GiftcardBrand } from "@/lib/mock/giftcards"

function GiftcardTile({
  giftcard,
  onClick,
}: {
  giftcard: GiftcardBrand
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full flex-col items-center gap-3 text-center"
    >
      <div
        className={cn(
          "flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl px-3 ring-1 ring-white/10",
          giftcard.tileClassName
        )}
      >
        {giftcard.imageUrl ? (
          <img
            src={giftcard.imageUrl}
            alt={giftcard.name}
            className="size-full object-cover"
          />
        ) : (
          <span className={cn("text-center text-sm", giftcard.wordmarkClassName)}>
            {giftcard.wordmark}
          </span>
        )}
      </div>
      <p className="text-sm font-medium text-foreground">{giftcard.name}</p>
    </button>
  )
}

export { GiftcardTile }
