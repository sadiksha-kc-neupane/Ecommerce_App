import { useEffect, useState } from "react"
import { Link, Navigate } from "react-router-dom"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import { fetchCart, removeFromCart } from "../lib/api.js"
import { useCart } from "../context/CartContext.jsx"

export default function Cart() {
  const { refreshCart } = useCart()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [removingId, setRemovingId] = useState(null)

  const isLoggedIn = Boolean(localStorage.getItem("token"))

  useEffect(() => {
    if (!isLoggedIn) return

    let cancelled = false

    async function load() {
      try {
        const res = await fetchCart()
        // response shape: { cart: { CartItems: [...] } } -- each CartItem
        // has a nested Product via include: [Product] in cartController.js
        if (!cancelled) setItems(res.cart?.CartItems || [])
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

  async function handleRemove(cartItemId) {
    setError(null)
    try {
      setRemovingId(cartItemId)
      await removeFromCart(cartItemId)
      setItems((prev) => prev.filter((item) => item.id !== cartItemId))
      refreshCart()
    } catch (err) {
      setError(err.message)
    } finally {
      setRemovingId(null)
    }
  }

  const runningTotal = items.reduce(
    (sum, item) => sum + Number(item.Product?.price) * item.quantity,
    0
  )

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />

      <main className="mx-auto max-w-3xl px-6 py-12">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-navy/50">
          Your basket
        </p>
        <h1
          className="mt-3 mb-8 text-3xl leading-tight text-navy font-display"
        >
          Shopping cart
        </h1>

        {!isLoggedIn && <Navigate to="/signin" replace />}

        {isLoggedIn && loading && (
          <p className="font-mono text-sm text-navy/50">Loading cart...</p>
        )}

        {isLoggedIn && !loading && error && (
          <div className="rounded-md bg-cream p-10 text-center outline outline-1 -outline-offset-1 outline-navy/15">
            <p className="font-mono text-sm text-rust">{error}</p>
          </div>
        )}

        {isLoggedIn && !loading && !error && items.length === 0 && (
          <div className="rounded-md bg-cream p-10 text-center outline outline-1 -outline-offset-1 outline-navy/15">
            <p className="text-navy/70">Your cart is empty.</p>
            <Link
              to="/product-list"
              className="mt-4 inline-block rounded-sm bg-ochre px-6 py-3 font-mono text-xs uppercase tracking-widest text-navy transition hover:bg-navy hover:text-cream"
            >
              Browse the catalog
            </Link>
          </div>
        )}

        {isLoggedIn && !loading && items.length > 0 && (
          <>
            <ul className="flex flex-col gap-4">
              {items.map((item) => {
                const product = item.Product
                const lineTotal = Number(product?.price) * item.quantity
                return (
                  <li
                    key={item.id}
                    className="rounded-md bg-cream p-4 outline outline-1 -outline-offset-1 outline-navy/15"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={product?.productImages?.[0] || "https://placehold.co/96x96/F2EEE4/1C1B19?text=D&S"}
                        alt={product?.productName}
                        className="h-20 w-20 flex-shrink-0 rounded-md object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <p
                          className="truncate text-lg text-navy font-display"
                        >
                          {product?.productName}
                        </p>
                        <p className="mt-1 font-mono text-xs text-navy/60">
                          ${Number(product?.price).toFixed(2)} each · Qty:{" "}
                          {item.quantity}
                        </p>
                      </div>

                      <p className="flex-shrink-0 font-mono text-sm font-semibold text-ochre-ink">
                        ${lineTotal.toFixed(2)}
                      </p>
                    </div>

                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => handleRemove(item.id)}
                        disabled={removingId === item.id}
                        className="flex-shrink-0 rounded-sm border border-rust/40 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-rust transition hover:bg-rust hover:text-cream disabled:opacity-50"
                      >
                        {removingId === item.id ? "Removing..." : "Remove"}
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-md bg-cream p-5 outline outline-1 -outline-offset-1 outline-navy/15">
              <p className="font-mono text-xs uppercase tracking-widest text-navy/60">
                Total ({items.reduce((n, i) => n + i.quantity, 0)} items)
              </p>
              <p className="font-mono text-xl font-semibold text-ochre">
                ${runningTotal.toFixed(2)}
              </p>
              <Link
                to="/checkout"
                className="rounded-sm bg-ochre px-6 py-3 font-mono text-xs uppercase tracking-widest text-navy transition hover:bg-navy hover:text-cream"
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
