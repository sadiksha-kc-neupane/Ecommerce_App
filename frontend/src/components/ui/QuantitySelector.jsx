import { cn } from "../../lib/utils.js"

// Reusable, touch-friendly quantity stepper. Controlled via `value`/`onChange`.
// Never lets the value drop below `min` (default 1) or rise above `max`
// (defaults to "no upper bound" = Infinity). Disables +/- at the bounds.
export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = Infinity,
  disabled = false,
  size = "md",
  className,
}) {
  const atMin = value <= min
  const atMax = value >= max

  const btn =
    "flex items-center justify-center rounded-md font-mono text-lg leading-none text-navy transition select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ochre disabled:cursor-not-allowed disabled:text-navy/25"
  const box = size === "sm" ? "h-9 w-9" : "h-11 w-11"
  const self = size === "sm" ? "h-11 gap-0.5 p-0.5" : "h-12 gap-1 p-1"

  function step(delta) {
    const next = value + delta
    if (next < min) return
    if (next > max) return
    onChange(next)
  }

  return (
    <div
      className={cn(
        "inline-flex items-center overflow-hidden rounded-md border border-navy/20 bg-white",
        self,
        disabled && "opacity-60",
        className
      )}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => step(-1)}
        disabled={disabled || atMin}
        className={cn(btn, box, "hover:bg-navy/5 active:scale-95")}
      >
        &minus;
      </button>
      <span
        aria-live="polite"
        className={cn("min-w-10 text-center font-mono text-sm font-semibold tabular-nums text-navy", box, "px-0 text-base")}
      >
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => step(1)}
        disabled={disabled || atMax}
        className={cn(btn, box, "hover:bg-navy/5 active:scale-95")}
      >
        +
      </button>
    </div>
  )
}
