import { useState } from "react"
import { ArrowLeft, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { GiftcardTile } from "@/components/giftcards/giftcard-tile"
import { GiftcardDetailDrawer } from "@/components/giftcards/giftcard-detail-drawer"
import { EditGiftcardDialog } from "@/components/giftcards/edit-giftcard-dialog"
import { giftcardCatalog as seedCatalog } from "@/lib/mock/giftcards"
import type { GiftcardBrand } from "@/lib/mock/giftcards"

function AllGiftcardsPage() {
  const navigate = useNavigate()
  const [catalog, setCatalog] = useState<GiftcardBrand[]>(seedCatalog)
  const [selectedGiftcard, setSelectedGiftcard] = useState<GiftcardBrand | null>(
    null
  )
  const [addOpen, setAddOpen] = useState(false)

  function handleSaved(updated: GiftcardBrand) {
    setCatalog((current) => {
      const exists = current.some((item) => item.id === updated.id)
      return exists
        ? current.map((item) => (item.id === updated.id ? updated : item))
        : [updated, ...current]
    })
    setSelectedGiftcard((current) => (current?.id === updated.id ? updated : current))
  }

  function handleDeleted() {
    if (!selectedGiftcard) return
    setCatalog((current) => current.filter((item) => item.id !== selectedGiftcard.id))
    setSelectedGiftcard(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex size-11 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-accent"
        >
          <ArrowLeft className="size-4" />
        </button>
        <Button
          className="h-10 gap-2 rounded-full bg-primary px-5 text-primary-foreground hover:bg-primary/90"
          onClick={() => setAddOpen(true)}
        >
          <Plus className="size-3.5" />
          Add Giftcard
        </Button>
      </div>

      <h1 className="text-2xl font-bold text-foreground">All Giftcards</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {catalog.map((giftcard) => (
          <GiftcardTile
            key={giftcard.id}
            giftcard={giftcard}
            onClick={() => setSelectedGiftcard(giftcard)}
          />
        ))}
      </div>

      <GiftcardDetailDrawer
        giftcard={selectedGiftcard}
        open={selectedGiftcard !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedGiftcard(null)
        }}
        onGiftcardSaved={handleSaved}
        onGiftcardDeleted={handleDeleted}
      />

      <EditGiftcardDialog
        giftcard={null}
        mode="create"
        open={addOpen}
        onOpenChange={setAddOpen}
        onSaved={handleSaved}
      />
    </div>
  )
}

export default AllGiftcardsPage
