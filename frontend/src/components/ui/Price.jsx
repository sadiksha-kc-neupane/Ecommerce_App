import { cn } from "../../lib/utils.js"
import { formatCurrency } from "../../lib/currency.js"

// Consistent price display. Renders an NPR formatted amount from a numeric/string
// value with Rs. prefix and Nepali lakh digit grouping. Pass `className` to control typography.
export default function Price({ value, className, prefix }) {
  const display =
    prefix !== undefined
      ? `${prefix}${Number(value || 0).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : formatCurrency(value)

  return <span className={cn("font-mono tabular-nums", className)}>{display}</span>
}
