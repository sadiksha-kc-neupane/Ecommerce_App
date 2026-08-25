import { CATEGORY_COLORS } from "../lib/categories.js"

// Matches the Product model's category ENUM exactly:
// electronics | materials | agriculture | cosmetics
const CATEGORIES = ["all", "electronics", "materials", "agriculture", "cosmetics"]

export default function CategoryFilter({ activeCategory, onChange }) {
  return (
    <div className="px-6 pt-14">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-navy/50">
          Browse by category
        </p>

        <div className="mt-4 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-widest">
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat
            const dotColor = CATEGORY_COLORS[cat]
            return (
              <button
                key={cat}
                onClick={() => onChange(cat)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 transition duration-200 ${
                  active
                    ? "border-navy bg-navy text-cream"
                    : "border-navy/25 bg-transparent text-navy/60 hover:-translate-y-0.5 hover:border-navy hover:text-navy"
                }`}
              >
                <span
                  className={`inline-block h-2 w-2 rounded-full ${
                    cat === "all" && !active
                      ? "border border-navy/50"
                      : ""
                  }`}
                  style={
                    cat !== "all"
                      ? {
                          backgroundColor: active ? "#E8A33D" : dotColor,
                        }
                      : undefined
                  }
                />
                {cat}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
