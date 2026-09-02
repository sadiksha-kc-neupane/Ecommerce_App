import { useEffect, useState } from "react"
import { Link, useLocation, useParams } from "react-router-dom"
import { CheckCircleIcon, ClockIcon, XCircleIcon } from "@heroicons/react/24/outline"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import OrderSummary from "../components/cart/OrderSummary.jsx"
import EmptyState from "../components/ui/EmptyState.jsx"
import Badge from "../components/ui/Badge.jsx"
import Price from "../components/ui/Price.jsx"
import { buttonVariants } from "../components/ui/buttonVariants.js"
import { fetchSingleOrder } from "../lib/api.js"
import { orderStatusMeta, paymentStatusMeta } from "../lib/orders.js"

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

  const pMeta = paymentStatusMeta(order?.paymentStatus)
  const oMeta = orderStatusMeta(order?.status)
  const isPendingVerification = order?.paymentStatus === "pending_verification"

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />

      <main className="mx-auto max-w-4xl px-6 py-10">
        {/* Success / Status Card */}
        <div className="rounded-2xl border border-navy/10 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-moss/15 text-moss">
            {isPendingVerification ? (
              <ClockIcon className="h-7 w-7 text-ochre-ink" />
            ) : order?.paymentStatus === "rejected" ? (
              <XCircleIcon className="h-7 w-7 text-rust" />
            ) : (
              <CheckCircleIcon className="h-7 w-7 text-moss" />
            )}
          </div>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-ochre-ink font-semibold">
            Order Confirmed
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-navy">
            {isPendingVerification
              ? "Order Placed & Payment Proof Received!"
              : "Thank you! Your order has been placed."}
          </h1>

          {/* Pending Verification Notice */}
          {isPendingVerification && (
            <div className="mt-4 mx-auto max-w-lg rounded-xl border border-ochre/30 bg-ochre/10 p-4 text-xs text-ochre-ink">
              <p className="font-semibold">⏳ Admin Verification In Progress</p>
              <p className="mt-1 opacity-90">
                We received your payment screenshot. Our team will review and approve your purchase shortly. You will receive an email confirmation once verified.
              </p>
            </div>
          )}

          {order && (
            <div className="mt-6 grid gap-3 text-left sm:grid-cols-2">
              <div className="rounded-xl border border-navy/10 bg-paper/50 p-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-navy/50">Order ID</p>
                <p className="mt-1 break-all font-mono text-sm font-semibold text-navy">#{order.id}</p>
              </div>
              <div className="rounded-xl border border-navy/10 bg-paper/50 p-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-navy/50">Payment Status</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <Badge tone={pMeta.tone}>{pMeta.label}</Badge>
                  <span className="font-mono text-xs text-navy/60">({order.paymentMethod || "Direct"})</span>
                </div>
              </div>
              <div className="rounded-xl border border-navy/10 bg-paper/50 p-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-navy/50">Delivery Address</p>
                <p className="mt-1 text-sm text-navy">{order.address}</p>
              </div>
              <div className="rounded-xl border border-navy/10 bg-paper/50 p-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-navy/50">Total Amount</p>
                <p className="mt-1 font-mono text-base font-bold text-ochre-ink">
                  <Price value={order.totalAmount} />
                </p>
              </div>
            </div>
          )}

          {/* Uploaded Payment Proof Thumbnail */}
          {order?.paymentScreenshot && (
            <div className="mt-6 rounded-xl border border-navy/10 bg-paper/30 p-4 text-left">
              <p className="font-mono text-[10px] uppercase tracking-widest text-navy/50 mb-2">
                Uploaded Payment Screenshot
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={order.paymentScreenshot}
                  alt="Your uploaded payment receipt"
                  className="h-24 w-24 rounded-lg object-cover border border-navy/15 bg-white shadow-xs"
                />
                <div className="text-xs text-navy/70">
                  <p className="font-semibold text-navy">Receipt proof submitted with checkout</p>
                  <p className="mt-0.5 font-mono text-[11px] text-navy/50">
                    Matches total: <Price value={order.totalAmount} />
                  </p>
                </div>
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
            View My Orders
          </Link>
          <Link
            to="/product-list"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Continue Shopping
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
