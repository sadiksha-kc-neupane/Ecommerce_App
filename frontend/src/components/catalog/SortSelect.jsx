import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select.jsx"
import { SORT_OPTIONS, DEFAULT_SORT } from "../../lib/catalog.js"

// Compact sort control for the catalog. `value`/`onChange` keep it controlled
// so the URL stays the single source of truth.

export default function SortSelect({ value, onChange }) {
  return (
    <Select value={value || DEFAULT_SORT} onValueChange={onChange}>
      <SelectTrigger
        aria-label="Sort products"
        className="h-10 w-auto min-w-[10.5rem] border-navy/20 bg-white text-xs text-navy"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end" sideOffset={6}>
        {SORT_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
