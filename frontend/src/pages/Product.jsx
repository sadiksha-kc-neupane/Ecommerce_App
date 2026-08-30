import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { toast } from "sonner"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import ProductCard from "../components/ProductCard.jsx"
import Breadcrumbs from "../components/ui/Breadcrumbs.jsx"
import QuantitySelector from "../components/ui/QuantitySelector.jsx"
import EmptyState from "../components/ui/EmptyState.jsx"
import Badge from "../components/ui/Badge.jsx"
import Price from "../components/ui/Price.jsx"
import SectionHeading from "../components/ui/SectionHeading.jsx"
import { buttonVariants } from "../components/ui/buttonVariants.js"
import { CATEGORY_COLORS, CATEGORY_LABELS } from "../lib/categories.js"
import { isLowStock } from "../lib/stock.js"
import {
  fetchSingleProduct,
  fetchProducts,
  addToCart,
} from "../lib/api.js"
import { useCart } from "../context/useCart.js"

function ProductDetailSkeleton() {
  return (
    <div className="mt-4 grid gap-8 md:grid-cols-2">
      <div>
        <div className="aspect-square overflow-hidden rounded-lg border border-navy/10 bg-white">
          <div className="h-full w-full animate-pulse bg-navy/10" />
        </div>
        <div className="mt-3 flex gap-2">
          <div className="h-16 w-16 animate-pulse rounded-md bg-navy/10" />
          <div className="h-16 w-16 animate-pulse rounded-md bg-navy/10" />
          <div className="h-16 w-16 animate-pulse rounded-md bg-navy/10" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="h-5 w-40 animate-pulse rounded-full bg-navy/10" />
        <div className="h-8 w-3/4 animate-pulse rounded-md bg-navy/10" />
        <div className="h-8 w-32 animate-pulse rounded-md bg-navy/10" />
        <div className="space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-navy/10" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-navy/10" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-navy/10" />
        </div>
        <div className="mt-4 flex gap-3">
          <div className="h-9 w-16 animate-pulse rounded-md bg-navy/10" />
          <div className="h-9 w-32 animate-pulse rounded-md bg-navy/10" />
        </div>
      </div>
    </div>
  )
}

export default function Product() {
  const { refreshCart } = useCart()
  const navigate = useNavigate()
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [activeImg, setActiveImg] = useState(0)
  const [busy, setBusy] = useState(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetchSingleProduct(id)
        if (cancelled) return
        const data = Array.isArray(res) ? res[0] : res?.data ?? res
        setError(data ? null : "Product not found")
        setProduct(data || null)
        setQuantity(1)
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

  // Related products: real items from the catalog sharing this product's
  // category (preferring its subcategory), excluding the current product.
  useEffect(() => {
    let cancelled = false
    fetchProducts()
      .then((res) => {
        if (!cancelled) setAllProducts(res.data || [])
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const stock = Number(product?.stock) || 0
  const outOfStock = stock <= 0 || product?.status === "out_of_stock" || product?.status === "discontinued"
  const lowStock = !outOfStock && isLowStock(product?.stock)
  const dotColor = CATEGORY_COLORS[product?.category] || "#1C1B19"
  const images = Array.isArray(product?.productImages)
    ? product.productImages.filter(Boolean)
    : []

  const stockBadge =
    outOfStock ? (
      <Badge tone="rust">Out of stock</Badge>
    ) : lowStock ? (
      <Badge tone="teal">Only {stock} left</Badge>
    ) : (
      <Badge tone="moss">{stock} in stock</Badge>
    )

  const details = useMemo(() => {
    if (!product) return []
    const rows = [
      ["Category", CATEGORY_LABELS[product.category] || product.category],
    ]
    if (product.subcategory) rows.push(["Subcategory", product.subcategory])
    rows.push([
      "Availability",
      outOfStock ? "Out of stock" : `${stock} in stock`,
    ])
    if (product.createdAt) {
      rows.push(["Listed", new Date(product.createdAt).toLocaleDateString()])
    }
    rows.push(["Product SKU", product.id])
    return rows
  }, [product, outOfStock, stock])

  const related = useMemo(() => {
    if (!product) return []
    const sameCat = allProducts.filter(
      (p) => p.id !== product.id && p.category === product.category
    )
    const sameSub = sameCat.filter((p) => p.subcategory === product.subcategory)
    const pool = sameSub.length >= 3 ? sameSub : sameCat
    return pool.slice(0, 4)
  }, [allProducts, product])

  function promptSignIn() {
    toast.error("Please sign in to check out", {
      action: { label: "Sign in", onClick: () => navigate("/signin") },
    })
  }

  function handleAuthError(err) {
    const msg = err.message || ""
    if (msg.toLowerCase().includes("token") || msg.includes("401") || msg.includes("403")) {
      promptSignIn()
    } else {
      toast.error(msg)
    }
  }

  async function handleAddToCart() {
    setBusy("add")
    try {
      await addToCart(product.id, quantity)
      refreshCart()
      toast.success(`${quantity} added to cart`)
    } catch (err) {
      handleAuthError(err)
    } finally {
      setBusy(null)
    }
  }

  async function handleBuyNow() {
    setBusy("buy")
    try {
      await addToCart(product.id, quantity)
      refreshCart()
      navigate("/checkout")
    } catch (err) {
      handleAuthError(err)
      setBusy(null)
    }
  }

  const breadcrumbs = [
    { label: "Home", to: "/" },
    { label: "Catalog", to: "/product-list" },
  ]
  if (product?.category) {
    breadcrumbs.push({
      label: CATEGORY_LABELS[product.category] || product.category,
      to: `/product-list?category=${encodeURIComponent(product.category)}`,
    })
    if (product.subcategory) {
      breadcrumbs.push({
        label: product.subcategory,
        to: `/product-list?category=${encodeURIComponent(product.category)}&subcategory=${encodeURIComponent(product.subcategory)}`,
      })
    }
  }
  if (product) breadcrumbs.push({ label: product.productName })

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <Breadcrumbs items={breadcrumbs} />

        {loading && (
          <>
            <div className="mt-4 h-4 w-40 animate-pulse rounded bg-navy/10" />
            <ProductDetailSkeleton />
          </>
        )}

        {!loading && error && (
          <EmptyState
            title="Product not found"
            body={error}
            className="mt-10 max-w-md"
            action={
              <Link to="/product-list" className={buttonVariants({ variant: "navy", size: "sm" })}>
                Back to catalog
              </Link>
            }
          />
        )}

        {!loading && product && (
          <>
            <div className="mt-4 grid gap-8 md:grid-cols-2">
              {/* Gallery */}
              <div className="flex flex-col gap-3">
                <div className="aspect-square overflow-hidden rounded-lg border border-navy/10 bg-white">
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
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[repeating-linear-gradient(45deg,#F7F3EC_0px,#F7F3EC_12px,#F0E9DC_12px,#F0E9DC_24px)]">
                      <span className="font-display text-6xl text-navy/25">
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
                        className={`h-16 w-16 overflow-hidden rounded-md border transition ${
                          i === activeImg
                            ? "border-ochre ring-2 ring-ochre/30"
                            : "border-navy/15 hover:border-ochre/60"
                        }`}
                      >
                        <img src={src} alt="" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-navy/50"
                  >
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: dotColor }}
                    />
                    {CATEGORY_LABELS[product.category] || product.category}
                  </span>
                  {product.subcategory && <Badge tone="neutral">{product.subcategory}</Badge>}
                  {stockBadge}
                </div>

                <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-navy">
                  {product.productName}
                </h1>

                <div className="mt-4">
                  <Price
                    value={product.price}
                    className="text-2xl font-semibold text-ochre-ink"
                  />
                </div>

                {product.description ? (
                  <p className="mt-4 text-sm leading-relaxed text-navy/70">{product.description}</p>
                ) : (
                  <p className="mt-4 text-sm leading-relaxed text-navy/60">No description available.</p>
                )}

                {/* Details (real data only) */}
                <div className="mt-6 rounded-lg border border-navy/10 bg-white p-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-navy/50">
                    Details
                  </p>
                  <dl className="mt-3 space-y-2">
                    {details.map(([k, v]) => (
                      <div key={k} className="flex items-start justify-between gap-4 border-b border-navy/5 pb-2 last:border-0 last:pb-0">
                        <dt className="font-mono text-[10px] uppercase tracking-wider text-navy/50">
                          {k}
                        </dt>
                        <dd className="text-right text-sm text-navy">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {/* CTA */}
                <div className="mt-6 flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-navy/60">
                      Quantity
                    </span>
                    <QuantitySelector
                      value={quantity}
                      onChange={setQuantity}
                      min={1}
                      max={outOfStock ? 1 : stock}
                      disabled={outOfStock}
                    />
                    {outOfStock && (
                      <span className="font-mono text-xs text-rust">
                        This item is not available.
                      </span>
                    )}
                  </div>

                  <div className="mt-1 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      disabled={outOfStock || busy === "add"}
                      className={buttonVariants({ variant: "primary", size: "lg" })}
                    >
                      {busy === "add" ? "Adding…" : "Add to cart"}
                    </button>
                    <button
                      type="button"
                      onClick={handleBuyNow}
                      disabled={outOfStock || busy === "buy"}
                      className={buttonVariants({ variant: "navy", size: "lg" })}
                    >
                      {busy === "buy" ? "Preparing…" : "Buy now"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Related products */}
            {related.length > 0 && (
              <section className="mt-16">
                <SectionHeading eyebrow="You may also like" title="Related products" />
                <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                  {related.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
