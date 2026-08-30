import { Link } from "react-router-dom"
import { CATEGORIES, CATEGORY_COLORS } from "../lib/categories.js"
import { ArrowRightIcon } from "@heroicons/react/24/outline"

// "Browse popular categories" — a tile grid that deep-links into the catalog
// filtered by each category (reference-site pattern).
export default function PopularCategories({ counts }) {
  const tiles = CATEGORIES.map((cat) => {
    const color = CATEGORY_COLORS[cat.value] || "#1C1B19"
    const count = counts?.[cat.value] ?? null
    return { ...cat, color, count }
  })

  return (
    <section className="bg-paper py-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ochre-ink">Shop smarter</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-navy sm:text-3xl">
            Browse popular categories
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {tiles.map((cat) => (
            <Link
              key={cat.value}
              to={`/product-list?category=${encodeURIComponent(cat.value)}`}
              className="group relative overflow-hidden rounded-xl border border-navy/10 bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:border-ochre/40 hover:shadow-lift"
            >
              <span
                className="absolute right-4 top-4 h-10 w-10 rounded-full opacity-15 transition group-hover:opacity-30"
                style={{ backgroundColor: cat.color }}
              />
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              <h3 className="mt-3 font-display text-lg font-semibold text-navy">
                {cat.label}
              </h3>
              <p className="mt-1 font-mono text-xs text-navy/50">
                {cat.count === null ? "Shop now" : `${cat.count} item${cat.count === 1 ? "" : "s"}`}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-ochre">
                Explore <ArrowRightIcon className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
