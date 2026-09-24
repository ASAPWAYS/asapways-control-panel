"use client"

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"

import { cn } from "@/lib/utils"

function FullScreenDialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="full-screen-dialog" {...props} />
}

function FullScreenDialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return (
    <DialogPrimitive.Portal data-slot="full-screen-dialog-portal" {...props} />
  )
}

function FullScreenDialogContent({
  className,
  children,
  ...props
}: DialogPrimitive.Popup.Props) {
  return (
    <FullScreenDialogPortal>
      <DialogPrimitive.Popup
        data-slot="full-screen-dialog-content"
        className={cn(
          "fixed inset-0 z-50 flex flex-col overflow-hidden bg-background outline-none duration-150 lg:left-64 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Popup>
    </FullScreenDialogPortal>
  )
}

export { FullScreenDialog, FullScreenDialogPortal, FullScreenDialogContent }
