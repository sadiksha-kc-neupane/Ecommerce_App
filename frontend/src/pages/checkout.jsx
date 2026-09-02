import { useEffect, useMemo, useState, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  QrCodeIcon,
  PhotoIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import OrderSummary from "../components/cart/OrderSummary.jsx"
import EmptyState from "../components/ui/EmptyState.jsx"
import Price from "../components/ui/Price.jsx"
import { buttonVariants } from "../components/ui/buttonVariants.js"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select.jsx"
import { fetchCart, buyProduct } from "../lib/api.js"
import { toLine } from "../lib/cart.js"
import { useCart } from "../context/useCart.js"

const PAYMENT_METHODS = [
  "QR Code / Digital Wallet",
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
  const [paymentMethod, setPaymentMethod] = useState("QR Code / Digital Wallet")
  const [paymentScreenshot, setPaymentScreenshot] = useState(null)
  const [screenshotPreview, setScreenshotPreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const fileInputRef = useRef(null)
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

  const subtotal = useMemo(
    () => lines.reduce((acc, it) => acc + Number(it.price) * Number(it.quantity), 0),
    [lines]
  )

  function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, paymentScreenshot: "Please select an image file (JPG, PNG, WebP)" }))
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, paymentScreenshot: "Image must be smaller than 5MB" }))
      return
    }

    const reader = new FileReader()
    reader.onload = (uploadEvent) => {
      const base64Data = uploadEvent.target.result
      setPaymentScreenshot(base64Data)
      setScreenshotPreview(base64Data)
      setErrors((prev) => {
        const next = { ...prev }
        delete next.paymentScreenshot
        return next
      })
    }
    reader.readAsDataURL(file)
  }

  function handleRemoveScreenshot() {
    setPaymentScreenshot(null)
    setScreenshotPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  function validate() {
    const next = {}
    if (!address.trim()) next.address = "Shipping address is required."
    if (!paymentMethod) next.paymentMethod = "Please choose a payment method."
    
    const isQrOrBank = paymentMethod === "QR Code / Digital Wallet" || paymentMethod === "Bank Transfer"
    if (isQrOrBank && !paymentScreenshot) {
      next.paymentScreenshot = "Please attach a screenshot of your completed payment transfer."
    }

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
      const res = await buyProduct({
        paymentMethod,
        address,
        paymentScreenshot: paymentScreenshot || undefined,
      })
      refreshCart()
      navigate(`/order-confirmation/${res.order.id}`, { state: { order: res.order } })
    } catch (err) {
      setSubmitError(err.message)
      setSubmitting(false)
    }
  }

  const fieldBase =
    "w-full rounded-md border border-navy/20 bg-white px-4 py-3 text-sm text-navy outline-none transition focus:border-ochre focus:ring-2 focus:ring-ochre/25"

  const isQrSelected = paymentMethod === "QR Code / Digital Wallet" || paymentMethod === "Bank Transfer"

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
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
              {/* Shipping Address */}
              <section className="rounded-2xl border border-navy/10 bg-white p-6 shadow-sm">
                <h2 className="font-display text-lg font-semibold text-navy">1. Shipping details</h2>
                <label className="mt-4 block">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-navy/50">
                    Delivery Address
                  </span>
                  <textarea
                    name="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    placeholder="Street name, house/building number, city, district..."
                    aria-invalid={!!errors.address}
                    className={fieldBase + " mt-2"}
                  />
                  {errors.address && (
                    <span className="mt-1 block font-mono text-xs text-rust">{errors.address}</span>
                  )}
                </label>
              </section>

              {/* Payment Method */}
              <section className="rounded-2xl border border-navy/10 bg-white p-6 shadow-sm">
                <h2 className="font-display text-lg font-semibold text-navy">2. Payment method</h2>
                <div className="mt-4">
                  <Select value={paymentMethod || undefined} onValueChange={setPaymentMethod}>
                    <SelectTrigger
                      aria-label="Payment method"
                      className="w-full border-navy/20 bg-white py-3 text-sm text-navy rounded-xl"
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

                {/* QR Code & Screenshot Section */}
                {isQrSelected && (
                  <div className="mt-6 rounded-xl border border-ochre/30 bg-paper/30 p-5">
                    <div className="flex items-center gap-2 text-ochre-ink">
                      <QrCodeIcon className="h-5 w-5" />
                      <h3 className="text-sm font-bold uppercase tracking-wider font-mono">
                        Scan Merchant QR to Pay
                      </h3>
                    </div>
                    <p className="mt-1 text-xs text-navy/70">
                      Scan this QR with <strong>FonePay, eSewa, Khalti, or any Mobile Banking app</strong>. Then upload the payment screenshot below for manual admin verification.
                    </p>

                    {/* QR Presentation Box */}
                    <div className="mt-4 flex flex-col items-center justify-center gap-4 rounded-xl border border-navy/10 bg-white p-5 text-center sm:flex-row sm:text-left">
                      {/* Merchant QR Code Graphic */}
                      <div className="flex flex-col items-center rounded-xl border border-navy/15 bg-white p-3 shadow-xs">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=DIPTI_SUPPLIERS_PAYMENT_NPR_${subtotal}`}
                          alt="Dipti&Suppliers Payment QR"
                          className="h-36 w-36 rounded-lg object-contain"
                        />
                        <span className="mt-2 font-mono text-[10px] font-bold text-navy">
                          DIPTI&amp;SUPPLIERS
                        </span>
                      </div>

                      {/* Payment Metadata Details */}
                      <div className="flex-1 space-y-2 text-xs">
                        <div>
                          <span className="font-mono text-[10px] uppercase text-navy/50">Merchant Name:</span>
                          <p className="font-semibold text-navy">Dipti &amp; Suppliers Pvt. Ltd.</p>
                        </div>
                        <div>
                          <span className="font-mono text-[10px] uppercase text-navy/50">Account / Wallet:</span>
                          <p className="font-mono font-semibold text-navy">9800000000 / FonePay QR</p>
                        </div>
                        <div>
                          <span className="font-mono text-[10px] uppercase text-navy/50">Amount to Transfer:</span>
                          <p className="font-mono text-base font-bold text-ochre-ink">
                            <Price value={subtotal} />
                          </p>
                        </div>
                        <div className="rounded-lg bg-ochre/10 p-2 text-[11px] text-ochre-ink font-medium">
                          ⚠️ Please include your name in the payment remarks.
                        </div>
                      </div>
                    </div>

                    {/* Screenshot Upload Box */}
                    <div className="mt-5">
                      <label className="block text-xs font-semibold text-navy mb-2">
                        Upload Payment Proof Screenshot <span className="text-rust">*</span>
                      </label>

                      {!screenshotPreview ? (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition ${
                            errors.paymentScreenshot
                              ? "border-rust bg-rust/5"
                              : "border-navy/20 bg-white hover:border-ochre hover:bg-ochre/5"
                          }`}
                        >
                          <ArrowUpTrayIcon className="h-8 w-8 text-navy/40 mb-2" />
                          <p className="text-xs font-semibold text-navy">
                            Click to upload or drag &amp; drop payment screenshot
                          </p>
                          <p className="mt-1 font-mono text-[10px] text-navy/50">
                            PNG, JPG, or WebP up to 5MB
                          </p>
                        </div>
                      ) : (
                        <div className="relative rounded-xl border border-moss/40 bg-white p-3 flex items-center gap-4">
                          <img
                            src={screenshotPreview}
                            alt="Payment Proof Preview"
                            className="h-20 w-20 rounded-lg object-cover border border-navy/10 flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1 text-moss">
                              <CheckCircleIcon className="h-4 w-4 flex-shrink-0" />
                              <span className="text-xs font-bold">Screenshot Attached</span>
                            </div>
                            <p className="mt-1 font-mono text-[11px] text-navy/60 truncate">
                              Ready for submission &amp; verification
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveScreenshot}
                            className="rounded-lg border border-rust/30 p-2 text-rust hover:bg-rust hover:text-white transition flex-shrink-0"
                            title="Remove Screenshot"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      )}

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleImageUpload}
                        className="hidden"
                      />

                      {errors.paymentScreenshot && (
                        <p className="mt-1.5 font-mono text-xs text-rust font-medium">
                          {errors.paymentScreenshot}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </section>

              {submitError && (
                <div className="rounded-xl bg-rust/10 p-4 font-mono text-xs text-rust font-medium">
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className={buttonVariants({ variant: "primary", size: "lg" })}
              >
                {submitting ? "Placing Order & Uploading..." : "Confirm & Place Order"}
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
