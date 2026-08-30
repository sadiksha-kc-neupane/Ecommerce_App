import { useEffect, useState } from "react"
import { Link, Navigate } from "react-router-dom"
import { toast } from "sonner"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import QuantitySelector from "../components/ui/QuantitySelector.jsx"
import OrderSummary, { LineImage } from "../components/cart/OrderSummary.jsx"
import EmptyState from "../components/ui/EmptyState.jsx"
import { buttonVariants } from "../components/ui/Button.jsx"
import { cn } from "../lib/utils.js"
import { fetchCart, removeFromCart, updateCartItem } from "../lib/api.js"
import { toLine } from "../lib/cart.js"
import { useCart } from "../context/CartContext.jsx"

export default function Cart() {
  const { refreshCart } = useCart()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [busyId, setBusyId] = useState(null)
  const [removingId, setRemovingId] = useState(null)

  const isLoggedIn = Boolean(localStorage.getItem("token"))

  useEffect(() => {
    if (!isLoggedIn) return
    let cancelled = false
    async function load() {
      try {
        const res = await fetchCart()
        if (!cancelled) setItems((res.cart?.CartItems || []).map(toLine))
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [isLoggedIn])

  async function handleRemove(id) {
    setError(null)
    setRemovingId(id)
    try {
      await removeFromCart(id)
      setItems((prev) => prev.filter((it) => it.id !== id))
      refreshCart()
      toast.success("Removed from cart")
    } catch (err) {
      toast.error(err.message)
    } finally {
      setRemovingId(null)
    }
  }

  async function handleQty(id, next) {
    setError(null)
    setBusyId(id)
    try {
      await updateCartItem(id, next)
      setItems((prev) => prev.map((it) => (it.id === id ? { ...it, quantity: next } : it)))
      refreshCart()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-navy/50">
          Your basket
        </p>
        <h1 className="mt-1 mb-8 font-display text-3xl font-bold text-navy">
          Shopping cart
        </h1>

        {!isLoggedIn && <Navigate to="/signin" replace />}

        {isLoggedIn && loading && (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex animate-pulse gap-4 rounded-lg border border-navy/10 bg-white p-4">
                  <div className="h-20 w-20 rounded-md bg-navy/10" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 w-1/2 rounded bg-navy/10" />
                    <div className="h-3 w-2/3 rounded bg-navy/10" />
                  </div>
                </div>
              ))}
            </div>
            <div className="h-40 rounded-lg border border-navy/10 bg-white p-5">
              <div className="h-10 w-1/2 animate-pulse rounded bg-navy/10" />
            </div>
          </div>
        )}

        {isLoggedIn && !loading && error && (
          <EmptyState title="Couldn't load your cart" body={error} className="max-w-md" />
        )}

        {isLoggedIn && !loading && !error && items.length === 0 && (
          <EmptyState
            title="Your cart is empty"
            body="Browse the catalog and add something to your basket."
            className="max-w-md"
            action={
              <Link to="/product-list" className={buttonVariants({ variant: "primary", size: "md" })}>
                Continue shopping
              </Link>
            }
          />
        )}

        {isLoggedIn && !loading && !error && items.length > 0 && (
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            {/* Item rows */}
            <ul className="flex flex-col gap-4">
              {items.map((item) => {
                const maxQty = Math.max(item.quantity, item.stock)
                return (
                  <li
                    key={item.id}
                    className="rounded-lg border border-navy/10 bg-white p-4"
                  >
                    <div className="flex gap-4">
                      <Link
                        to={item.productId ? `/product/${item.productId}` : "/product-list"}
                        className="shrink-0"
                      >
                        <LineImage name={item.name} image={item.image} className="h-20 w-20 rounded-md" />
                      </Link>

                      <div className="min-w-0 flex-1">
                        <Link
                          to={item.productId ? `/product/${item.productId}` : "/product-list"}
                          className="line-clamp-2 font-display text-lg font-medium leading-snug text-navy transition hover:text-ochre"
                        >
                          {item.name}
                        </Link>
                        <PriceText value={item.price} each={true} />
                      </div>

                      <p className="hidden flex-shrink-0 font-mono text-sm font-semibold tabular-nums text-navy sm:block">
                        <PriceText value={Number(item.price) * item.quantity} />
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-navy/5 pt-4">
                      <QuantitySelector
                        value={item.quantity}
                        onChange={(next) => handleQty(item.id, next)}
                        min={1}
                        max={maxQty}
                        disabled={busyId === item.id}
                        size="sm"
                      />
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-semibold tabular-nums text-navy sm:hidden">
                          <PriceText value={Number(item.price) * item.quantity} />
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemove(item.id)}
                          disabled={removingId === item.id}
                          className={buttonVariants({ variant: "danger", size: "sm" })}
                        >
                          {removingId === item.id ? "Removing…" : "Remove"}
                        </button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>

            {/* Summary + actions */}
            <div className="space-y-4 lg:sticky lg:top-28 lg:self-start">
              <OrderSummary items={items} showItems={false} title="Summary" />
              <Link
                to="/checkout"
                className={cn(buttonVariants({ variant: "primary", size: "lg" }), "w-full")}
              >
                Proceed to checkout
              </Link>
              <Link
                to="/product-list"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full")}
              >
                Continue shopping
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

function PriceText({ value, each = false }) {
  return (
    <span className="font-mono text-xs text-navy/60">
      ${Number(value).toFixed(2)}
      {each ? " each" : ""}
    </span>
  )
}
