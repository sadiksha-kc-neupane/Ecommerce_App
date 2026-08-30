import { useEffect, useState } from "react"
import { Link, useLocation, useParams } from "react-router-dom"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import OrderSummary from "../components/cart/OrderSummary.jsx"
import EmptyState from "../components/ui/EmptyState.jsx"
import { buttonVariants } from "../components/ui/buttonVariants.js"
import { fetchSingleOrder } from "../lib/api.js"

// Order confirmation shown right after a successful checkout. The checkout
// passes the placed order via router state; this page also fetches the full
// order (with items) from the API so a refresh still shows the item summary.
export default function OrderConfirmation() {
  const { id } = useParams()
  const location = useLocation()
  const [order, setOrder] = useState(location.state?.order || null)
  const [items, setItems] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetchSingleOrder(id)
      .then((res) => {
        if (cancelled) return
        const o = res.order
        setOrder(o)
        setItems(
          (o.OrderItems || []).map((oi) => ({
            id: oi.id,
            name: oi.Product?.productName || "Product",
            price: Number(oi.price),
            quantity: Number(oi.quantity),
            image: oi.Product?.productImages?.[0],
          }))
        )
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  // No order in state and the fetch failed/returned nothing.
  if (error && !order) {
    return (
      <div className="min-h-screen bg-paper">
        <Navbar />
        <main className="mx-auto max-w-6xl px-6 py-10">
          <EmptyState
            title="Order unavailable"
            body={error}
            className="max-w-md"
            action={
              <Link to="/product-list" className={buttonVariants({ variant: "navy", size: "md" })}>
                Back to catalog
              </Link>
            }
          />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />

      <main className="mx-auto max-w-4xl px-6 py-10">
        {/* Success header */}
        <div className="rounded-lg border border-moss/30 bg-white p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-moss/15">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-7 w-7 text-moss" aria-hidden="true">
              <path d="m5 12 5 5L20 7" />
            </svg>
          </div>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-moss">
            Order confirmed
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-navy">
            Thank you! Your order is on its way.
          </h1>

          {order && (
            <div className="mt-6 grid gap-3 text-left sm:grid-cols-2">
              <div className="rounded-md border border-navy/10 bg-paper p-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-navy/50">Order ID</p>
                <p className="mt-1 break-all font-mono text-sm text-navy">{order.id}</p>
              </div>
              <div className="rounded-md border border-navy/10 bg-paper p-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-navy/50">Status</p>
                <p className="mt-1 font-mono text-sm capitalize text-navy">
                  {order.status} · {order.paymentStatus}
                </p>
              </div>
              <div className="rounded-md border border-navy/10 bg-paper p-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-navy/50">Ship to</p>
                <p className="mt-1 text-sm text-navy">{order.address}</p>
              </div>
              <div className="rounded-md border border-navy/10 bg-paper p-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-navy/50">Payment</p>
                <p className="mt-1 text-sm text-navy">{order.paymentMethod || "—"}</p>
              </div>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="mt-8">
            <OrderSummary items={items} title="Your order" />
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/customer-dashboard"
            className={buttonVariants({ variant: "navy", size: "lg" })}
          >
            View my orders
          </Link>
          <Link
            to="/product-list"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Continue shopping
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
