import { Link } from "react-router-dom"
import { CATEGORY_COLORS } from "../lib/categories.js"

// "Featured" = first products returned by the existing fetch (most recent
// first per the backend's ordering). No featured flag exists on the model,
// so this is the agreed substitute.
export default function FeaturedRow({ products, onAddToCart }) {
  if (!products?.length) return null

  const featured = products.slice(0, 8)

  return (
    <section className="animate-fade-up mt-16">
      <div className="mx-auto flex max-w-6xl items-end justify-between gap-4 px-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ochre-ink">
            Fresh on the shelf
          </p>
          <h2
            className="mt-2 text-2xl text-navy sm:text-3xl font-display"
          >
            This week&apos;s picks
          </h2>
        </div>
        <Link
          to="/product-list"
          className="hidden font-mono text-[10px] uppercase tracking-widest text-navy/50 transition hover:text-ochre-ink sm:block"
        >
          View all &rarr;
        </Link>
      </div>

      <div className="scroll-slim mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-3">
        {featured.map((product) => {
          const outOfStock =
            Number(product.stock) <= 0 || product.status === "out_of_stock"
          const dotColor = CATEGORY_COLORS[product.category] || "#14213D"

          return (
            <article
              key={product.id}
              className="group w-64 flex-shrink-0 snap-start overflow-hidden rounded-md bg-cream outline outline-1 -outline-offset-1 outline-navy/15 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(20,33,61,0.35)] hover:outline-ochre sm:w-72"
            >
              <Link to={`/product/${product.id}`} className="block">
                <div className="relative h-48 overflow-hidden bg-paper">
                  {product.productImage ? (
                    <img
                      src={product.productImage}
                      alt={product.productName}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-[repeating-linear-gradient(45deg,#F2EEE4_0px,#F2EEE4_12px,#EDE7DA_12px,#EDE7DA_24px)]">
                      <span
                        className="text-5xl text-navy/25 font-display"
                      >
                        {product.productName?.charAt(0).toUpperCase()}
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-widest text-navy/35">
                        No photo yet
                      </span>
                    </div>
                  )}
                  {/* shelf-tag price chip */}
                  <span className="absolute bottom-3 left-3 border border-dashed border-navy/30 bg-cream px-2.5 py-1 font-mono text-xs font-semibold text-rust">
                    ${product.price}
                  </span>
                </div>
              </Link>

              <div className="flex flex-col gap-1.5 p-4">
                <p className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-navy/50">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: dotColor }}
                  />
                  {product.category}
                </p>
                <Link to={`/product/${product.id}`}>
                  <h3
                    className="text-lg leading-snug text-navy transition-colors group-hover:text-rust font-display"
                  >
                    {product.productName}
                  </h3>
                </Link>

                <div className="mt-2 flex items-center justify-between">
                  <span
                    className={`font-mono text-[9px] uppercase tracking-widest ${
                      outOfStock ? "text-rust" : "text-moss"
                    }`}
                  >
                    {outOfStock ? "Out of stock" : `${Number(product.stock)} in stock`}
                  </span>
                  {onAddToCart && (
                    <button
                      onClick={() => onAddToCart(product.id)}
                      disabled={outOfStock}
                      className="rounded-sm bg-navy px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-widest text-cream transition hover:bg-ochre hover:text-navy disabled:cursor-not-allowed disabled:bg-navy/20 disabled:text-navy/40"
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
