// Single source of truth for catalog filtering + sorting logic on the
// product-list page. All filter/sort state is derived from URL search params,
// so the catalog survives back/forward navigation and is shareable without
// extra routing code.

import { CATEGORIES, CATEGORY_LABELS } from "./categories.js"

export const DEFAULT_SORT = "relevance"

// Quick "max price" budgets for the price filter. value 0 = no upper bound.
export const PRICE_BUDGETS = [
  { label: "Any price", value: 0 },
  { label: "Under $500", value: 500 },
  { label: "Under $1,000", value: 1000 },
  { label: "Under $2,000", value: 2000 },
  { label: "Under $5,000", value: 5000 },
]

export const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
]

// Read catalog state out of the current URL search params.
export function parseCatalog(searchParams) {
  const num = (v) => {
    const n = Number(v)
    return Number.isFinite(n) && n > 0 ? n : null
  }
  const category = searchParams.get("category") || ""
  const subcategory = searchParams.get("subcategory") || ""
  const query = searchParams.get("q") || ""
  const maxPrice = num(searchParams.get("maxPrice"))
  const inStockOnly = searchParams.get("inStock") === "1"
  const sort = searchParams.get("sort")
  return {
    category,
    subcategory,
    query,
    maxPrice,
    inStockOnly,
    sort: SORT_OPTIONS.some((o) => o.value === sort) ? sort : DEFAULT_SORT,
  }
}

// Turn catalog state into a params object safe to spread over the existing URL
// params. Keeping the original query (q) is handled by the caller (product-list
// mutates its copy), so we only encode the fields we own here.
export function catalogToParams(catalog) {
  const params = {}
  if (catalog.category) params.category = catalog.category
  else params.category = null
  if (catalog.subcategory) params.subcategory = catalog.subcategory
  else params.subcategory = null
  if (catalog.maxPrice) params.maxPrice = String(catalog.maxPrice)
  else params.maxPrice = null
  if (catalog.inStockOnly) params.inStock = "1"
  else params.inStock = null
  if (catalog.sort && catalog.sort !== DEFAULT_SORT) params.sort = catalog.sort
  else params.sort = null
  return params
}

// How many non-default, non-query filters are currently active (for the
// mobile "Filters (N)" badge and the chips row).
export function activeFilterCount(catalog) {
  let count = 0
  if (catalog.category) count++
  if (catalog.subcategory) count++
  if (catalog.maxPrice) count++
  if (catalog.inStockOnly) count++
  return count
}

// Expand the current filters into a flat list of removable chips.
export function chipList(catalog) {
  const chips = []
  if (catalog.category) {
    chips.push({
      id: "category",
      label: `Category: ${CATEGORY_LABELS[catalog.category] || catalog.category}`,
      clear: { category: null, subcategory: null },
    })
  }
  if (catalog.subcategory) {
    chips.push({
      id: "subcategory",
      label: `Subcategory: ${catalog.subcategory}`,
      clear: { subcategory: null },
    })
  }
  if (catalog.maxPrice) {
    chips.push({
      id: "maxPrice",
      label: `Under $${Number(catalog.maxPrice).toLocaleString()}`,
      clear: { maxPrice: null },
    })
  }
  if (catalog.inStockOnly) {
    chips.push({ id: "inStock", label: "In stock only", clear: { inStock: null } })
  }
  return chips
}

// The set of keys that count as "filters" (used by the Clear all action).
export const filterKeys = ["category", "subcategory", "maxPrice", "inStockOnly"]

// Apply filters then sort. `products` is the full fetched list (already
// filtered by query text is NOT here — query is intentionally separate and
// applied in the same pass below via catalog.query).
export function applyCatalog(products, catalog) {
  const filtered = products.filter((p) => {
    if (catalog.category && p.category !== catalog.category) return false
    if (catalog.subcategory && p.subcategory !== catalog.subcategory) return false
    if (catalog.maxPrice && Number(p.price) > catalog.maxPrice) return false
    if (catalog.inStockOnly && (Number(p.stock) <= 0 || p.status === "out_of_stock" || p.status === "discontinued")) {
      return false
    }
    if (catalog.query) {
      const name = String(p.productName || "").toLowerCase()
      if (!name.includes(catalog.query.toLowerCase())) return false
    }
    return true
  })

  const list = [...filtered]
  switch (catalog.sort) {
    case "price_asc":
      list.sort((a, b) => Number(a.price) - Number(b.price))
      break
    case "price_desc":
      list.sort((a, b) => Number(b.price) - Number(a.price))
      break
    case "newest":
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      break
    default:
      // relevance = keep the backend's default ordering
      break
  }
  return list
}

// Subcategories belonging to the currently active category (for the sidebar),
// or [] when no category is selected (nothing to scope to).
export function subcategoriesFor(catalog) {
  if (!catalog.category) return []
  const cat = CATEGORIES.find((c) => c.value === catalog.category)
  return cat ? cat.subcategories : []
}

// Upper bound used to seed the max-price control; rounds up to a clean number.
export function priceCeiling(products) {
  let max = 0
  for (const p of products) {
    const n = Number(p.price)
    if (Number.isFinite(n) && n > max) max = n
  }
  if (max <= 0) return 0
  const magnitude = Math.pow(10, Math.floor(Math.log10(max)))
  return Math.ceil(max / magnitude) * magnitude
}
