import { useEffect, useState } from "react"
import { ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"

import { StatCard } from "@/components/dashboard/stat-card"
import { TransactionsTable } from "@/components/dashboard/transactions-table"
import { GiftcardTile } from "@/components/giftcards/giftcard-tile"
import { GiftcardDetailDrawer } from "@/components/giftcards/giftcard-detail-drawer"
import { DateRangeFilter } from "@/components/giftcards/date-range-filter"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth/use-auth"
import { listTransactions } from "@/lib/api/transactions"
import { mapApiTransaction } from "@/lib/api/adapters"
import { giftcardCatalog as seedCatalog, giftcardStats } from "@/lib/mock/giftcards"
import type { GiftcardBrand } from "@/lib/mock/giftcards"
import type { Transaction } from "@/lib/mock/dashboard"

function GiftcardsPage() {
  const { request } = useAuth()
  const [catalog, setCatalog] = useState<GiftcardBrand[]>(seedCatalog)
  const [selectedGiftcard, setSelectedGiftcard] = useState<GiftcardBrand | null>(
    null
  )
  const [recentGiftcardTransactions, setRecentGiftcardTransactions] = useState<
    Transaction[]
  >([])

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

  useEffect(() => {
    let cancelled = false
    listTransactions(request, { transactionType: "TRADE", page: 1, limit: 10 })
      .then((result) => {
        if (!cancelled) setRecentGiftcardTransactions(result.items.map(mapApiTransaction))
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [request])

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-2xl text-muted-foreground">All,</p>
          <p className="mt-1 text-3xl font-bold text-foreground">
            Giftcards Added
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <DateRangeFilter from="03-10-2025" to="03-11-2025" />
          <Button className="h-10 gap-2 rounded-full bg-primary px-5 text-primary-foreground hover:bg-primary/90">
            Sell All Details
            <ChevronRight className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {giftcardStats.map((card) => (
          <StatCard key={card.id} {...card} />
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Giftcards Added
          </h2>
          <Link
            to="/giftcards/all"
            className="text-sm font-medium text-primary hover:underline"
          >
            See All
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {catalog.slice(0, 6).map((giftcard) => (
            <GiftcardTile
              key={giftcard.id}
              giftcard={giftcard}
              onClick={() => setSelectedGiftcard(giftcard)}
            />
          ))}
        </div>
      </div>

      <TransactionsTable
        data={recentGiftcardTransactions}
        title="Recent Transactions:"
      />

      <GiftcardDetailDrawer
        giftcard={selectedGiftcard}
        open={selectedGiftcard !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedGiftcard(null)
        }}
        onGiftcardSaved={handleSaved}
        onGiftcardDeleted={handleDeleted}
      />
    </div>
  )
}

export default GiftcardsPage
