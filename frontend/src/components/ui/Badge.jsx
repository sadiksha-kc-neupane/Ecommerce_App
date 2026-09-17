import { cn } from "../../lib/utils.js"

// Small status/pill badge for stock, order status and other short labels.
// `tone` maps to the warm palette; text-color is chosen to stay readable on
// the light translucent backgrounds.

const tones = {
  moss: "bg-moss/15 text-moss",
  teal: "bg-teal/15 text-teal",
  ochre: "bg-coral/15 text-[#D45627]",
  coral: "bg-coral/15 text-[#D45627]",
  navy: "bg-teal/10 text-teal",
  rust: "bg-rust/15 text-rust",
  neutral: "bg-[#E2E8F0] text-[#64748B]",
  solidNavy: "bg-teal text-white",
  solidTeal: "bg-teal text-white",
  solidCoral: "bg-coral text-white",
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
