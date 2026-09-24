"use client"

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"

import { cn } from "@/lib/utils"

function Drawer({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="drawer" {...props} />
}

function DrawerTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

function DrawerPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="drawer-portal" {...props} />
}

function DrawerClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="drawer-close" {...props} />
}

function DrawerOverlay({ className, ...props }: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="drawer-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/60 duration-150 lg:left-64 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

function DrawerContent({
  className,
  children,
  ...props
}: DialogPrimitive.Popup.Props) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DialogPrimitive.Popup
        data-slot="drawer-content"
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl bg-background outline-none duration-200 lg:left-64 lg:w-auto data-open:animate-in data-open:slide-in-from-bottom-8 data-closed:animate-out data-closed:slide-out-to-bottom-8",
          className
        )}
        {...props}
      >
        <div className="mx-auto mt-3 h-1.5 w-16 shrink-0 rounded-full bg-muted-foreground/30" />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </DialogPrimitive.Popup>
    </DrawerPortal>
  )
}

export {
  Drawer,
  DrawerTrigger,
  DrawerPortal,
  DrawerClose,
  DrawerOverlay,
  DrawerContent,
}
