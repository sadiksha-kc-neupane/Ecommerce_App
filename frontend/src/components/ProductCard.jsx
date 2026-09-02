import { Link } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { CATEGORY_COLORS, CATEGORY_LABELS } from "../lib/categories.js"
import { isLowStock } from "../lib/stock.js"
import Price from "./ui/Price.jsx"

// Single reusable product card used in the catalog grid, the homepage
// featured row and search/category results. `onAddToCart` is optional:
// when omitted the card falls back to a "View details" link instead of an
// add-to-cart button.
export default function ProductCard({ product, onAddToCart }) {
  const reduceMotion = useReducedMotion()
  const outOfStock = Number(product.stock) <= 0 || product.status === "out_of_stock"
  const lowStock = !outOfStock && isLowStock(product.stock)
  const dotColor = CATEGORY_COLORS[product.category] || "#1C1B19"
  const productPath = `/product/${product.id}`
  const badge = outOfStock
    ? { label: "Out of stock", className: "bg-navy/75 text-cream" }
    : lowStock
      ? { label: `Only ${product.stock} left`, className: "bg-teal text-cream" }
      : { label: "In stock", className: "bg-white text-moss shadow-sm" }

  return (
    <motion.div
      whileHover={reduceMotion ? undefined : { y: -4 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className="group flex flex-col overflow-hidden rounded-lg border border-navy/10 bg-white shadow-card transition-[box-shadow,border-color] duration-300 hover:border-ochre/40 hover:shadow-lift will-change-transform"
    >
      <Link
        to={productPath}
        className="relative block overflow-hidden bg-paper"
        aria-label={product.productName}
      >
        {product.productImages?.[0] ? (
          <img
            src={product.productImages[0]}
            alt={product.productName}
            className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-1 bg-[repeating-linear-gradient(45deg,#F7F3EC_0px,#F7F3EC_12px,#F0E9DC_12px,#F0E9DC_24px)]">
            <span className="font-display text-4xl text-navy/25">
              {product.productName?.charAt(0).toUpperCase()}
            </span>
            <span className="font-mono text-[8px] uppercase tracking-wider text-navy/35">
              No photo yet
            </span>
          </div>
        )}

        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider ring-1 ring-white/40 ${badge.className}`}
        >
          {badge.label}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-navy/50">
          <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: dotColor }} />
          {CATEGORY_LABELS[product.category] || product.category}
        </p>

        <Link to={productPath}>
          <h3 className="line-clamp-2 font-display text-sm font-semibold leading-snug text-navy transition-colors group-hover:text-ochre">
            {product.productName}
          </h3>
        </Link>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
          <Price className="font-display text-base font-bold text-navy" value={product.price} />
          {onAddToCart ? (
            <button
              type="button"
              onClick={() => onAddToCart(product.id)}
              disabled={outOfStock}
              className="rounded-md bg-navy px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-cream transition hover:bg-ochre hover:text-navy active:scale-95 disabled:cursor-not-allowed disabled:bg-navy/15 disabled:text-navy/40"
            >
              {outOfStock ? "Sold out" : "Add to cart"}
            </button>
          ) : (
            <Link
              to={productPath}
              className="rounded-md border border-navy/20 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-navy transition hover:border-ochre hover:text-ochre"
            >
              View details
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )
}
