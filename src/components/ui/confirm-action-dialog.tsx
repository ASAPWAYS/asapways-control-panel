import { useState } from "react"
import { Check, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent } from "@/components/ui/dialog"

function ConfirmActionDialog({
  open,
  onOpenChange,
  tone,
  title,
  description,
  reasonLabel,
  reasonPlaceholder,
  reasonRequired = false,
  noteText,
  confirmLabel,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  tone: "critical" | "good"
  title: string
  description: string
  reasonLabel: string
  reasonPlaceholder: string
  reasonRequired?: boolean
  noteText?: string
  confirmLabel: string
  onConfirm: (reason: string) => void
}) {
  const [reason, setReason] = useState("")
  const isGood = tone === "good"

  function handleConfirm() {
    if (reasonRequired && !reason.trim()) return
    onConfirm(reason)
    setReason("")
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setReason("")
        onOpenChange(next)
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="max-w-[calc(100%-2rem)] overflow-hidden rounded-3xl bg-background p-0 sm:max-w-sm"
      >
        <div
          className={cn(
            "flex items-center justify-center py-9",
            isGood ? "bg-status-good" : "bg-status-critical"
          )}
        >
          <span className="flex size-20 items-center justify-center rounded-full border-2 border-white">
            {isGood ? (
              <Check className="size-9 text-white" strokeWidth={2.5} />
            ) : (
              <X className="size-9 text-white" strokeWidth={2.5} />
            )}
          </span>
        </div>

        <div className="flex flex-col gap-4 p-6">
          <div>
            <h2 className="text-center text-lg font-bold text-foreground">
              {title}
            </h2>
            <p className="mt-1.5 text-center text-sm text-muted-foreground">
              {description}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">
              {reasonLabel}
            </label>
            <Textarea
              className="mt-2 min-h-24 rounded-xl"
              placeholder={reasonPlaceholder}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            />
            {noteText ? (
              <p className="mt-2 text-xs text-status-warning italic">
                {noteText}
              </p>
            ) : null}
          </div>

          <div className="flex justify-end">
            <Button
              className={cn(
                "h-11 gap-2 rounded-full px-6 text-white",
                isGood
                  ? "bg-status-good hover:bg-status-good/90"
                  : "bg-status-critical hover:bg-status-critical/90"
              )}
              disabled={reasonRequired && !reason.trim()}
              onClick={handleConfirm}
            >
              {confirmLabel}
              <Check className="size-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { ConfirmActionDialog }
