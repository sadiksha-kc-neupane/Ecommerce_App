import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { toast } from "sonner"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import { CATEGORY_COLORS, CATEGORY_LABELS } from "../lib/categories.js"
import { isLowStock } from "../lib/stock.js"
import { fetchSingleProduct, addToCart } from "../lib/api.js"
import { useCart } from "../context/CartContext.jsx"

export default function Product() {
  const { refreshCart } = useCart()
  const navigate = useNavigate()
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [activeImg, setActiveImg] = useState(0)
  const reduceMotion = useReducedMotion()

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
        setActiveImg(0)
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

  function showToast(message) {
    toast.error(message)
  }

  async function handleAddToCart() {
    try {
      await addToCart(product.id, quantity)
      refreshCart()
      toast.success("Added to cart")
    } catch (err) {
      if (err.message.toLowerCase().includes("token") || err.message.includes("401")) {
        toast.error("Please sign in to add items to your cart", {
          action: { label: "Sign in", onClick: () => navigate("/signin") },
        })
      } else {
        showToast(err.message)
      }
    }
  }

  const stock = Number(product?.stock) || 0
  const outOfStock = stock <= 0 || product?.status === "out_of_stock"
  const lowStock = !outOfStock && isLowStock(product?.stock)
  const dotColor = CATEGORY_COLORS[product?.category] || "#1C1B19"
  const images = Array.isArray(product?.productImages)
    ? product.productImages.filter(Boolean)
    : []

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
            <div className="flex flex-col gap-3">
              <div className="aspect-square overflow-hidden rounded-md bg-cream outline outline-1 -outline-offset-1 outline-navy/15">
                {images.length > 0 ? (
                  <motion.img
                    key={activeImg}
                    initial={reduceMotion ? false : { opacity: 0.35 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    src={images[activeImg]}
                    alt={product.productName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[repeating-linear-gradient(45deg,#F2EEE4_0px,#F2EEE4_12px,#EDE7DA_12px,#EDE7DA_24px)]">
                    <span
                      className="text-6xl text-navy/25 font-display"
                    >
                      {product.productName?.charAt(0).toUpperCase()}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-navy/35">
                      No photo yet
                    </span>
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveImg(i)}
                      aria-label={`View image ${i + 1}`}
                      aria-pressed={i === activeImg}
                      className={`h-16 w-16 overflow-hidden rounded-md outline outline-1 -outline-offset-1 transition ${
                        i === activeImg
                          ? "-outline-offset-2 outline-2 outline-ochre"
                          : "outline-navy/15 hover:outline-ochre/60"
                      }`}
                    >
                      <img
                        src={src}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-navy/50">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: dotColor }}
                />
                {CATEGORY_LABELS[product.category] || product.category}
                {product.subcategory && (
                  <span className="ml-1 rounded-full bg-paper px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-navy/60">
                    {product.subcategory}
                  </span>
                )}
                <span
                  className={`ml-2 rounded-full px-2 py-0.5 ${
                    outOfStock
                      ? "bg-rust/10 text-rust"
                      : lowStock
                        ? "bg-teal text-cream"
                        : "bg-moss/10 text-moss"
                  }`}
                >
                  {outOfStock
                    ? "Out of stock"
                    : lowStock
                      ? `Only ${stock} left`
                      : `${stock} in stock`}
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
    </div>
  )
}
