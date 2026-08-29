import { useEffect, useMemo, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import AccountDetailsSection from "../components/AccountDetailsSection.jsx"
import UserDashboardProducts from "../components/UserDashboardProducts.jsx"
import { getCurrentUser } from "../lib/auth.js"
import { fetchProducts, fetchSellerOrders, fetchSingleUser } from "../lib/api.js"

// Response shape from GET /seller/orders (see orderController.js fetchSellerOrders):
// { orderItems: [{ id, orderId, productId, quantity, price, createdAt, updatedAt,
//     Product: {...}, Order: { id, userId, totalAmount, status, paymentStatus,
//     paymentMethod, address, createdAt, updatedAt } }] }
// One entry per product-per-order. Revenue for this seller = sum of
// price (unit snapshot) * quantity across those order-items.
const STATUS_STYLES = {
  pending: "bg-ochre/20 text-ochre-ink",
  processing: "bg-navy/10 text-navy",
  shipped: "bg-navy/10 text-navy",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-rust/15 text-rust",
}

const NAV_ITEMS = [
  { key: "overview", label: "Overview" },
  { key: "listings", label: "My listings" },
  { key: "sales", label: "Sales" },
  { key: "account", label: "Account details" },
]

function initials(name) {
  if (!name) return "?"
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

export default function SellerDashboard() {
  const navigate = useNavigate()
  const isLoggedIn = Boolean(localStorage.getItem("token"))
  const currentUser = getCurrentUser()

  const [activeSection, setActiveSection] = useState("overview")
  const [sales, setSales] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (!isLoggedIn) return
    let cancelled = false

    // decoded token only has { id, role }, so fetch real username for the
    // sidebar identity block via fetch-single (returns an array)
    fetchSingleUser(currentUser?.id)
      .then((data) => {
        if (cancelled) return
        const user = Array.isArray(data) ? data[0] : data
        if (user) setProfile(user)
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [isLoggedIn, currentUser?.id])

  useEffect(() => {
    if (!isLoggedIn) return
    let cancelled = false

    async function load() {
      try {
        const [salesRes, productsRes] = await Promise.all([fetchSellerOrders(), fetchProducts()])
        if (!cancelled) {
          setSales(salesRes.orderItems || [])
          setProducts((productsRes.data || []).filter((product) => product.userId === currentUser?.id))
        }
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
  }, [isLoggedIn, currentUser?.id])

  function handleLogout() {
    localStorage.removeItem("token")
    navigate("/signin")
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {!isLoggedIn && <Navigate to="/signin" replace />}

      {isLoggedIn && (
        <main className="mx-auto flex max-w-6xl gap-8 px-6 py-10">
          {/* ---------- Sidebar ---------- */}
          <aside className="flex w-60 flex-col rounded-md bg-navy p-4 text-cream lg:sticky lg:top-24">
            <div className="mb-6 flex items-center gap-3 rounded-md bg-cream/5 p-3">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-ochre bg-cream/10 font-mono text-sm font-semibold text-ochre">
                {initials(profile?.username)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm capitalize text-cream">{profile?.username || "Seller"}</p>
                <span className="mt-0.5 inline-block rounded-full bg-ochre/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-ochre">
                  Seller
                </span>
              </div>
            </div>

            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const active = activeSection === item.key
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setActiveSection(item.key)}
                    className={`relative border-l-2 px-3 py-2 text-left font-mono text-[11px] uppercase tracking-widest transition ${
                      active
                        ? "border-ochre bg-ochre/15 text-cream"
                        : "border-transparent text-cream/60 hover:bg-cream/5 hover:text-cream"
                    }`}
                  >
                    {item.label}
                  </button>
                )
              })}
            </nav>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-auto rounded-sm border border-rust/40 px-3 py-2 text-left font-mono text-[11px] uppercase tracking-widest text-cream/70 transition hover:bg-rust hover:text-cream"
            >
              Log out
            </button>
          </aside>

          {/* ---------- Content ---------- */}
          <section className="min-w-0 flex-1">
            {activeSection === "overview" && (
              <Overview
                products={products}
                sales={sales}
                loading={loading}
                error={error}
                onViewSales={() => setActiveSection("sales")}
              />
            )}
            {activeSection === "listings" && <ListingsSection />}
            {activeSection === "sales" && (
              <SalesSection sales={sales} loading={loading} error={error} />
            )}
            {activeSection === "account" && <AccountDetailsSection />}
          </section>
        </main>
      )}

      <Footer />
    </div>
  )
}

/* ============================== Overview ============================== */

function Overview({ products, sales, loading, error, onViewSales }) {
  const stats = useMemo(() => {
    const revenue = sales.reduce(
      (total, sale) => total + Number(sale.price || 0) * Number(sale.quantity || 0),
      0
    )
    return { listings: products.length, sales: sales.length, revenue }
  }, [products, sales])

  if (loading) {
    return <p className="font-mono text-sm text-navy/50">Loading your overview...</p>
  }

  if (error) {
    return (
      <div className="rounded-md bg-paper p-10 text-center outline outline-1 -outline-offset-1 outline-navy/15">
        <p className="font-mono text-sm text-rust">{error}</p>
      </div>
    )
  }

  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-navy/50">Seller workspace</p>
      <h1 className="mt-1 mb-8 text-3xl text-navy font-display">Overview</h1>

      {products.length === 0 ? (
        <div className="rounded-md bg-paper p-10 text-center outline outline-1 -outline-offset-1 outline-navy/15">
          <p className="text-lg text-navy font-display">No listings yet</p>
          <p className="mt-2 text-sm text-navy/60">
            Add your first product and start selling — your stats will show up here.
          </p>
          <Link
            to="/create-Product"
            className="mt-5 inline-block rounded-sm bg-ochre px-6 py-3 font-mono text-xs uppercase tracking-widest text-navy transition hover:bg-navy hover:text-cream"
          >
            Add your first product
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Listings" value={stats.listings} />
            <StatCard label="Sales" value={stats.sales} />
            <StatCard label="Revenue" value={`$${stats.revenue.toFixed(2)}`} />
          </div>

          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-mono text-[11px] uppercase tracking-widest text-navy/60">
                Recent sales
              </h2>
              <button
                type="button"
                onClick={onViewSales}
                className="font-mono text-[10px] uppercase tracking-widest text-ochre-ink transition hover:text-navy"
              >
                View all
              </button>
            </div>
            <SaleList sales={sales.slice(0, 3)} />
          </div>
        </>
      )}
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-md bg-paper p-5 outline outline-1 -outline-offset-1 outline-navy/15">
      <p className="font-mono text-[10px] uppercase tracking-widest text-navy/50">{label}</p>
      <p className="mt-2 font-mono text-2xl font-semibold text-navy">{value}</p>
    </div>
  )
}

/* ============================== My listings ============================== */

function ListingsSection() {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-navy/50">Seller workspace</p>
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="text-3xl text-navy font-display">My listings</h1>
        <Link
          to="/create-Product"
          className="rounded-sm bg-ochre px-4 py-2 font-mono text-xs uppercase tracking-widest text-navy transition hover:bg-navy hover:text-cream"
        >
          + New product
        </Link>
      </div>
      <UserDashboardProducts />
    </div>
  )
}

/* ============================== Sales ============================== */

function SalesSection({ sales, loading, error }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-navy/50">Seller workspace</p>
      <h1 className="mt-1 mb-8 text-3xl text-navy font-display">Sales</h1>

      {loading && (
        <p className="font-mono text-sm text-navy/50">Loading sales...</p>
      )}

      {!loading && error && (
        <div className="rounded-md bg-paper p-10 text-center outline outline-1 -outline-offset-1 outline-navy/15">
          <p className="font-mono text-sm text-rust">{error}</p>
        </div>
      )}

      {!loading && !error && sales.length === 0 && (
        <div className="rounded-md bg-paper p-10 text-center outline outline-1 -outline-offset-1 outline-navy/15">
          <p className="font-mono text-sm text-navy/60">
            No sales yet — when customers order your products they&apos;ll appear here.
          </p>
        </div>
      )}

      {!loading && !error && sales.length > 0 && (
        <div className="rounded-md bg-paper p-5 outline outline-1 -outline-offset-1 outline-navy/15">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-navy/60">
              Recent activity
            </h2>
            <span className="font-mono text-xs text-navy/50">{sales.length} total</span>
          </div>
          <SaleList sales={sales} />
        </div>
      )}
    </div>
  )
}

function SaleList({ sales }) {
  return (
    <ul className="flex flex-col divide-y divide-navy/10">
      {sales.map((sale) => {
        const status = sale.Order?.status || "pending"
        return (
          <li key={sale.id} className="flex items-center gap-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-navy">
                {sale.Product?.productName || "Product sale"}
              </p>
              <p className="mt-0.5 font-mono text-xs text-navy/50">
                Qty {sale.quantity} · {new Date(sale.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span className="font-mono text-sm font-semibold text-ochre-ink">
              ${(Number(sale.price || 0) * Number(sale.quantity || 0)).toFixed(2)}
            </span>
            <span
              className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-widest ${STATUS_STYLES[status] || STATUS_STYLES.pending}`}
            >
              {status}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
