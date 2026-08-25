import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import { CATEGORY_COLORS } from "../lib/categories.js"
import { fetchSingleProduct, addToCart } from "../lib/api.js"
import { useCart } from "../context/CartContext.jsx"

export default function Product() {
  const { refreshCart } = useCart()
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetchSingleProduct(id)
        if (cancelled) return
        // backend returns an array from findAll -- normalize to a single object
        const data = Array.isArray(res) ? res[0] : res?.data ?? res
        setError(data ? null : "Product not found")
        setProduct(data || null)
      } catch (err) {
        if (cancelled) return
        setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [id])

  function showToast(message, ms = 2500) {
    setToast(message)
    setTimeout(() => setToast(null), ms)
  }

  async function handleAddToCart() {
    try {
      await addToCart(product.id, quantity)
      refreshCart()
      showToast("Added to cart")
    } catch (err) {
      if (err.message.toLowerCase().includes("token") || err.message.includes("401")) {
        showToast("Please sign in to add items to your cart")
      } else {
        showToast(err.message)
      }
    }
  }

  const stock = Number(product?.stock) || 0
  const outOfStock = stock <= 0 || product?.status === "out_of_stock"
  const dotColor = CATEGORY_COLORS[product?.category] || "#14213D"

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />

      <main className="mx-auto max-w-4xl px-6 py-12">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-navy/50">
          <Link to="/product-list" className="transition hover:text-ochre-ink">
            Catalog
          </Link>{" "}
          / Detail
        </p>

        {loading && (
          <p className="mt-8 font-mono text-sm text-navy/50">Loading product...</p>
        )}

        {!loading && error && (
          <div className="mt-8 rounded-md bg-cream p-10 text-center outline outline-1 -outline-offset-1 outline-navy/15">
            <p className="font-mono text-sm text-rust">{error}</p>
            <Link
              to="/product-list"
              className="mt-4 inline-block rounded-sm bg-navy px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-cream transition hover:bg-ochre hover:text-navy"
            >
              Back to catalog
            </Link>
          </div>
        )}

        {!loading && product && (
          <div className="mt-6 grid gap-8 md:grid-cols-2">
            <div className="overflow-hidden rounded-md bg-cream outline outline-1 -outline-offset-1 outline-navy/15">
              <img
                src={product.productImage || "https://placehold.co/600x600/F2EEE4/14213D?text=Bazario"}
                alt={product.productName}
                className="h-full max-h-[480px] w-full object-cover"
              />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-navy/50">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: dotColor }}
                />
                {product.category}
                <span
                  className={`ml-2 rounded-full px-2 py-0.5 ${
                    outOfStock
                      ? "bg-rust/10 text-rust"
                      : "bg-moss/10 text-moss"
                  }`}
                >
                  {outOfStock ? "Out of stock" : `${stock} in stock`}
                </span>
              </div>

              <h1
                className="mt-3 text-3xl leading-tight text-navy font-display"
              >
                {product.productName}
              </h1>

              <p className="mt-4 font-mono text-2xl font-semibold text-ochre-ink">
                ${product.price}
              </p>

              <p className="mt-5 text-sm leading-relaxed text-navy/70">
                {product.description || "No description available."}
              </p>

              <div className="mt-auto pt-8">
                <label
                  htmlFor="quantity"
                  className="block font-mono text-[11px] uppercase tracking-widest text-navy/60"
                >
                  Quantity
                </label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex items-center rounded-md bg-cream outline outline-1 -outline-offset-1 outline-navy/15">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={outOfStock || quantity <= 1}
                      className="px-3 py-2 font-mono text-sm text-navy disabled:text-navy/30"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-mono text-sm text-navy">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                      disabled={outOfStock || quantity >= stock}
                      className="px-3 py-2 font-mono text-sm text-navy disabled:text-navy/30"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={outOfStock}
                    className="flex-1 rounded-sm bg-ochre px-6 py-3 font-mono text-xs uppercase tracking-widest text-navy transition hover:bg-navy hover:text-cream disabled:cursor-not-allowed disabled:bg-navy/20 disabled:text-navy/40"
                  >
                    {outOfStock ? "Out of stock" : "Add to cart"}
                  </button>
                </div>
                <p className="min-h-[1rem] mt-2 font-mono text-xs text-rust">
                  {""}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-sm bg-navy px-5 py-3 font-mono text-xs uppercase tracking-widest text-cream shadow-lg">
          {toast}
          {toast.toLowerCase().includes("sign in") && (
            <Link to="/signin" className="text-ochre underline">
              Sign in
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
