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
    <div className="min-h-screen bg-[#F2EEE4]">
      <Navbar />

      <main className="mx-auto max-w-2xl px-6 py-12">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#14213D]/50">
          Checkout
        </p>
        <h1
          className="mt-3 mb-8 text-3xl leading-tight text-[#14213D]"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Complete your order
        </h1>

        {!isLoggedIn && (
          <div className="rounded-md bg-[#FBF7F0] p-10 text-center outline outline-1 -outline-offset-1 outline-[#14213D]/15">
            <p className="font-mono text-sm text-[#14213D]">
              You need an account to check out.
            </p>
            <Link
              to="/signin"
              className="mt-4 inline-block rounded-sm bg-[#E8A33D] px-6 py-3 font-mono text-xs uppercase tracking-widest text-[#14213D] transition hover:bg-[#14213D] hover:text-[#FBF7F0]"
            >
              Sign in
            </Link>
          </div>
        )}

        {isLoggedIn && placedOrder && (
          <div className="rounded-md bg-[#FBF7F0] p-10 text-center outline outline-1 -outline-offset-1 outline-[#4F6F52]/40">
            <p className="font-mono text-xs uppercase tracking-widest text-[#4F6F52]">
              Order placed
            </p>
            <h2
              className="mt-3 text-2xl text-[#14213D]"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Thank you! Your order is confirmed.
            </h2>
            <p className="mt-2 font-mono text-xs text-[#14213D]/60">
              Order ID: {placedOrder.id}
            </p>
            <p className="mt-1 font-mono text-sm font-semibold text-[#E8A33D]">
              Total: ${Number(placedOrder.totalAmount).toFixed(2)}
            </p>
            <p className="mt-4 text-sm text-[#14213D]/70">
              Status: <span className="capitalize">{placedOrder.status}</span> ·{" "}
              Shipping to: {placedOrder.address}
            </p>
            <Link
              to="/product-list"
              className="mt-6 inline-block rounded-sm bg-[#14213D] px-6 py-3 font-mono text-xs uppercase tracking-widest text-[#FBF7F0] transition hover:bg-[#E8A33D] hover:text-[#14213D]"
            >
              Continue shopping
            </Link>
          </div>
        )}

        {isLoggedIn && !placedOrder && (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 rounded-md bg-[#FBF7F0] p-8 outline outline-1 -outline-offset-1 outline-[#14213D]/15"
          >
            <label className="flex flex-col gap-2">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#14213D]/60">
                Shipping address
              </span>
              <textarea
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                rows={4}
                placeholder="Street, city, postal code..."
                className="rounded-sm border border-[#14213D]/20 bg-white px-4 py-3 text-sm text-[#14213D] focus:border-[#E8A33D] focus:outline-none"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#14213D]/60">
                Payment method
              </span>
              <input
                type="text"
                name="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                placeholder="e.g. Cash on delivery, card, bank transfer..."
                className="rounded-sm border border-[#14213D]/20 bg-white px-4 py-3 text-sm text-[#14213D] focus:border-[#E8A33D] focus:outline-none"
              />
            </label>

            {error && (
              <p className="rounded-sm bg-[#B33F2E]/10 px-4 py-3 font-mono text-xs text-[#B33F2E]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="rounded-sm bg-[#E8A33D] px-6 py-3 font-mono text-xs uppercase tracking-widest text-[#14213D] transition hover:bg-[#14213D] hover:text-[#FBF7F0] disabled:cursor-not-allowed disabled:bg-[#14213D]/20 disabled:text-[#14213D]/40"
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
