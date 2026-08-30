import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import OrderSummary from "../components/cart/OrderSummary.jsx"
import EmptyState from "../components/ui/EmptyState.jsx"
import { buttonVariants } from "../components/ui/Button.jsx"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select.jsx"
import { fetchCart, buyProduct } from "../lib/api.js"
import { toLine } from "../lib/cart.js"
import { useCart } from "../context/CartContext.jsx"

// The backend stores paymentMethod as a free string on Order (no ENUM, no
// validation), so these controlled options are safe to send as-is.
const PAYMENT_METHODS = [
  "Cash on Delivery",
  "Credit / Debit Card",
  "Bank Transfer",
]

export default function Checkout() {
  const { refreshCart } = useCart()
  const navigate = useNavigate()

  const [items, setItems] = useState([])
  const [cartLoading, setCartLoading] = useState(true)
  const [cartError, setCartError] = useState(null)

  const [address, setAddress] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const isLoggedIn = Boolean(localStorage.getItem("token"))

  useEffect(() => {
    if (!isLoggedIn) return
    let cancelled = false
    async function load() {
      try {
        const res = await fetchCart()
        if (!cancelled) setItems((res.cart?.CartItems || []).map(toLine))
      } catch (err) {
        if (!cancelled) setCartError(err.message)
      } finally {
        if (!cancelled) setCartLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [isLoggedIn])

  const lines = useMemo(
    () => items.map((it) => ({ id: it.id, name: it.name, price: it.price, quantity: it.quantity, image: it.image })),
    [items]
  )

  function validate() {
    const next = {}
    if (!address.trim()) next.address = "Shipping address is required."
    if (!paymentMethod) next.paymentMethod = "Please choose a payment method."
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitError(null)
    if (submitting) return
    if (!validate()) return

    try {
      setSubmitting(true)
      const res = await buyProduct({ paymentMethod, address })
      refreshCart()
      navigate(`/order-confirmation/${res.order.id}`, { state: { order: res.order } })
    } catch (err) {
      setSubmitError(err.message)
      setSubmitting(false)
    }
  }

  const fieldBase =
    "w-full rounded-md border border-navy/20 bg-white px-4 py-3 text-sm text-navy outline-none transition focus:border-ochre focus:ring-2 focus:ring-ochre/25"

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-navy/50">Checkout</p>
        <h1 className="mt-1 mb-8 font-display text-3xl font-bold text-navy">Complete your order</h1>

        {!isLoggedIn && (
          <EmptyState
            title="You need an account to check out"
            body="Sign in to place your order."
            className="max-w-md"
            action={
              <Link to="/signin" className={buttonVariants({ variant: "primary", size: "md" })}>
                Sign in
              </Link>
            }
          />
        )}

        {isLoggedIn && cartLoading && (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-5">
              <div className="h-40 animate-pulse rounded-lg border border-navy/10 bg-white" />
              <div className="h-28 animate-pulse rounded-lg border border-navy/10 bg-white" />
            </div>
            <div className="h-64 animate-pulse rounded-lg border border-navy/10 bg-white" />
          </div>
        )}

        {isLoggedIn && !cartLoading && cartError && (
          <EmptyState title="Couldn't load your order" body={cartError} className="max-w-md" />
        )}

        {isLoggedIn && !cartLoading && !cartError && items.length === 0 && (
          <EmptyState
            title="Your cart is empty"
            body="Add something to your cart before checking out."
            className="max-w-md"
            action={
              <Link to="/product-list" className={buttonVariants({ variant: "primary", size: "md" })}>
                Continue shopping
              </Link>
            }
          />
        )}

        {isLoggedIn && !cartLoading && !cartError && items.length > 0 && (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
              <section className="rounded-lg border border-navy/10 bg-white p-6">
                <h2 className="font-display text-lg font-semibold text-navy">Shipping details</h2>
                <label className="mt-4 block">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-navy/50">
                    Shipping address
                  </span>
                  <textarea
                    name="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={4}
                    placeholder="Street, city, postal code..."
                    aria-invalid={!!errors.address}
                    className={fieldBase + " mt-2"}
                  />
                  {errors.address && (
                    <span className="mt-1 block font-mono text-xs text-rust">{errors.address}</span>
                  )}
                </label>
              </section>

              <section className="rounded-lg border border-navy/10 bg-white p-6">
                <h2 className="font-display text-lg font-semibold text-navy">Payment method</h2>
                <div className="mt-4">
                  <Select value={paymentMethod || undefined} onValueChange={setPaymentMethod}>
                    <SelectTrigger
                      aria-label="Payment method"
                      className="w-full border-navy/20 bg-white py-3 text-sm text-navy"
                    >
                      <SelectValue placeholder="Choose a payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_METHODS.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.paymentMethod && (
                    <span className="mt-1 block font-mono text-xs text-rust">{errors.paymentMethod}</span>
                  )}
                </div>
              </section>

              {submitError && (
                <p className="rounded-md bg-rust/10 px-4 py-3 font-mono text-xs text-rust">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className={buttonVariants({ variant: "primary", size: "lg" })}
              >
                {submitting ? "Placing order…" : "Place order"}
              </button>
            </form>

            {/* Summary */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <OrderSummary items={lines} title="Your order" />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
