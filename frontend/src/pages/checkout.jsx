import { useState } from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import { buyProduct } from "../lib/api.js"

export default function Checkout() {
  const [address, setAddress] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [placedOrder, setPlacedOrder] = useState(null)

  const isLoggedIn = Boolean(localStorage.getItem("token"))

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    try {
      setSubmitting(true)
      const res = await buyProduct({ paymentMethod, address })
      setPlacedOrder(res.order)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />

      <main className="mx-auto max-w-2xl px-6 py-12">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-navy/50">
          Checkout
        </p>
        <h1
          className="mt-3 mb-8 text-3xl leading-tight text-navy font-display"
        >
          Complete your order
        </h1>

        {!isLoggedIn && (
          <div className="rounded-md bg-cream p-10 text-center outline outline-1 -outline-offset-1 outline-navy/15">
            <p className="font-mono text-sm text-navy">
              You need an account to check out.
            </p>
            <Link
              to="/signin"
              className="mt-4 inline-block rounded-sm bg-ochre px-6 py-3 font-mono text-xs uppercase tracking-widest text-navy transition hover:bg-navy hover:text-cream"
            >
              Sign in
            </Link>
          </div>
        )}

        {isLoggedIn && placedOrder && (
          <div className="rounded-md bg-cream p-10 text-center outline outline-1 -outline-offset-1 outline-moss/40">
            <p className="font-mono text-xs uppercase tracking-widest text-moss">
              Order placed
            </p>
            <h2
              className="mt-3 text-2xl text-navy font-display"
            >
              Thank you! Your order is confirmed.
            </h2>
            <p className="mt-2 font-mono text-xs text-navy/60">
              Order ID: {placedOrder.id}
            </p>
            <p className="mt-1 font-mono text-sm font-semibold text-ochre">
              Total: ${Number(placedOrder.totalAmount).toFixed(2)}
            </p>
            <p className="mt-4 text-sm text-navy/70">
              Status: <span className="capitalize">{placedOrder.status}</span> ·{" "}
              Shipping to: {placedOrder.address}
            </p>
            <Link
              to="/product-list"
              className="mt-6 inline-block rounded-sm bg-navy px-6 py-3 font-mono text-xs uppercase tracking-widest text-cream transition hover:bg-ochre hover:text-navy"
            >
              Continue shopping
            </Link>
          </div>
        )}

        {isLoggedIn && !placedOrder && (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 rounded-md bg-cream p-8 outline outline-1 -outline-offset-1 outline-navy/15"
          >
            <label className="flex flex-col gap-2">
              <span className="font-mono text-[11px] uppercase tracking-widest text-navy/60">
                Shipping address
              </span>
              <textarea
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                rows={4}
                placeholder="Street, city, postal code..."
                className="rounded-sm border border-navy/20 bg-white px-4 py-3 text-sm text-navy focus:border-ochre focus:outline-none"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="font-mono text-[11px] uppercase tracking-widest text-navy/60">
                Payment method
              </span>
              <input
                type="text"
                name="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                placeholder="e.g. Cash on delivery, card, bank transfer..."
                className="rounded-sm border border-navy/20 bg-white px-4 py-3 text-sm text-navy focus:border-ochre focus:outline-none"
              />
            </label>

            {error && (
              <p className="rounded-sm bg-rust/10 px-4 py-3 font-mono text-xs text-rust">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="rounded-sm bg-ochre px-6 py-3 font-mono text-xs uppercase tracking-widest text-navy transition hover:bg-navy hover:text-cream disabled:cursor-not-allowed disabled:bg-navy/20 disabled:text-navy/40"
            >
              {submitting ? "Placing order..." : "Place order"}
            </button>
          </form>
        )}
      </main>

      <Footer />
    </div>
  )
}
