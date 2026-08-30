import { cn } from "../../lib/utils.js"

// Consistent warm empty-state panel. `title` is required; `body` and
// `action` (a React node, e.g. a <Link>) are optional.
export default function EmptyState({ title, body, action, className }) {
  return (
    <div
      className={cn(
        "mx-auto max-w-md rounded-lg border border-dashed border-navy/25 bg-white p-10 text-center",
        className
      )}
    >
      <p className="font-display text-base text-navy">{title}</p>
      {body && <p className="mt-2 text-sm text-navy/60">{body}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  )
}
