import { cn } from "../../lib/utils.js"

// Reusable section heading used across Home, FeaturedRow, product-list etc.
// Renders an optional eyebrow (small mono run-in) above a Fraunces title,
// plus an optional right-aligned `aside` (e.g. a "View all" link or count).

export default function SectionHeading({
  eyebrow,
  title,
  aside,
  className,
  as: Tag = "h2",
}) {
  return (
    <div className={cn("flex items-end justify-between gap-4", className)}>
      <div>
        {eyebrow && (
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ochre-ink">{eyebrow}</p>
        )}
        <Tag className="mt-2 font-display text-2xl text-navy sm:text-3xl">{title}</Tag>
      </div>
      {aside && <div className="shrink-0">{aside}</div>}
    </div>
  )
}
