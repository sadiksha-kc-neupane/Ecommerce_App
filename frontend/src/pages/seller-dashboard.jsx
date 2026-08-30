import { useEffect, useMemo, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import AccountDetailsSection from "../components/AccountDetailsSection.jsx"
import UserDashboardProducts from "../components/UserDashboardProducts.jsx"
import DashboardSidebar from "../components/DashboardSidebar.jsx"
import EmptyState from "../components/ui/EmptyState.jsx"
import Badge from "../components/ui/Badge.jsx"
import Price from "../components/ui/Price.jsx"
import { buttonVariants } from "../components/ui/buttonVariants.js"
import { getCurrentUser } from "../lib/auth.js"
import { fetchProducts, fetchSellerOrders, fetchSingleUser } from "../lib/api.js"
import { orderStatusMeta } from "../lib/orders.js"

// Response shape from GET /seller/orders (see orderController.js fetchSellerOrders):
// { orderItems: [{ id, orderId, productId, quantity, price, createdAt, updatedAt,
//     Product: {...}, Order: { id, userId, totalAmount, status, paymentStatus,
//     paymentMethod, address, createdAt, updatedAt } }] }
// One entry per product-per-order. Revenue for this seller = sum of
// price (unit snapshot) * quantity across those order-items.

const NAV_ITEMS = [
  { key: "overview", label: "Overview" },
  { key: "listings", label: "My listings" },
  { key: "sales", label: "Sales" },
  { key: "account", label: "Account details" },
]

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
        <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 lg:flex-row">
          <DashboardSidebar
            navItems={NAV_ITEMS}
            activeKey={activeSection}
            onSelect={setActiveSection}
            username={profile?.username}
            roleLabel="Seller"
            onLogout={handleLogout}
          />

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

/* ============================== Shared bits ============================== */

function SectionHeader({ eyebrow, title, action }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-navy/50">{eyebrow}</p>
        <h1 className="mt-1 text-3xl text-navy font-display">{title}</h1>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

function ErrorPanel({ message }) {
  return <EmptyState title="Something went wrong" body={message} className="mx-0 max-w-none" />
}

function StatCard({ label, value, children }) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-navy/10 bg-white p-5 shadow-card">
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 bg-ochre/70" />
      <p className="font-mono text-[10px] uppercase tracking-widest text-navy/50">{label}</p>
      {value !== undefined ? (
        <p className="mt-2 font-mono text-2xl font-semibold text-navy">{value}</p>
      ) : (
        children
      )}
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
    return <ErrorPanel message={error} />
  }

  return (
    <div>
      <SectionHeader eyebrow="Seller workspace" title="Overview" />

      {products.length === 0 ? (
        <EmptyState
          title="No listings yet"
          body="Add your first product and start selling — your stats will show up here."
          action={
            <Link to="/create-Product" className={buttonVariants({ variant: "primary", size: "md" })}>
              Add your first product
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Listings" value={String(stats.listings)} />
            <StatCard label="Sales" value={String(stats.sales)} />
            <StatCard label="Revenue">
              <Price value={stats.revenue} className="font-mono text-2xl font-semibold text-navy" />
            </StatCard>
          </div>

          <PerformanceSection sales={sales} />

          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-mono text-[11px] uppercase tracking-widest text-navy/60">Recent sales</h2>
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

/* ============================== Performance (Overview) ============================== */

function localDateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

function buildDaySeries(sales, days = 30) {
  const amounts = new Map()
  for (const sale of sales) {
    const d = new Date(sale.createdAt)
    if (Number.isNaN(d.getTime())) continue
    const key = localDateKey(d)
    amounts.set(key, (amounts.get(key) || 0) + Number(sale.price || 0) * Number(sale.quantity || 0))
  }

  const today = new Date()
  const series = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const key = localDateKey(d)
    series.push({
      key,
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      revenue: Math.round((amounts.get(key) || 0) * 100) / 100,
    })
  }
  return series
}

function EmptyPerformance() {
  return (
    <div className="mt-8 rounded-lg border border-navy/10 bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-mono text-[11px] uppercase tracking-widest text-navy/60">Performance</h2>
        <span className="font-mono text-[10px] uppercase tracking-widest text-navy/40">Last 30 days</span>
      </div>
      <p className="py-10 text-center font-mono text-sm text-navy/50">
        No sales in the last 30 days yet
      </p>
    </div>
  )
}

function PerformanceSection({ sales }) {
  const series = useMemo(() => buildDaySeries(sales), [sales])
  const last30Revenue = useMemo(
    () => series.reduce((sum, point) => sum + point.revenue, 0),
    [series]
  )

  if (last30Revenue <= 0) {
    return <EmptyPerformance />
  }

  return (
    <div className="mt-8 rounded-lg border border-navy/10 bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-mono text-[11px] uppercase tracking-widest text-navy/60">Performance</h2>
        <span className="font-mono text-[10px] uppercase tracking-widest text-navy/40">Last 30 days</span>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
            <defs>
              <linearGradient id="sellerRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D97706" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#D97706" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1C1B191A" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: "#B45309", fontFamily: "JetBrains Mono, monospace" }}
              tickLine={false}
              axisLine={{ stroke: "#1C1B1933" }}
              interval="preserveStartEnd"
              minTickGap={24}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#B45309", fontFamily: "JetBrains Mono, monospace" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${v}`}
              width={56}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#F7F3EC",
                border: "1px solid #1C1B1926",
                borderRadius: 6,
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 12,
                color: "#1C1B19",
              }}
              labelStyle={{ color: "#B45309", textTransform: "uppercase", fontSize: 10 }}
              formatter={(value) => [`$${Number(value).toFixed(2)}`, "Revenue"]}
              labelFormatter={(label, payload) => (payload?.[0]?.payload?.key ? `  ·  ${payload[0].payload.key}` : label)}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#D97706"
              strokeWidth={2}
              fill="url(#sellerRevenue)"
              dot={false}
              activeDot={{ r: 4, fill: "#D97706", stroke: "#F7F3EC", strokeWidth: 2 }}
              isAnimationActive
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

/* ============================== My listings ============================== */

function ListingsSection() {
  return (
    <div>
      <SectionHeader
        eyebrow="Seller workspace"
        title="My listings"
        action={
          <Link to="/create-Product" className={buttonVariants({ variant: "primary", size: "md" })}>
            + New product
          </Link>
        }
      />
      <UserDashboardProducts />
    </div>
  )
}

/* ============================== Sales ============================== */

function SalesSection({ sales, loading, error }) {
  return (
    <div>
      <SectionHeader eyebrow="Seller workspace" title="Sales" />

      {loading && <p className="font-mono text-sm text-navy/50">Loading sales...</p>}

      {!loading && error && <ErrorPanel message={error} />}

      {!loading && !error && sales.length === 0 && (
        <EmptyState
          title="No sales yet"
          body="When customers order your products they'll appear here."
          className="mx-0 max-w-none"
        />
      )}

      {!loading && !error && sales.length > 0 && (
        <div className="rounded-lg border border-navy/10 bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-navy/60">Recent activity</h2>
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
        const statusMeta = orderStatusMeta(sale.Order?.status || "pending")
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
            <Price
              value={Number(sale.price || 0) * Number(sale.quantity || 0)}
              className="font-mono text-sm font-semibold text-ochre-ink"
            />
            <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
          </li>
        )
      })}
    </ul>
  )
}
