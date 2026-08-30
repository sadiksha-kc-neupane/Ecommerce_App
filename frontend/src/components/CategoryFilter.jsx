import { CATEGORIES, CATEGORY_COLORS } from "../lib/categories.js"

// Flat filter bar: "all" plus one chip per category. Only the value/label are
// used here (subcategories aren't relevant to filtering).
const FILTERS = [{ value: "all", label: "all" }, ...CATEGORIES]

export default function CategoryFilter({ activeCategory, onChange }) {
  return (
    <div className="px-6 pt-14">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-navy/50">
          Browse by category
        </p>

        <div className="mt-4 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-widest">
          {FILTERS.map(({ value, label }) => {
            const active = activeCategory === value
            const dotColor = CATEGORY_COLORS[value]
            return (
              <button
                key={value}
                onClick={() => onChange(value)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 transition duration-200 ${
                  active
                    ? "border-navy bg-navy text-cream"
                    : "border-navy/25 bg-transparent text-navy/60 hover:-translate-y-0.5 hover:border-navy hover:text-navy"
                }`}
              >
                <span
                  className={`inline-block h-2 w-2 rounded-full ${
                    value === "all" && !active
                      ? "border border-navy/50"
                      : ""
                  }`}
                  style={
                    value !== "all"
                      ? {
                          backgroundColor: active ? "#E85D4E" : dotColor,
                        }
                      : undefined
                  }
                />
                {label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
