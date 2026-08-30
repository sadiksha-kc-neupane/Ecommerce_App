import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cn } from "../../lib/utils.js"

// Lightweight right-side drawer (like shadcn's Sheet) built on Radix Dialog,
// used for the mobile catalog filter panel. Warm-styled to match the app.

const Sheet = DialogPrimitive.Root
const SheetTrigger = DialogPrimitive.Trigger
const SheetClose = DialogPrimitive.Close

function SheetOverlay({ className, ...props }) {
  return (
    <DialogPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-navy/40 backdrop-blur-[2px] data-[state=open]:animate-[overlay-in_150ms_ease-out]",
        className
      )}
      {...props}
    />
  )
}

function SheetContent({ className, children, side = "right", ...props }) {
  const sideClass =
    side === "right"
      ? "inset-y-0 right-0 h-full w-full max-w-sm border-l border-navy/10 data-[state=open]:animate-[sheet-in-right_250ms_ease-out]"
      : "inset-y-0 left-0 h-full w-full max-w-sm border-r border-navy/10 data-[state=open]:animate-[sheet-in-left_250ms_ease-out]"

  return (
    <DialogPrimitive.Portal>
      <SheetOverlay />
      <DialogPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "fixed z-50 flex flex-col bg-paper shadow-xl outline-none",
          sideClass,
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

function SheetHeader({ className, ...props }) {
  return (
    <div
      className={cn("flex items-center justify-between border-b border-navy/10 px-5 py-4", className)}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }) {
  return (
    <DialogPrimitive.Title
      data-slot="sheet-title"
      className={cn("font-display text-lg font-semibold text-navy", className)}
      {...props}
    />
  )
}

function SheetDescription({ className, ...props }) {
  return (
    <DialogPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm text-navy/60", className)}
      {...props}
    />
  )
}

function SheetCloseButton({ className, ...props }) {
  return (
    <DialogPrimitive.Close
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-md font-mono text-lg leading-none text-navy/60 transition hover:bg-navy/5 hover:text-navy",
        className
      )}
      aria-label="Close filters"
      {...props}
    >
      &times;
    </DialogPrimitive.Close>
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetCloseButton,
}
