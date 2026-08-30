import { cn } from "../../lib/utils.js"

// Shared loading skeleton primitives using the warm palette.
// <Skeleton> is a single shimmering block; <SkeletonCard> is the placeholder
// used for product cards in grids/rows while data loads.

export function Skeleton({ className }) {
  return <div className={cn("animate-pulse rounded-md bg-navy/10", className)} />
}

export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-lg border border-navy/10 bg-white">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="flex flex-col gap-2 p-4">
        <Skeleton className="h-2 w-16 rounded-full" />
        <Skeleton className="h-3 w-3/4 rounded-full" />
        <div className="mt-2 flex items-center justify-between">
          <Skeleton className="h-4 w-1/3 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-md" />
        </div>
      </div>
    </div>
  )
}
