import { useEffect, useRef, useState } from "react"
import { Check, ChevronRight } from "lucide-react"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DetailPanel } from "@/components/ui/detail-row"
import { ConfirmActionDialog } from "@/components/ui/confirm-action-dialog"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth/use-auth"
import { ApiError } from "@/lib/api/client"
import {
  createGiftcardCategory,
  updateGiftcardCategory,
  deleteGiftcardCategory,
  createGiftcardSubCategory,
} from "@/lib/api/giftcards"
import type { GiftcardBrand, CardCategory } from "@/lib/mock/giftcards"

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function isRealId(id: string) {
  return UUID_RE.test(id)
}

function EditableRow({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-3 text-sm last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-40 border-b border-foreground/40 bg-transparent text-right font-semibold text-foreground underline decoration-foreground/40 underline-offset-4 outline-none"
      />
    </div>
  )
}

function AddSubCategoryDialog({
  categoryId,
  open,
  onOpenChange,
  onCreated,
}: {
  categoryId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: (category: CardCategory) => void
}) {
  const { request } = useAuth()
  const [name, setName] = useState("")
  const [rate, setRate] = useState("")
  const [minimumAmount, setMinimumAmount] = useState("")
  const [maximumAmount, setMaximumAmount] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setName("")
    setRate("")
    setMinimumAmount("")
    setMaximumAmount("")
    setError(null)
  }, [open])

  async function handleSubmit() {
    const rateNum = Number(rate)
    const minNum = Number(minimumAmount)
    const maxNum = Number(maximumAmount)
    if (!name || !rateNum || !minNum || !maxNum) {
      setError("Fill in every field")
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await createGiftcardSubCategory(request, categoryId, {
        name,
        rate: rateNum,
        minimumAmount: minNum,
        maximumAmount: maxNum,
      })
      onCreated({
        id: crypto.randomUUID(),
        category: 0,
        description: name,
        amountRange: `$${minNum}-$${maxNum}`,
        tradeCount: 0,
        status: "active",
        dateAdded: new Date().toLocaleDateString(),
      })
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] rounded-3xl bg-background p-6 sm:max-w-sm">
        <DialogTitle className="text-lg font-bold text-foreground">Add Card Category</DialogTitle>

        <div className="flex flex-col gap-4">
          <div>
            <Label className="text-sm font-medium text-foreground">Name</Label>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. USA $10 to $99"
              className="mt-2 h-10 rounded-lg"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-foreground">Rate</Label>
            <Input
              type="number"
              value={rate}
              onChange={(event) => setRate(event.target.value)}
              className="mt-2 h-10 rounded-lg"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <Label className="text-sm font-medium text-foreground">Min Amount</Label>
              <Input
                type="number"
                value={minimumAmount}
                onChange={(event) => setMinimumAmount(event.target.value)}
                className="mt-2 h-10 rounded-lg"
              />
            </div>
            <div className="flex-1">
              <Label className="text-sm font-medium text-foreground">Max Amount</Label>
              <Input
                type="number"
                value={maximumAmount}
                onChange={(event) => setMaximumAmount(event.target.value)}
                className="mt-2 h-10 rounded-lg"
              />
            </div>
          </div>

          {error ? <p className="text-sm text-status-critical">{error}</p> : null}

          <div className="flex justify-end">
            <Button
              disabled={submitting}
              onClick={handleSubmit}
              className="h-11 rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/90"
            >
              {submitting ? "Adding…" : "Add Category"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function EditGiftcardDialog({
  giftcard,
  open,
  onOpenChange,
  mode = "edit",
  onSaved,
  onDelete,
}: {
  giftcard: GiftcardBrand | null
  open: boolean
  onOpenChange: (open: boolean) => void
  mode?: "edit" | "create"
  onSaved?: (giftcard: GiftcardBrand) => void
  onDelete?: () => void
}) {
  const { request } = useAuth()
  const [name, setName] = useState("")
  const [rangeFrom, setRangeFrom] = useState("")
  const [rangeTo, setRangeTo] = useState("")
  const [active, setActive] = useState(true)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [addSubCategoryOpen, setAddSubCategoryOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isReal = mode === "edit" && giftcard ? isRealId(giftcard.id) : false

  useEffect(() => {
    if (!open) return
    setImageFile(null)
    setError(null)
    if (mode === "edit" && giftcard) {
      setName(giftcard.name)
      setRangeFrom(giftcard.rangeFrom)
      setRangeTo(giftcard.rangeTo)
      setActive(giftcard.status === "active")
      setImagePreview(giftcard.imageUrl)
    } else {
      setName("")
      setRangeFrom("")
      setRangeTo("")
      setActive(true)
      setImagePreview(undefined)
    }
  }, [giftcard, open, mode])

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const isDirty =
    mode === "create"
      ? name.trim().length > 0 && imageFile !== null
      : giftcard
        ? name !== giftcard.name ||
          rangeFrom !== giftcard.rangeFrom ||
          rangeTo !== giftcard.rangeTo ||
          active !== (giftcard.status === "active") ||
          imageFile !== null
        : false

  async function handleSubmit() {
    setSubmitting(true)
    setError(null)
    try {
      if (mode === "create") {
        if (!imageFile) {
          setError("Choose an image for this gift card")
          return
        }
        const result = await createGiftcardCategory(request, {
          name,
          image: imageFile,
          previewImage: imageFile,
          status: active ? "ACTIVE" : "INACTIVE",
        })
        const createdId =
          result && typeof result === "object" && "id" in result
            ? String((result as { id: unknown }).id)
            : crypto.randomUUID()

        onSaved?.({
          id: createdId,
          name,
          tileClassName: "bg-muted",
          wordmark: name.slice(0, 2).toUpperCase(),
          wordmarkClassName: "font-bold text-foreground",
          cardCategoriesCount: 0,
          status: active ? "active" : "inactive",
          dateAdded: new Date().toLocaleDateString(),
          tradedCount: 0,
          rangeFrom: rangeFrom || "0",
          rangeTo: rangeTo || "0",
          categories: [],
          imageUrl: imagePreview,
        })
      } else if (giftcard) {
        if (isReal) {
          await updateGiftcardCategory(request, giftcard.id, {
            name,
            image: imageFile ?? undefined,
            previewImage: imageFile ?? undefined,
            status: active ? "ACTIVE" : "INACTIVE",
          })
        }
        onSaved?.({
          ...giftcard,
          name,
          rangeFrom,
          rangeTo,
          status: active ? "active" : "inactive",
          imageUrl: imagePreview ?? giftcard.imageUrl,
        })
      }
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!giftcard) return
    setDeleting(true)
    setError(null)
    try {
      if (isReal) {
        await deleteGiftcardCategory(request, giftcard.id)
      }
      setConfirmDelete(false)
      onOpenChange(false)
      onDelete?.()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[85vh] max-w-[calc(100%-2rem)] overflow-y-auto rounded-3xl bg-background p-6 sm:max-w-lg">
          <DialogTitle className="sr-only">
            {mode === "create" ? "Add Giftcard" : "Edit Giftcard"}
          </DialogTitle>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group relative flex size-28 items-center justify-center overflow-hidden rounded-full bg-muted text-center"
            >
              {imagePreview ? (
                <img src={imagePreview} alt={name} className="size-full object-cover" />
              ) : giftcard ? (
                <span className={cn("text-xs leading-tight", giftcard.wordmarkClassName)}>
                  {giftcard.wordmark}
                </span>
              ) : null}
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs font-medium text-white">
                Tap to Change
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <DetailPanel>
            <EditableRow label="Giftcard Name:" value={name} onChange={setName} />
          </DetailPanel>

          <h3 className="text-base font-semibold text-foreground">
            Set Giftcard Range:
          </h3>
          <DetailPanel>
            <EditableRow label="From:" value={rangeFrom} onChange={setRangeFrom} />
            <EditableRow label="To:" value={rangeTo} onChange={setRangeTo} />
          </DetailPanel>

          {mode === "edit" && giftcard ? (
            <DetailPanel>
              <div className="flex items-center justify-between gap-4 py-1 text-sm">
                <span className="text-muted-foreground">Card Category</span>
                <span className="inline-flex items-center gap-1 font-medium text-foreground">
                  View All ({giftcard.categories.length})
                  <ChevronRight className="size-4 text-muted-foreground" />
                </span>
              </div>
            </DetailPanel>
          ) : null}

          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">
              Giftcard Status
            </span>
            <Switch checked={active} onCheckedChange={setActive} />
          </div>

          <div className="flex flex-col items-center gap-2">
            <Button
              disabled={mode === "create" || !isReal}
              title={
                mode !== "create" && !isReal
                  ? "Sample data — create a real gift card first"
                  : undefined
              }
              className="h-11 gap-2 rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/90"
              onClick={() => setAddSubCategoryOpen(true)}
            >
              Add Card Category
              <span className="text-base leading-none">+</span>
            </Button>
            {mode !== "create" && !isReal ? (
              <p className="text-xs text-muted-foreground">
                Sample data — changes here are saved locally only.
              </p>
            ) : null}
          </div>

          {error ? <p className="text-center text-sm text-status-critical">{error}</p> : null}

          <div className="flex items-center justify-between gap-3">
            {mode === "edit" ? (
              <Button
                disabled={deleting}
                className="h-11 rounded-full bg-status-critical px-6 text-white hover:bg-status-critical/90"
                onClick={() => setConfirmDelete(true)}
              >
                Delete Giftcard
              </Button>
            ) : (
              <span />
            )}
            <Button
              disabled={!isDirty || submitting}
              className={cn(
                "h-11 gap-2 rounded-full px-6 text-white",
                isDirty
                  ? "bg-status-good hover:bg-status-good/90"
                  : "bg-muted text-muted-foreground"
              )}
              onClick={handleSubmit}
            >
              {submitting ? "Saving…" : mode === "create" ? "Add Giftcard" : "Save Changes"}
              <Check className="size-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {giftcard && isReal ? (
        <AddSubCategoryDialog
          categoryId={giftcard.id}
          open={addSubCategoryOpen}
          onOpenChange={setAddSubCategoryOpen}
          onCreated={(category) => {
            onSaved?.({
              ...giftcard,
              categories: [...giftcard.categories, category],
              cardCategoriesCount: giftcard.cardCategoriesCount + 1,
            })
          }}
        />
      ) : null}

      <ConfirmActionDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        tone="critical"
        title="Want to Delete this Giftcard?"
        description="Are you sure you want to continue with this action?"
        reasonLabel="Enter Reason"
        reasonPlaceholder="Input the reason for deleting this giftcard"
        reasonRequired
        noteText="**Note: This reason would be displayed in the activity log"
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </>
  )
}

export { EditGiftcardDialog }
