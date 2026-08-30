import { cn } from "../../lib/utils.js"

// Shared button style factory + <Button> component.
// - Use <Button> for native <button> elements.
// - Use buttonVariants() on <Link> / <a> / <button> to reuse the same styles.
// Variants keep the warm identity: primary = ochre accent, navy = dark surface,
// outline = quiet bordered, ghost = text-only, danger = distinct rust.

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-mono text-xs uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:cursor-not-allowed disabled:opacity-50"

const variants = {
  primary: "bg-ochre px-6 py-3 text-navy hover:bg-navy hover:text-cream",
  navy: "bg-navy px-6 py-3 text-cream hover:bg-ochre hover:text-navy",
  outline: "border border-navy/25 px-4 py-2 text-navy/80 hover:border-navy hover:text-navy",
  ghost: "px-3 py-2 text-navy/80 hover:bg-navy/5 hover:text-navy",
  danger: "border border-rust/40 px-4 py-2 text-rust hover:bg-rust hover:text-cream",
}

const sizes = {
  sm: "px-3 py-1.5 text-[10px]",
  md: "px-5 py-2.5 text-xs",
  lg: "px-7 py-3 text-[11px]",
}

export function buttonVariants({ variant = "primary", size = "md" } = {}) {
  return cn(base, variants[variant] || variants.primary, sizes[size] || sizes.md)
}

export default function Button({ variant = "primary", size = "md", className, ...props }) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
