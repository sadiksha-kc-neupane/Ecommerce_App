import { CATEGORY_COLORS } from "../lib/categories.js"

export default function ProductCard({ product, onAddToCart }) {
  const outOfStock = Number(product.stock) <= 0 || product.status === "out_of_stock"
  const dotColor = CATEGORY_COLORS[product.category] || "#14213D"

  return (
    <div className="flex flex-col rounded-md bg-[#FBF7F0] outline outline-1 -outline-offset-1 outline-[#14213D]/15 transition hover:outline-[#E8A33D]">
      <a href={`/product/${product.id}`} className="block overflow-hidden rounded-t-md bg-[#F2EEE4]">
        <img
          src={product.productImage || "https://placehold.co/400x300/F2EEE4/14213D?text=Bazario"}
          alt={product.productName}
          className="h-40 w-full object-cover"
          loading="lazy"
        />
      </a>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-[#14213D]/50">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: dotColor }}
          />
          {product.category}
        </div>

        <h3 className="text-sm leading-snug text-[#14213D]">
          {product.productName}
        </h3>

        <div className="mt-auto flex items-end justify-between pt-2">
          <span className="font-mono text-base font-semibold text-[#E8A33D]">
            ${product.price}
          </span>
          {onAddToCart ? (
            <button
              onClick={() => onAddToCart(product.id)}
              disabled={outOfStock}
              className="rounded-sm bg-[#14213D] px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-[#FBF7F0] transition hover:bg-[#E8A33D] hover:text-[#14213D] disabled:cursor-not-allowed disabled:bg-[#14213D]/20 disabled:text-[#14213D]/40"
            >
              {outOfStock ? "Sold out" : "Add"}
            </button>
          ) : (
            <span
              className={`font-mono text-[9px] uppercase tracking-widest ${
                outOfStock ? "text-[#B33F2E]" : "text-[#4F6F52]"
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
