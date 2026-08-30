import { Link } from "react-router-dom"

// Functional breadcrumb trail. `items` is [{ label, to? }] — items with a
// `to` render as links, the last (or link-less) item renders as plain text.
export default function Breadcrumbs({ items, className }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-navy/50">
        {items.map((item, i) => {
          const isLast = i === items.length - 1 && !!item.to !== true
          const separator = i > 0 && (
            <span aria-hidden="true" className="text-navy/35">/</span>
          )
          return (
            <li key={i} className="flex items-center gap-1.5">
              {separator}
              {item.to && !isLast ? (
                <Link to={item.to} className="transition hover:text-ochre-ink">
                  {item.label}
                </Link>
              ) : (
                <span className="text-navy/70">{item.label}</span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
