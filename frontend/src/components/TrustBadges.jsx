import { ArrowRightIcon } from "@heroicons/react/24/outline"

const BADGES = [
  {
    label: "Secure checkout",
    subtext: "100% encrypted",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
        <rect x="4" y="10" width="16" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        <circle cx="12" cy="15" r="1.25" />
      </svg>
    ),
  },
  {
    label: "Fast delivery",
    subtext: "Direct to door",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
        <path d="M2 7h11v9H2z" />
        <path d="M13 10h4l3 3v3h-7" />
        <circle cx="6" cy="17.5" r="1.75" />
        <circle cx="16.5" cy="17.5" r="1.75" />
      </svg>
    ),
  },
  {
    label: "Easy returns",
    subtext: "Hassle-free guarantee",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
        <path d="M3 12a9 9 0 1 0 3-6.7" />
        <path d="M3 4v5h5" />
      </svg>
    ),
  },
]

export default function TrustBadges() {
  return (
    <div className="mx-auto max-w-5xl px-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {BADGES.map((b) => (
          <div
            key={b.label}
            className="group flex items-center justify-between gap-4 rounded-full border border-navy/10 bg-white px-5 py-3.5 shadow-card transition duration-200 hover:border-ochre/40 hover:shadow-lift"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-ochre/10 text-ochre transition duration-200 group-hover:bg-ochre group-hover:text-white">
                {b.icon}
              </span>
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-wider text-navy">
                  {b.label}
                </p>
                <p className="font-mono text-[10px] text-navy/45">
                  {b.subtext}
                </p>
              </div>
            </div>
            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-navy/5 text-navy/40 transition duration-200 group-hover:bg-ochre/15 group-hover:text-ochre-ink">
              <ArrowRightIcon
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
