import { useState } from "react"
import { CATEGORIES } from "../../lib/categories.js"
import { PRICE_BUDGETS } from "../../lib/catalog.js"
import { cn } from "../../lib/utils.js"

// Shared filter panel used in two places without duplicating logic:
//   1. The desktop sidebar (rendered statically, sticky)
//   2. Inside the mobile Sheet drawer
// All state flows through `catalog` + `onFilter` patches, so this component is
// URL-agnostic and always reflects the single source of filter state.

function GroupLabel({ children }) {
  return (
    <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-navy/50">
      {children}
    </p>
  )
}

export default function CatalogSidebar({ catalog, onFilter }) {
  const [customMax, setCustomMax] = useState("")

  function setCategory(value) {
    // Changing category resets subcategory (it may not belong to the new one).
    onFilter({ category: value || null, subcategory: null })
  }

  function clearAll() {
    onFilter({
      category: null,
      subcategory: null,
      maxPrice: null,
      inStockOnly: false,
    })
    setCustomMax("")
  }

  function applyCustomMax() {
    const n = Number(customMax)
    if (Number.isFinite(n) && n > 0) {
      onFilter({ maxPrice: Math.round(n) })
    }
  }

  return (
    <div>
      {/* Category */}
      <section>
        <GroupLabel>Category</GroupLabel>
        <ul className="space-y-0.5">
          <li>
            <button
              type="button"
              onClick={() => setCategory("")}
              className={cn(
                "w-full rounded-md px-3 py-2 text-left text-sm transition",
                !catalog.category
                  ? "bg-ochre font-medium text-navy"
                  : "text-navy/75 hover:bg-navy/5 hover:text-navy"
              )}
            >
              All products
            </button>
          </li>
          {CATEGORIES.map((cat) => {
            const isActive = catalog.category === cat.value
            const showSubs = isActive && cat.subcategories.length > 0
            return (
              <li key={cat.value}>
                <button
                  type="button"
                  onClick={() => setCategory(isActive && !catalog.subcategory ? "" : cat.value)}
                  className={cn(
                    "w-full rounded-md px-3 py-2 text-left text-sm transition",
                    isActive
                      ? "bg-ochre font-medium text-navy"
                      : "text-navy/80 hover:bg-navy/5 hover:text-navy"
                  )}
                >
                  {cat.label}
                </button>
                {showSubs && (
                  <ul className="ml-3 mt-0.5 space-y-0.5 border-l border-navy/10 pl-2">
                    {cat.subcategories.map((sub) => (
                      <li key={sub}>
                        <button
                          type="button"
                          onClick={() =>
                            onFilter({
                              subcategory: catalog.subcategory === sub ? null : sub,
                            })
                          }
                          className={cn(
                            "w-full rounded-md px-2 py-1.5 text-left text-xs transition",
                            catalog.subcategory === sub
                              ? "bg-navy text-cream"
                              : "text-navy/60 hover:text-navy"
                          )}
                        >
                          {sub}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </section>

      {/* Price */}
      <section className="mt-7">
        <GroupLabel>Price</GroupLabel>
        <div className="flex flex-wrap gap-2">
          {PRICE_BUDGETS.map((budget) => {
            const active = catalog.maxPrice
              ? catalog.maxPrice === budget.value
              : budget.value === 0
            return (
              <button
                key={budget.value}
                type="button"
                onClick={() => onFilter({ maxPrice: budget.value ? budget.value : null })}
                className={cn(
                  "rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition",
                  active
                    ? "border-navy bg-navy text-cream"
                    : "border-navy/20 text-navy/70 hover:border-navy/50 hover:text-navy"
                )}
              >
                {budget.label}
              </button>
            )
          })}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <label htmlFor="catalog-custom-max" className="font-mono text-[10px] uppercase tracking-wider text-navy/50">
            Custom max
          </label>
          <input
            id="catalog-custom-max"
            type="number"
            min="1"
            step="any"
            value={customMax}
            onChange={(e) => setCustomMax(e.target.value)}
            onBlur={applyCustomMax}
            onKeyDown={(e) => {
              if (e.key === "Enter") applyCustomMax()
            }}
            placeholder="Amount"
            className="w-28 rounded-md border border-navy/20 bg-white px-3 py-1.5 font-mono text-xs text-navy outline-none transition focus:border-ochre focus:ring-2 focus:ring-ochre/25"
          />
        </div>
      </section>

      {/* Stock */}
      <section className="mt-7">
        <GroupLabel>Availability</GroupLabel>
        <label className="flex cursor-pointer items-center gap-3 rounded-md border border-navy/15 bg-white px-3 py-2.5 transition hover:border-navy/30">
          <input
            type="checkbox"
            checked={catalog.inStockOnly}
            onChange={(e) => onFilter({ inStockOnly: e.target.checked })}
            className="h-4 w-4 rounded border-navy/30 accent-ochre"
          />
          <span className="text-sm text-navy/80">In stock only</span>
        </label>
      </section>

      {/* Clear all */}
      <section className="mt-7 border-t border-navy/10 pt-5">
        <button
          type="button"
          onClick={clearAll}
          className="w-full rounded-md border border-navy/20 px-3 py-2.5 font-mono text-[10px] uppercase tracking-widest text-navy/70 transition hover:border-ochre hover:bg-ochre/10 hover:text-ochre-ink"
        >
          Clear all filters
        </button>
      </section>
    </div>
  )
}
