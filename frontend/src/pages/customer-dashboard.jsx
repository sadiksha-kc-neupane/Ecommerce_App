import { useEffect, useState } from "react"
import { Link, Navigate } from "react-router-dom"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import { fetchOrders, cancelOrder as cancelOrderApi } from "../lib/api.js"

const NON_CANCELLABLE_STATUSES = ["shipped", "delivered", "cancelled"]

const STATUS_STYLES = {
  pending: "bg-ochre/20 text-ochre-ink",
  shipped: "bg-navy/10 text-navy",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-rust/15 text-rust",
}

export default function CustomerDashboard() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cancellingId, setCancellingId] = useState(null)

  const isLoggedIn = Boolean(localStorage.getItem("token"))

  useEffect(() => {
    if (!isLoggedIn) return

    let cancelled = false

    async function load() {
      try {
        const res = await fetchOrders()
        if (!cancelled) setOrders(res.orders || [])
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

  async function handleCancelOrder(id) {
    setError(null)
    try {
      setCancellingId(id)
      await cancelOrderApi(id)
      // reload order list so the status change shows immediately
      const res = await fetchOrders()
      setOrders(res.orders || [])
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.")
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />

      <main className="mx-auto max-w-4xl px-6 py-12">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-navy/50">
          Your account
        </p>
        <h1 className="mt-1 mb-8 text-3xl text-navy font-display">
          Order history
        </h1>

        {!isLoggedIn && <Navigate to="/signin" replace />}

        {isLoggedIn && loading && (
          <p className="font-mono text-sm text-navy/50">Loading orders...</p>
        )}

        {isLoggedIn && !loading && error && (
          <div className="rounded-md bg-cream p-10 text-center outline outline-1 -outline-offset-1 outline-navy/15">
            <p className="font-mono text-sm text-rust">{error}</p>
          </div>
        )}

        {isLoggedIn && !loading && !error && orders.length === 0 && (
          <div className="rounded-md bg-cream p-10 text-center outline outline-1 -outline-offset-1 outline-navy/15">
            <p className="text-navy/70">You haven&apos;t placed any orders yet.</p>
            <Link
              to="/product-list"
              className="mt-4 inline-block rounded-sm bg-ochre px-6 py-3 font-mono text-xs uppercase tracking-widest text-navy transition hover:bg-navy hover:text-cream"
            >
              Browse the catalog
            </Link>
          </div>
        )}

        {isLoggedIn && !loading && orders.length > 0 && (
          <ul className="flex flex-col gap-6">
            {orders.map((order) => {
              const canCancel = !NON_CANCELLABLE_STATUSES.includes(order.status)
              return (
                <li
                  key={order.id}
                  className="rounded-md bg-cream p-5 outline outline-1 -outline-offset-1 outline-navy/15"
                >
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-widest ${STATUS_STYLES[order.status] || "bg-navy/10 text-navy"}`}
                      >
                        {order.status}
                      </span>
                      <span className="font-mono text-xs text-navy/50">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {canCancel && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={cancellingId === order.id}
                        className="rounded-sm border border-rust/40 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-rust transition hover:bg-rust hover:text-cream disabled:opacity-50"
                      >
                        {cancellingId === order.id ? "Cancelling..." : "Cancel order"}
                      </button>
                    )}
                  </div>

                  <ul className="mb-4 flex flex-col gap-2">
                    {(order.OrderItems || []).map((item) => (
                      <li
                        key={item.id}
                        className="flex flex-wrap items-center justify-between gap-2 border-b border-navy/10 pb-2 last:border-b-0"
                      >
                        <img
                          src={item.Product?.productImage || "https://placehold.co/48x48/F2EEE4/14213D?text=Bazario"}
                          alt={item.Product?.productName}
                          className="h-10 w-10 rounded-md object-cover"
                        />
                        <span className="min-w-0 flex-1 truncate text-sm text-navy">
                          {item.Product?.productName || "Deleted product"}
                        </span>
                        <span className="font-mono text-xs text-navy/60">
                          Qty: {item.quantity} × ${Number(item.price).toFixed(2)} = ${(Number(item.price) * item.quantity).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <p className="text-right font-mono text-lg font-semibold text-ochre">
                    Total: ${Number(order.totalAmount).toFixed(2)}
                  </p>
                </li>
              )
            })}
          </ul>
        )}
      </main>

      <Footer />
    </div>
  )
}
