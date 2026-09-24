import { useState } from "react"
import { Pencil, Plus } from "lucide-react"

import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { SearchInput } from "@/components/ui/search-input"
import { FilterSelect } from "@/components/ui/filter-select"
import { Pagination } from "@/components/ui/pagination"
import { StatusDot } from "@/components/ui/status-dot"
import { Button } from "@/components/ui/button"
import { CardCategoriesTable } from "@/components/giftcards/card-categories-table"
import { EditGiftcardDialog } from "@/components/giftcards/edit-giftcard-dialog"
import { cn } from "@/lib/utils"
import { sortOrderOptions } from "@/lib/mock/users"
import type { GiftcardBrand } from "@/lib/mock/giftcards"

const detailTabs = ["Card Categories", "Transaction History", "About Giftcard"] as const

function GiftcardDetailDrawer({
  giftcard,
  open,
  onOpenChange,
  onGiftcardSaved,
  onGiftcardDeleted,
}: {
  giftcard: GiftcardBrand | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onGiftcardSaved?: (giftcard: GiftcardBrand) => void
  onGiftcardDeleted?: () => void
}) {
  const [sortOrder, setSortOrder] = useState("all")
  const [page, setPage] = useState(1)
  const [editOpen, setEditOpen] = useState(false)

  if (!giftcard) return null

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <div className="flex flex-col items-center px-6 pt-4 pb-6 text-center">
            <div
              className={cn(
                "flex size-28 items-center justify-center overflow-hidden rounded-full",
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
                <span className={cn("text-xs leading-tight", giftcard.wordmarkClassName)}>
                  {giftcard.wordmark}
                </span>
              )}
            </div>
            <h2 className="mt-4 text-2xl font-bold text-foreground">
              {giftcard.name}
            </h2>
            <p className="mt-1 text-muted-foreground">
              {giftcard.cardCategoriesCount} Card Categories
            </p>

            <div className="mt-6 flex items-center gap-6">
              <div className="text-center">
                <StatusDot
                  tone={giftcard.status === "active" ? "good" : "warning"}
                  label={giftcard.status === "active" ? "Active" : "Non - Active"}
                  className="justify-center text-base"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Giftcard Status
                </p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <p className="font-semibold text-foreground">
                  {giftcard.dateAdded}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Date Added</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <p className="font-semibold text-foreground">
                  {giftcard.tradedCount}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Giftcard Traded
                </p>
              </div>
            </div>

            <Button
              className="mt-5 h-10 gap-2 rounded-full bg-primary px-5 text-primary-foreground hover:bg-primary/90"
              onClick={() => setEditOpen(true)}
            >
              Edit
              <Pencil className="size-3.5" />
            </Button>
          </div>

          <Tabs defaultValue="Card Categories" className="px-6">
            <TabsList
              variant="line"
              className="h-auto justify-start gap-6 border-b border-border pb-0"
            >
              {detailTabs.map((tab) => (
                <TabsTrigger key={tab} value={tab} className="px-0 pb-3 text-sm">
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="Card Categories" className="pt-5 pb-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Button className="h-10 gap-2 rounded-full bg-primary px-4 text-primary-foreground hover:bg-primary/90">
                  Add Category
                  <Plus className="size-3.5" />
                </Button>

                <div className="flex flex-wrap items-center gap-2">
                  <SearchInput placeholder="Search..." className="w-48" />
                  <FilterSelect
                    label="Sort Order"
                    options={sortOrderOptions}
                    value={sortOrder}
                    onChange={setSortOrder}
                  />
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-card p-2">
                <CardCategoriesTable data={giftcard.categories} />
              </div>

              <Pagination
                page={page}
                pageCount={2}
                onPageChange={setPage}
                className="mt-6"
              />
            </TabsContent>

            <TabsContent
              value="Transaction History"
              className="py-16 text-center text-sm text-muted-foreground"
            >
              Transaction History coming soon.
            </TabsContent>

            <TabsContent
              value="About Giftcard"
              className="py-16 text-center text-sm text-muted-foreground"
            >
              About Giftcard coming soon.
            </TabsContent>
          </Tabs>
        </DrawerContent>
      </Drawer>

      <EditGiftcardDialog
        giftcard={giftcard}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSaved={onGiftcardSaved}
        onDelete={() => {
          onOpenChange(false)
          onGiftcardDeleted?.()
        }}
      />
    </>
  )
}

export { GiftcardDetailDrawer }
