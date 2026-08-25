const BADGES = [
  {
    label: "Secure checkout",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
        <rect x="4" y="10" width="16" height="10" rx="1.5" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        <circle cx="12" cy="15" r="1.25" />
      </svg>
    ),
  },
  {
    label: "Fast delivery",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
        <path d="M2 7h11v9H2z" />
        <path d="M13 10h4l3 3v3h-7" />
        <circle cx="6" cy="17.5" r="1.75" />
        <circle cx="16.5" cy="17.5" r="1.75" />
      </svg>
    ),
  },
  {
    label: "Easy returns",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
        <path d="M3 12a9 9 0 1 0 3-6.7" />
        <path d="M3 4v5h5" />
      </svg>
    ),
  },
]

export default function TrustBadges() {
  return (
    <div className="mx-auto max-w-4xl px-6">
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 rounded-md bg-navy/[0.04] px-8 py-6 outline outline-1 -outline-offset-1 outline-navy/10 sm:flex-nowrap sm:justify-between">
        {BADGES.map((b, i) => (
          <span
            key={b.label}
            className={`flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-widest text-navy/60 ${
              i > 0 ? "sm:border-l sm:border-navy/15 sm:pl-10" : ""
            }`}
          >
            <span className="text-ochre">{b.icon}</span>
            {b.label}
          </span>
        ))}
      </div>
    </div>
  )
}
