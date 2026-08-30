import { cn } from "../../lib/utils.js"

// Small status/pill badge for stock, order status and other short labels.
// `tone` maps to the warm palette; text-color is chosen to stay readable on
// the light translucent backgrounds.

const tones = {
  moss: "bg-moss/15 text-moss",
  teal: "bg-teal/15 text-teal",
  ochre: "bg-ochre/20 text-ochre-ink",
  navy: "bg-navy/10 text-navy",
  rust: "bg-rust/15 text-rust",
  neutral: "bg-navy/5 text-navy/60",
  solidNavy: "bg-navy text-cream",
  solidTeal: "bg-teal text-cream",
}

export default function Badge({ tone = "neutral", className, children, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest",
        tones[tone] || tones.neutral,
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
