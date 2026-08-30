import { cn } from "../../lib/utils.js"

// Consistent price display. Renders a dollar amount from a numeric/string
// value, defaulting to 2 decimal places. Pass `className` to control size.
export default function Price({ value, className, prefix = "$" }) {
  const amount = Number(value)
  const display = Number.isFinite(amount) ? amount.toFixed(2) : "0.00"
  return <span className={cn("font-mono tabular-nums", className)}>{prefix}{display}</span>
}
