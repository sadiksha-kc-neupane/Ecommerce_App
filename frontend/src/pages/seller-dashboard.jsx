import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import UserDashboardProducts from "../components/UserDashboardProducts.jsx"
import { fetchSellerOrders } from "../lib/api.js"

// Response shape from GET /seller/orders (see orderController.js):
// { orderItems: [{ id, orderId, productId, quantity, price, createdAt, updatedAt,
//     Product: {...}, Order: { id, userId, totalAmount, status, paymentStatus,
//     paymentMethod, address, createdAt, updatedAt } }] }
// One entry per product-per-order; Order.userId is the buyer (no name/email included).
const STATUS_STYLES = {
  pending: "bg-ochre/20 text-ochre-ink",
  shipped: "bg-navy/10 text-navy",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-rust/15 text-rust",
}

export default function SellerDashboard() {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetchSellerOrders()
        if (!cancelled) setSales(res.orderItems || [])
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
  }, [])

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />

      <main className="mx-auto max-w-4xl px-6 py-12">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-navy/50">
          Seller
        </p>
        <h1 className="mt-1 text-3xl text-navy font-display">
          Seller dashboard
        </h1>

        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl text-navy font-display">My listings</h2>
            <Link
              to="/create-Product"
              className="rounded-sm bg-ochre px-4 py-2 font-mono text-xs uppercase tracking-widest text-navy transition hover:bg-navy hover:text-cream"
            >
              Add product
            </Link>
          </div>
          <UserDashboardProducts />
        </section>

        <section className="mt-12">
          <h2 className="text-xl text-navy font-display">Sales</h2>

          {loading && (
            <p className="mt-6 font-mono text-sm text-navy/50">Loading sales...</p>
          )}

          {!loading && error && (
            <div className="mt-6 rounded-md bg-cream p-10 text-center outline outline-1 -outline-offset-1 outline-navy/15">
              <p className="font-mono text-sm text-rust">{error}</p>
            </div>
          )}

          {!loading && !error && sales.length === 0 && (
            <div className="mt-6 rounded-md bg-cream p-10 text-center outline outline-1 -outline-offset-1 outline-navy/15">
              <p className="text-navy/70">No sales yet.</p>
              <p className="mt-2 font-mono text-xs text-navy/50">
                When a customer buys one of your products, the order will show up here.
              </p>
            </div>
          )}

          {!loading && !error && sales.length > 0 && (
            <ul className="mt-6 flex flex-col gap-3">
              {sales.map((sale) => {
                const lineTotal = Number(sale.price) * sale.quantity
                const status = sale.Order?.status || "unknown"
                return (
                  <li
                    key={sale.id}
                    className="flex flex-wrap items-center gap-4 rounded-md bg-cream p-4 outline outline-1 -outline-offset-1 outline-navy/15"
                  >
                    <img
                      src={sale.Product?.productImage || "https://placehold.co/64x64/F2EEE4/14213D?text=Bazario"}
                      alt={sale.Product?.productName}
                      className="h-14 w-14 flex-shrink-0 rounded-md object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-navy font-display">
                        {sale.Product?.productName || "Deleted product"}
                      </p>
                      <p className="mt-1 font-mono text-xs text-navy/60">
                        Qty {sale.quantity} × ${Number(sale.price).toFixed(2)} ·{" "}
                        {new Date(sale.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-widest ${STATUS_STYLES[status] || "bg-navy/10 text-navy"}`}
                    >
                      {status}
                    </span>

                    <p className="flex-shrink-0 font-mono text-sm font-semibold text-ochre">
                      ${lineTotal.toFixed(2)}
                    </p>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
