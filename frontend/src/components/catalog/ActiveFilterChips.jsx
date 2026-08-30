import { chipList } from "../../lib/catalog.js"

// Renders the active filters as removable chips. Removing a chip calls
// `onApply(patch)` so the URL (and therefore the grid) updates immediately.
// A "Clear all" action appears when more than one chip is present.

export default function ActiveFilterChips({ catalog, onApply, onClearAll }) {
  const chips = chipList(catalog)
  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.id}
          type="button"
          onClick={() => onApply(chip.clear)}
          className="group inline-flex items-center gap-2 rounded-full border border-ochre/40 bg-ochre/10 py-1 pl-3 pr-2 font-mono text-[10px] uppercase tracking-wider text-ochre-ink transition hover:border-ochre hover:bg-ochre/20"
          aria-label={`Remove ${chip.label} filter`}
        >
          {chip.label}
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-ochre/20 text-[11px] leading-none text-ochre-ink transition group-hover:bg-ochre group-hover:text-cream">
            &times;
          </span>
        </button>
      ))}

      {chips.length > 1 && (
        <button
          type="button"
          onClick={onClearAll}
          className="font-mono text-[10px] uppercase tracking-widest text-navy/50 underline-offset-2 transition hover:text-rust hover:underline"
        >
          Clear all
        </button>
      )}
    </div>
  )
}
