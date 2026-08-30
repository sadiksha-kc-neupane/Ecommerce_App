import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import ProductGrid from "../components/ProductGrid.jsx"
import EmptyState from "../components/ui/EmptyState.jsx"
import SectionHeading from "../components/ui/SectionHeading.jsx"
import CatalogSidebar from "../components/catalog/CatalogSidebar.jsx"
import ActiveFilterChips from "../components/catalog/ActiveFilterChips.jsx"
import SortSelect from "../components/catalog/SortSelect.jsx"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetCloseButton,
} from "../components/ui/Sheet.jsx"
import { fetchProducts } from "../lib/api.js"
import { CATEGORY_LABELS } from "../lib/categories.js"
import {
  parseCatalog,
  applyCatalog,
  catalogToParams,
  activeFilterCount,
  filterKeys,
} from "../lib/catalog.js"

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const catalog = parseCatalog(searchParams)

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    fetchProducts()
      .then((res) => setProducts(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const visibleProducts = applyCatalog(products, catalog)
  const filterCount = activeFilterCount(catalog)
  const anyFilter = filterCount > 0
  const resultLabel = `${visibleProducts.length} ${visibleProducts.length === 1 ? "item" : "items"}`

  // Merge a patch into the current URL-driven catalog state. Preserves the
  // search query (q) — it is owned by the navbar and not part of the filters.
  function applyFilters(patch) {
    const next = { ...catalog, ...patch }
    const params = new URLSearchParams(searchParams)
    const encoded = catalogToParams(next)
    Object.entries(encoded).forEach(([key, value]) => {
      if (value) params.set(key, value)
      else params.delete(key)
    })
    setSearchParams(params, { replace: false })
  }

  function clearFilters() {
    const params = new URLSearchParams(searchParams)
    filterKeys.forEach((key) => params.delete(key))
    params.delete("sort")
    params.delete("subcategory")
    params.delete("maxPrice")
    params.delete("inStock")
    setSearchParams(params)
    setDrawerOpen(false)
  }

  function clearAll(opts = {}) {
    const params = new URLSearchParams(searchParams)
    filterKeys.forEach((key) => params.delete(key))
    params.delete("sort")
    params.delete("subcategory")
    params.delete("maxPrice")
    params.delete("inStock")
    if (opts.includeQuery) params.delete("q")
    setSearchParams(params)
    setDrawerOpen(false)
  }

  const heading = catalog.query
    ? `Results for \u201c${catalog.query}\u201d`
    : catalog.category
      ? CATEGORY_LABELS[catalog.category] || "Category"
      : "Browse everything"

  const subtitle = catalog.query
    ? catalog.category
      ? `in ${CATEGORY_LABELS[catalog.category]}`
      : "across the full catalog"
    : catalog.subcategory
      ? `${catalog.subcategory} · ${CATEGORY_LABELS[catalog.category]}`
      : catalog.category
        ? "All hardware, one shelf"
        : "The complete IT hardware catalog"

  const emptyNode =
    !loading && !error && visibleProducts.length === 0 ? (
      <EmptyState
        title="No products found"
        body={
          anyFilter || catalog.query
            ? "Try removing a filter or widening your search."
            : "The catalog is empty right now."
        }
        action={
          anyFilter || catalog.query ? (
            <button
              type="button"
              onClick={() => clearAll({ includeQuery: true })}
              className="rounded-md border border-navy/25 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-navy/80 transition hover:border-ochre hover:bg-ochre/10 hover:text-ochre-ink"
            >
              Clear all filters
            </button>
          ) : undefined
        }
      />
    ) : (
      <></>
    )

  const sidebar = <CatalogSidebar catalog={catalog} onFilter={applyFilters} />

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-6">
          <SectionHeading eyebrow="Catalog" title={heading} />
          <p className="mt-2 font-mono text-sm text-navy/60">{subtitle}</p>
        </header>

        {/* Active filter chips */}
        <ActiveFilterChips
          catalog={catalog}
          onApply={applyFilters}
          onClearAll={clearFilters}
        />

        {/* Results toolbar: count, mobile filter button, sort */}
        <div className="mt-6 mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm text-navy/60">{loading ? "Loading…" : resultLabel}</span>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="inline-flex items-center gap-2 rounded-md border border-navy/20 bg-white px-3.5 py-2 font-mono text-[10px] uppercase tracking-widest text-navy/80 transition hover:border-navy hover:text-navy lg:hidden"
            >
              Filters
              {anyFilter && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-ochre px-1 text-[9px] text-navy">
                  {filterCount}
                </span>
              )}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden font-mono text-[10px] uppercase tracking-widest text-navy/50 sm:block">
              Sort
            </span>
            <SortSelect value={catalog.sort} onChange={(v) => applyFilters({ sort: v })} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-lg border border-navy/10 bg-white p-5">
              <p className="mb-4 font-display text-base font-semibold text-navy">Filters</p>
              {sidebar}
            </div>
          </aside>

          {/* Results */}
          <section>
            <ProductGrid
              products={visibleProducts}
              loading={loading}
              error={error}
              empty={emptyNode}
              gridClassName="grid grid-cols-2 gap-4 md:grid-cols-3"
            />
          </section>
        </div>
      </main>

      <Footer />

      {/* Mobile filter drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent>
          <SheetHeader>
            <div>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription className="mt-0.5">{resultLabel}</SheetDescription>
            </div>
            <SheetCloseButton />
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-5 py-5">{sidebar}</div>

          <div className="border-t border-navy/10 p-4">
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="w-full rounded-md bg-navy px-4 py-3 font-mono text-[11px] uppercase tracking-widest text-cream transition hover:bg-ochre hover:text-navy"
            >
              Show {resultLabel}
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
