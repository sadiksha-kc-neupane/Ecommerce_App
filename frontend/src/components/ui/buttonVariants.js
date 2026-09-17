import { cn } from "../../lib/utils.js"

// Shared button style factory (separate from <Button> so this module is not a
// component file — keeps react-refresh/only-export-components happy).
// - Use <Button> for native <button> elements.
// - Use buttonVariants() on <Link> / <a> / <button> to reuse the same styles.

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-mono text-xs uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:cursor-not-allowed disabled:bg-[#E2E8F0] disabled:text-[#64748B] disabled:border-transparent disabled:opacity-100"

const variants = {
  primary: "bg-[#FF7F50] px-6 py-3 text-white font-semibold hover:bg-[#E86C3E] shadow-xs",
  navy: "bg-[#0F766E] px-6 py-3 text-white font-semibold hover:bg-[#0D655E] shadow-xs",
  outline: "border border-navy/25 px-4 py-2 text-navy hover:border-[#FF7F50] hover:text-[#FF7F50]",
  ghost: "px-3 py-2 text-navy hover:bg-navy/5 hover:text-[#FF7F50]",
  danger: "border border-rust/40 px-4 py-2 text-rust hover:bg-rust hover:text-white",
}

const sizes = {
  sm: "px-3 py-1.5 text-[10px]",
  md: "px-5 py-2.5 text-xs",
  lg: "px-7 py-3 text-[11px]",
}

export function buttonVariants({ variant = "primary", size = "md" } = {}) {
  return cn(base, variants[variant] || variants.primary, sizes[size] || sizes.md)
}
