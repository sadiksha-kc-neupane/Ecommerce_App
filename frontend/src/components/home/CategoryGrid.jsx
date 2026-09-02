import { Link } from "react-router-dom"
import { ArrowRightIcon } from "@heroicons/react/24/outline"
import { CATEGORIES, CATEGORY_COLORS } from "../../lib/categories.js"
import SectionHeading from "../ui/SectionHeading.jsx"

// Main IT-hardware category tiles on the homepage. The display order follows
// the site's preferred category hierarchy (Smartboards first), but every tile
// is derived from the single source of truth in lib/categories.js — labels,
// colors and per-category product counts all come from existing data/config,
// nothing is duplicated here.
const DISPLAY_ORDER = [
  "smartboard",
  "laptop",
  "desktop",
  "components",
  "cctv",
  "printer_scanner",
  "networking",
]

const catByValue = Object.fromEntries(CATEGORIES.map((c) => [c.value, c]))

export default function CategoryGrid({ counts }) {
  const tiles = DISPLAY_ORDER
    .map((value) => catByValue[value])
    .filter(Boolean)
    .map((cat) => ({
      ...cat,
      color: CATEGORY_COLORS[cat.value] || "#1C1B19",
      count: counts?.[cat.value] ?? null,
    }))

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          title="The IT hardware you need"
          aside={
            <Link
              to="/product-list"
              className="hidden font-mono text-[10px] uppercase tracking-wider text-navy/50 transition hover:text-ochre-ink sm:block"
            >
              View all products &rarr;
            </Link>
          }
        />

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {tiles.map((cat) => (
            <Link
              key={cat.value}
              to={`/product-list?category=${encodeURIComponent(cat.value)}`}
              className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-navy/10 bg-paper/40 p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:border-ochre/50 hover:bg-white hover:shadow-lift"
            >
              <span
                aria-hidden="true"
                className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-10 transition group-hover:opacity-25"
                style={{ backgroundColor: cat.color }}
              />

              <div>
                <h3 className="font-display text-lg font-semibold leading-tight text-navy">
                  {cat.label}
                </h3>
                {cat.subcategories.length > 0 && (
                  <p className="mt-2 line-clamp-1 text-[11px] leading-relaxed text-navy/45">
                    {cat.subcategories.join(" · ")}
                  </p>
                )}
              </div>

              <span className="mt-4 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-ochre">
                Explore
                <ArrowRightIcon className="h-3 w-3 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
