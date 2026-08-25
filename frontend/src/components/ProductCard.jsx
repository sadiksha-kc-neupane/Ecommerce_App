import { CATEGORY_COLORS } from "../lib/categories.js"

export default function ProductCard({ product, onAddToCart }) {
  const outOfStock = Number(product.stock) <= 0 || product.status === "out_of_stock"
  const dotColor = CATEGORY_COLORS[product.category] || "#14213D"

  return (
    <div className="group flex flex-col overflow-hidden rounded-md bg-cream outline outline-1 -outline-offset-1 outline-navy/15 transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_-16px_rgba(20,33,61,0.35)] hover:outline-ochre">
      <a href={`/product/${product.id}`} className="block overflow-hidden bg-paper">
        {product.productImage ? (
          <img
            src={product.productImage}
            alt={product.productName}
            className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-44"
            loading="lazy"
          />
        ) : (
          <div className="flex h-40 w-full flex-col items-center justify-center gap-1 bg-[repeating-linear-gradient(45deg,#F2EEE4_0px,#F2EEE4_12px,#EDE7DA_12px,#EDE7DA_24px)] sm:h-44">
            <span
              className="text-4xl text-navy/25 font-display"
            >
              {product.productName?.charAt(0).toUpperCase()}
            </span>
            <span className="font-mono text-[8px] uppercase tracking-widest text-navy/35">
              No photo yet
            </span>
          </div>
        )}
      </a>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-navy/50">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: dotColor }}
          />
          {product.category}
        </div>

        <h3
          className="text-sm leading-snug text-navy transition-colors group-hover:text-rust font-display"
        >
          {product.productName}
        </h3>

        <div className="mt-auto flex items-end justify-between pt-2">
          <span className="border border-dashed border-navy/25 px-1.5 py-0.5 font-mono text-sm font-semibold text-rust">
            ${product.price}
          </span>
          {onAddToCart ? (
            <button
              onClick={() => onAddToCart(product.id)}
              disabled={outOfStock}
              className="rounded-sm bg-navy px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-cream transition hover:bg-ochre hover:text-navy active:scale-95 disabled:cursor-not-allowed disabled:bg-navy/20 disabled:text-navy/40"
            >
              {outOfStock ? "Sold out" : "Add"}
            </button>
          ) : (
            <span
              className={`font-mono text-[9px] uppercase tracking-widest ${
                outOfStock ? "text-rust" : "text-moss"
              }`}
            >
              {outOfStock ? "Out of stock" : "In stock"}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
