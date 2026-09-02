import { useEffect, useMemo, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import {
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  ArrowRightIcon,
  BanknotesIcon,
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  TruckIcon,
} from "@heroicons/react/24/outline"
import { toast } from "sonner"
import AccountDetailsSection from "../components/AccountDetailsSection.jsx"
import DashboardSidebar from "../components/DashboardSidebar.jsx"
import EmptyState from "../components/ui/EmptyState.jsx"
import Badge from "../components/ui/Badge.jsx"
import Price from "../components/ui/Price.jsx"
import { buttonVariants } from "../components/ui/buttonVariants.js"
import { cn } from "../lib/utils.js"
import { useCart } from "../context/useCart.js"
import { getCurrentUser } from "../lib/auth.js"
import { fetchOrders, fetchCart, fetchSingleUser, cancelOrder as cancelOrderApi, removeFromCart } from "../lib/api.js"
import { orderStatusMeta, paymentStatusMeta } from "../lib/orders.js"

// Statuses that are no longer "in progress" — delivered (done) or cancelled (refunded).
const FINAL_STATUSES = ["delivered", "cancelled"]
// Same disallowed-for-cancel list as orderController.js's cancelOrder route.
const NON_CANCELLABLE_STATUSES = ["shipped", "delivered", "cancelled"]

const NAV_ITEMS = [
  { key: "overview", label: "Overview" },
  { key: "orders", label: "Orders" },
  { key: "cart", label: "Cart" },
  { key: "account", label: "Account details" },
]

function initials(name) {
  if (!name) return "U"
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

function buildMonthlySpendingSeries(orders, monthsCount = 6) {
  const now = new Date()
  const monthMap = new Map()
  const months = []

  // Generate recent months ending at current month
  for (let i = monthsCount - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    const label = d.toLocaleString("en-US", { month: "short" })
    const fullLabel = `${label} ${d.getFullYear()}`
    months.push({ key, label, fullLabel })
    monthMap.set(key, { spending: 0, orderCount: 0 })
  }

  for (const order of orders) {
    if (order.status === "cancelled") continue
    const d = new Date(order.createdAt)
    if (Number.isNaN(d.getTime())) continue
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    if (monthMap.has(key)) {
      const entry = monthMap.get(key)
      entry.spending += Number(order.totalAmount || 0)
      entry.orderCount += 1
    }
  }

  return months.map(({ key, label, fullLabel }) => {
    const entry = monthMap.get(key) || { spending: 0, orderCount: 0 }
    return {
      key,
      label,
      fullLabel,
      spending: Math.round(entry.spending * 100) / 100,
      orders: entry.orderCount,
    }
  })
}

export default function CustomerDashboard() {
  const navigate = useNavigate()
  const { refreshCart } = useCart()

  const [activeSection, setActiveSection] = useState("overview")
  const [orders, setOrders] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [cartLoading, setCartLoading] = useState(true)
  const [ordersError, setOrdersError] = useState(null)
  const [cartError, setCartError] = useState(null)
  const [cancellingId, setCancellingId] = useState(null)
  const [removingId, setRemovingId] = useState(null)
  const [profile, setProfile] = useState(null)

  const isLoggedIn = Boolean(localStorage.getItem("token"))
  const currentUser = getCurrentUser()

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

    Promise.all([fetchOrders(), fetchCart()])
      .then(([ordersRes, cartRes]) => {
        if (cancelled) return
        setOrders(ordersRes.orders || [])
        setCartItems(cartRes.cart?.CartItems || [])
      })
      .catch((err) => {
        if (cancelled) return
        setOrdersError(err.message)
        setCartError(err.message)
      })
      .finally(() => {
        if (cancelled) return
        setOrdersLoading(false)
        setCartLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [isLoggedIn])

  async function handleCancelOrder(id) {
    setOrdersError(null)
    try {
      setCancellingId(id)
      await cancelOrderApi(id)
      const res = await fetchOrders()
      setOrders(res.orders || [])
      toast.success("Order cancelled")
    } catch (err) {
      setOrdersError(err.message || "Something went wrong. Try again.")
    } finally {
      setCancellingId(null)
    }
  }

  async function handleRemove(cartItemId) {
    setCartError(null)
    try {
      setRemovingId(cartItemId)
      await removeFromCart(cartItemId)
      setCartItems((prev) => prev.filter((item) => item.id !== cartItemId))
      refreshCart()
    } catch (err) {
      setCartError(err.message)
    } finally {
      setRemovingId(null)
    }
  }

  function handleLogout() {
    localStorage.removeItem("token")
    navigate("/signin")
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-cream lg:flex-row">
      {!isLoggedIn && <Navigate to="/signin" replace />}

      {isLoggedIn && (
        <>
          <DashboardSidebar
            navItems={NAV_ITEMS}
            activeKey={activeSection}
            onSelect={setActiveSection}
            username={profile?.username}
            roleLabel="Customer"
            onLogout={handleLogout}
          />

          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
              <section className="min-w-0">
                {activeSection === "overview" && (
                  <Overview
                    orders={orders}
                    cartItems={cartItems}
                    profile={profile}
                    loading={ordersLoading || cartLoading}
                    error={ordersError || cartError}
                    onViewOrders={() => setActiveSection("orders")}
                    onViewCart={() => setActiveSection("cart")}
                    onCancelOrder={handleCancelOrder}
                    cancellingId={cancellingId}
                  />
                )}
                {activeSection === "orders" && (
                  <OrdersSection
                    orders={orders}
                    loading={ordersLoading}
                    error={ordersError}
                    cancellingId={cancellingId}
                    onCancel={handleCancelOrder}
                  />
                )}
                {activeSection === "cart" && (
                  <CartSection
                    items={cartItems}
                    loading={cartLoading}
                    error={cartError}
                    removingId={removingId}
                    onRemove={handleRemove}
                  />
                )}
                {activeSection === "account" && (
                  <AccountDetailsSection />
                )}
              </section>
            </div>
          </main>
        </>
      )}
    </div>
  )
}

/* ============================== Shared bits ============================== */

function SectionHeader({ eyebrow, title, action }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-wider text-navy/50">{eyebrow}</p>
        <h1 className="mt-1 text-3xl text-navy font-display">{title}</h1>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

function ErrorPanel({ message }) {
  return (
    <EmptyState
      title="Something went wrong"
      body={message}
      className="mx-0 max-w-none"
    />
  )
}

function CustomSpendingTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null
  const data = payload[0].payload
  return (
    <div className="rounded-lg border border-navy/15 bg-white p-2.5 shadow-lift font-mono text-xs text-navy">
      <p className="text-[10px] uppercase tracking-wider text-navy/50">{data.fullLabel}</p>
      <div className="mt-1 font-bold text-sm text-ochre-ink">
        <Price value={data.spending} />
      </div>
      <p className="mt-0.5 text-[10px] text-navy/60">
        {data.orders} {data.orders === 1 ? "order" : "orders"}
      </p>
    </div>
  )
}

function CustomPieTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null
  const data = payload[0].payload
  return (
    <div className="rounded-lg border border-navy/15 bg-white p-2 shadow-lift font-mono text-xs text-navy">
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: data.color }} />
        <span className="font-semibold">{data.name}</span>
      </div>
      <p className="mt-1 text-[11px] text-navy/70">
        {data.value} orders ({data.percent}%)
      </p>
    </div>
  )
}

function StatCard({ icon, label, value, valueNode, note, actionLabel, onAction }) {
  return (
    <div className="relative flex flex-col justify-between rounded-xl border border-navy/10 bg-white p-5 shadow-card transition hover:border-navy/20">
      <div>
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-navy/50">
            {label}
          </p>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy/5">
            {icon}
          </div>
        </div>
        <div className="mt-3">
          {valueNode || (
            <p className="font-mono text-2xl font-bold text-navy sm:text-3xl">{value}</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-navy/5 pt-3 text-xs">
        <span className="font-mono text-[11px] text-navy/50">{note}</span>
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="flex items-center gap-1 font-mono text-[11px] font-semibold text-ochre-ink transition hover:text-navy hover:underline"
          >
            {actionLabel}
            <ArrowRightIcon className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  )
}

/* ============================== Overview ============================== */

function Overview({
  orders,
  cartItems,
  profile,
  loading,
  error,
  onViewOrders,
  onViewCart,
  onCancelOrder,
  cancellingId,
}) {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")

  function handleSearchSubmit(e) {
    e.preventDefault()
    if (!search.trim()) return
    navigate(`/product-list?q=${encodeURIComponent(search.trim())}`)
  }

  const stats = useMemo(() => {
    const total = orders.length
    const active = orders.filter((o) => !FINAL_STATUSES.includes(o.status)).length
    const delivered = orders.filter((o) => o.status === "delivered").length
    const cancelled = orders.filter((o) => o.status === "cancelled").length
    const spent = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0)
    const cartCount = cartItems.reduce((n, i) => n + Number(i.quantity || 1), 0)
    const deliveredPercent = total > 0 ? Math.round((delivered / total) * 100) : 0

    return {
      total,
      active,
      delivered,
      cancelled,
      spent,
      cartCount,
      deliveredPercent,
    }
  }, [orders, cartItems])

  const spendingSeries = useMemo(() => buildMonthlySpendingSeries(orders), [orders])
  const totalPeriodSpending = useMemo(
    () => spendingSeries.reduce((acc, pt) => acc + pt.spending, 0),
    [spendingSeries]
  )

  const statusBreakdown = useMemo(() => {
    if (orders.length === 0) return []
    const total = orders.length
    const list = []
    if (stats.delivered > 0) {
      list.push({
        name: "Delivered",
        value: stats.delivered,
        percent: Math.round((stats.delivered / total) * 100),
        color: "#3F6212",
      })
    }
    if (stats.active > 0) {
      list.push({
        name: "In Progress",
        value: stats.active,
        percent: Math.round((stats.active / total) * 100),
        color: "#D97706",
      })
    }
    if (stats.cancelled > 0) {
      list.push({
        name: "Cancelled",
        value: stats.cancelled,
        percent: Math.round((stats.cancelled / total) * 100),
        color: "#C2410C",
      })
    }
    return list
  }, [orders, stats])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="font-mono text-sm text-navy/50">Loading customer overview...</p>
      </div>
    )
  }

  if (error) {
    return <ErrorPanel message={error} />
  }

  return (
    <div className="space-y-8">
      {/* Header bar */}
      <div className="flex flex-col gap-5 rounded-2xl border border-navy/10 bg-white p-5 shadow-card sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-navy sm:text-3xl">
            Hi, {profile?.username || "there"}! Welcome back.
          </h1>
          <p className="mt-1 text-xs text-navy/60 sm:text-sm">
            Track your orders, manage your account, and shop with ease.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search catalog */}
          <form onSubmit={handleSearchSubmit} className="relative min-w-[220px] flex-1 sm:w-64 sm:flex-initial">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-lg border border-navy/15 bg-paper/60 py-2 pl-9 pr-3 text-xs text-navy placeholder:text-navy/40 transition focus:border-ochre focus:bg-white focus:outline-none focus:ring-1 focus:ring-ochre"
            />
          </form>

          {/* Help icon */}
          <Link
            to="/contact"
            title="Help & Support"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-navy/15 bg-paper/60 text-navy transition hover:border-ochre hover:bg-white hover:text-ochre"
          >
            <QuestionMarkCircleIcon className="h-5 w-5" />
          </Link>

          {/* User badge */}
          <div className="flex items-center gap-2.5 rounded-lg border border-navy/10 bg-paper/50 px-3 py-1.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ochre font-mono text-[10px] font-bold text-navy shadow-xs">
              {initials(profile?.username)}
            </span>
            <div className="text-left">
              <p className="max-w-[120px] truncate text-xs font-semibold capitalize text-navy">
                {profile?.username || "Customer"}
              </p>
              <p className="font-mono text-[8px] uppercase tracking-wider text-ochre-ink">
                Customer
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards row (4 cards) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<ShoppingBagIcon className="h-5 w-5 text-ochre" />}
          label="Total Orders"
          value={String(stats.total)}
          note={`${stats.delivered} delivered`}
          actionLabel="View all"
          onAction={onViewOrders}
        />
        <StatCard
          icon={<TruckIcon className="h-5 w-5 text-teal" />}
          label="In Progress"
          value={String(stats.active)}
          note={stats.active > 0 ? "Awaiting delivery" : "All orders fulfilled"}
          actionLabel="Track"
          onAction={onViewOrders}
        />
        <StatCard
          icon={<BanknotesIcon className="h-5 w-5 text-ochre-ink" />}
          label="Total Spent"
          valueNode={<Price value={stats.spent} className="font-mono text-2xl font-bold text-navy sm:text-3xl" />}
          note="Excludes cancelled"
        />
        <StatCard
          icon={<ShoppingCartIcon className="h-5 w-5 text-navy" />}
          label="In Basket"
          value={String(stats.cartCount)}
          note={`${cartItems.length} unique ${cartItems.length === 1 ? "item" : "items"}`}
          actionLabel="Go to cart"
          onAction={onViewCart}
        />
      </div>

      {/* Charts row: Monthly Spending + Order Status Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Monthly spending bar chart (2 cols on lg) */}
        <div className="flex flex-col justify-between rounded-xl border border-navy/10 bg-white p-5 shadow-card lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold font-display text-navy">My Spending</h2>
              <p className="font-mono text-[10px] uppercase tracking-wider text-navy/50">
                Monthly order totals (last 6 months)
              </p>
            </div>
            {totalPeriodSpending > 0 && (
              <div className="rounded-md bg-ochre/10 px-2.5 py-1 text-right">
                <span className="block font-mono text-[9px] uppercase tracking-wider text-navy/50">Period Total</span>
                <Price value={totalPeriodSpending} className="font-mono text-xs font-bold text-ochre-ink" />
              </div>
            )}
          </div>

          {totalPeriodSpending <= 0 ? (
            <div className="flex h-56 flex-col items-center justify-center rounded-lg border border-dashed border-navy/15 bg-paper/30 p-6 text-center">
              <p className="font-mono text-xs text-navy/60">No spending recorded in this period.</p>
              <p className="mt-1 text-[11px] text-navy/40">
                When you place orders, your monthly spending history will chart here.
              </p>
            </div>
          ) : (
            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={spendingSeries} margin={{ top: 10, right: 10, bottom: 0, left: -16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1C1B1914" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: "#1C1B1980", fontFamily: "JetBrains Mono, monospace" }}
                    tickLine={false}
                    axisLine={{ stroke: "#1C1B1920" }}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#1C1B1980", fontFamily: "JetBrains Mono, monospace" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `Rs.${v >= 1000 ? `${Math.round(v / 1000)}k` : v}`}
                    width={58}
                  />
                  <Tooltip content={<CustomSpendingTooltip />} />
                  <Bar
                    dataKey="spending"
                    fill="#D97706"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Right: Order status breakdown donut (1 col on lg) */}
        <div className="flex flex-col justify-between rounded-xl border border-navy/10 bg-white p-5 shadow-card lg:col-span-1">
          <div className="mb-2">
            <h2 className="text-base font-bold font-display text-navy">Order Status</h2>
            <p className="font-mono text-[10px] uppercase tracking-wider text-navy/50">
              Fulfillment distribution
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="flex h-56 flex-col items-center justify-center rounded-lg border border-dashed border-navy/15 bg-paper/30 p-6 text-center">
              <p className="font-mono text-xs text-navy/60">No orders placed yet.</p>
              <p className="mt-1 text-[11px] text-navy/40">Fulfillment rates will appear once you shop.</p>
            </div>
          ) : (
            <>
              <div className="relative flex h-44 items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusBreakdown}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={46}
                      outerRadius={68}
                      paddingAngle={3}
                      stroke="#ffffff"
                      strokeWidth={2}
                    >
                      {statusBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-mono text-xl font-bold text-navy">
                    {stats.deliveredPercent}%
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-navy/50">
                    Delivered
                  </span>
                </div>
              </div>

              <div className="mt-2 space-y-1.5 border-t border-navy/10 pt-3">
                {statusBreakdown.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-navy/70">{item.name}</span>
                    </div>
                    <span className="font-mono font-semibold text-navy">
                      {item.value} <span className="font-normal text-navy/40">({item.percent}%)</span>
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recent orders table */}
      <div className="rounded-xl border border-navy/10 bg-white p-5 shadow-card sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold font-display text-navy">Recent Orders</h2>
            <p className="font-mono text-[10px] uppercase tracking-wider text-navy/50">
              Latest activity on your account
            </p>
          </div>
          {orders.length > 0 && (
            <button
              type="button"
              onClick={onViewOrders}
              className="flex items-center gap-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-ochre-ink transition hover:text-navy"
            >
              View all orders
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {orders.length === 0 ? (
          <EmptyState
            title="No orders yet"
            body="Browse the catalog and place your first order — your order history will show up here."
            action={
              <Link to="/product-list" className={buttonVariants({ variant: "primary", size: "md" })}>
                Browse the catalog
              </Link>
            }
          />
        ) : (
          <>
            {/* Desktop & Tablet Table */}
            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-navy/10 text-[10px] uppercase tracking-wider text-navy/50 font-mono">
                    <th className="pb-3 pr-4 font-semibold">Order ID</th>
                    <th className="pb-3 px-4 font-semibold">Date</th>
                    <th className="pb-3 px-4 font-semibold">Items</th>
                    <th className="pb-3 px-4 font-semibold">Total</th>
                    <th className="pb-3 px-4 font-semibold">Status</th>
                    <th className="pb-3 pl-4 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy/5">
                  {orders.slice(0, 5).map((order) => {
                    const status = orderStatusMeta(order.status)
                    const items = order.OrderItems || []
                    const firstItem = items[0]
                    const extraCount = items.length - 1
                    const isCancellable = !NON_CANCELLABLE_STATUSES.includes(order.status)

                    return (
                      <tr key={order.id} className="transition hover:bg-paper/40">
                        <td className="py-3.5 pr-4 font-mono font-semibold text-navy">
                          #{String(order.id).slice(0, 8)}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-navy/60">
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={
                                firstItem?.Product?.productImages?.[0] ||
                                "https://placehold.co/40x40/F2EEE4/1C1B19?text=D%26S"
                              }
                              alt={firstItem?.Product?.productName || "Product"}
                              className="h-8 w-8 rounded-md object-cover border border-navy/10"
                            />
                            <div className="max-w-[180px] min-w-0">
                              <p className="truncate font-medium text-navy">
                                {firstItem?.Product?.productName || "Product"}
                              </p>
                              {extraCount > 0 && (
                                <p className="font-mono text-[10px] text-navy/50">
                                  +{extraCount} more {extraCount === 1 ? "item" : "items"}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-navy">
                          <Price value={order.totalAmount} />
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge tone={status.tone}>{status.label}</Badge>
                        </td>
                        <td className="py-3.5 pl-4 text-right">
                          {isCancellable ? (
                            <button
                              type="button"
                              onClick={() => onCancelOrder(order.id)}
                              disabled={cancellingId === order.id}
                              className="rounded-sm border border-rust/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-rust transition hover:bg-rust hover:text-white disabled:opacity-50"
                            >
                              {cancellingId === order.id ? "Cancelling..." : "Cancel"}
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={onViewOrders}
                              className="font-mono text-[11px] text-navy/60 hover:text-ochre-ink transition"
                            >
                              Details →
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile card list */}
            <div className="divide-y divide-navy/10 sm:hidden">
              {orders.slice(0, 5).map((order) => {
                const status = orderStatusMeta(order.status)
                const items = order.OrderItems || []
                const firstItem = items[0]
                const extraCount = items.length - 1
                const isCancellable = !NON_CANCELLABLE_STATUSES.includes(order.status)

                return (
                  <div key={order.id} className="py-4 first:pt-0 last:pb-0 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="font-mono text-xs font-bold text-navy">
                          #{String(order.id).slice(0, 8)}
                        </p>
                        <p className="font-mono text-[10px] text-navy/50">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge tone={status.tone}>{status.label}</Badge>
                    </div>

                    <div className="flex items-center gap-3">
                      <img
                        src={
                          firstItem?.Product?.productImages?.[0] ||
                          "https://placehold.co/40x40/F2EEE4/1C1B19?text=D%26S"
                        }
                        alt={firstItem?.Product?.productName || "Product"}
                        className="h-10 w-10 rounded-md object-cover border border-navy/10"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-navy">
                          {firstItem?.Product?.productName || "Product"}
                        </p>
                        {extraCount > 0 && (
                          <p className="font-mono text-[10px] text-navy/50">
                            +{extraCount} more {extraCount === 1 ? "item" : "items"}
                          </p>
                        )}
                        <Price value={order.totalAmount} className="font-mono text-xs font-bold text-ochre-ink" />
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      {isCancellable ? (
                        <button
                          type="button"
                          onClick={() => onCancelOrder(order.id)}
                          disabled={cancellingId === order.id}
                          className="rounded-sm border border-rust/40 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-rust transition hover:bg-rust hover:text-white disabled:opacity-50"
                        >
                          {cancellingId === order.id ? "Cancelling..." : "Cancel order"}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={onViewOrders}
                          className="font-mono text-[11px] text-ochre-ink hover:text-navy transition"
                        >
                          View order details →
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/* ============================== Orders ============================== */

function OrdersSection({ orders, loading, error, cancellingId, onCancel }) {
  return (
    <div>
      <SectionHeader eyebrow="Your account" title="Order history" />

      {loading && <p className="font-mono text-sm text-navy/50">Loading orders...</p>}

      {!loading && error && <ErrorPanel message={error} />}

      {!loading && !error && orders.length === 0 && (
        <EmptyState
          title="You haven't placed any orders yet."
          body="When you do, they'll show up here with live status and cancellation."
          action={
            <Link to="/product-list" className={buttonVariants({ variant: "primary", size: "md" })}>
              Browse the catalog
            </Link>
          }
        />
      )}

      {!loading && !error && orders.length > 0 && (
        <OrderList orders={orders} cancellingId={cancellingId} onCancel={onCancel} />
      )}
    </div>
  )
}

function OrderList({ orders, cancellingId, onCancel, compact }) {
  return (
    <ul className="flex flex-col gap-5">
      {orders.map((order) => {
        const status = orderStatusMeta(order.status)
        const pStatus = paymentStatusMeta(order.paymentStatus)
        const isPendingVerification = order.paymentStatus === "pending_verification"
        const isRejected = order.paymentStatus === "rejected"

        return (
          <li
            key={order.id}
            className="overflow-hidden rounded-xl border border-navy/10 bg-white p-5 shadow-card"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <Badge tone={status.tone}>{status.label}</Badge>
                <Badge tone={pStatus.tone}>{pStatus.label}</Badge>
                <span className="font-mono text-xs text-navy/50">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              {!compact && !NON_CANCELLABLE_STATUSES.includes(order.status) && (
                <button
                  onClick={() => onCancel(order.id)}
                  disabled={cancellingId === order.id}
                  className="rounded-sm border border-rust/40 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-rust transition hover:bg-rust hover:text-cream disabled:opacity-50 cursor-pointer"
                >
                  {cancellingId === order.id ? "Cancelling..." : "Cancel order"}
                </button>
              )}
            </div>

            {/* Pending Verification Notice */}
            {isPendingVerification && (
              <div className="mb-4 rounded-lg border border-ochre/30 bg-ochre/10 p-3 text-xs text-ochre-ink">
                <p className="font-semibold">⏳ Payment Proof Under Review</p>
                <p className="mt-0.5 opacity-90">
                  Admin is manually verifying your payment screenshot. You will receive an email once approved.
                </p>
              </div>
            )}

            {/* Rejection Alert Banner with reason */}
            {isRejected && (
              <div className="mb-4 rounded-lg border border-rust/30 bg-rust/10 p-3 text-xs text-rust">
                <p className="font-bold">❌ Payment Verification Issue</p>
                <p className="mt-1 font-medium bg-white/70 p-2 rounded border border-rust/20">
                  &ldquo;{order.rejectionReason || "Payment screenshot unclear or transaction not located."}&rdquo;
                </p>
                <p className="mt-1 text-[11px] opacity-80">
                  Please review your transaction or contact support to resolve this issue.
                </p>
              </div>
            )}

            <ul className="mb-4 flex flex-col gap-2">
              {(order.OrderItems || []).map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-2 border-b border-navy/10 pb-2 last:border-b-0"
                >
                  <img
                    src={item.Product?.productImages?.[0] || "https://placehold.co/48x48/F2EEE4/1C1B19?text=D%26S"}
                    alt={item.Product?.productName}
                    className="h-10 w-10 rounded-md object-cover border border-navy/10"
                  />
                  <span className="min-w-0 flex-1 truncate text-sm text-navy">
                    {item.Product?.productName || "Deleted product"}
                  </span>
                  <span className="font-mono text-xs text-navy/60">
                    Qty: {item.quantity} × <Price value={item.price} /> ={" "}
                    <Price value={Number(item.price) * item.quantity} />
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center justify-between border-t border-navy/10 pt-3 gap-2">
              <div className="text-xs text-navy/60">
                <span className="font-mono text-[10px] uppercase text-navy/40">Method: </span>
                <span className="font-semibold text-navy">{order.paymentMethod || "Direct"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-navy/40">Order total</span>
                <Price value={order.totalAmount} className="font-mono text-lg font-bold text-ochre-ink" />
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

/* ============================== Cart ============================== */

function CartSection({ items, loading, error, removingId, onRemove }) {
  const runningTotal = items.reduce(
    (sum, item) => sum + Number(item.Product?.price) * item.quantity,
    0
  )
  const itemCount = items.reduce((n, i) => n + i.quantity, 0)

  return (
    <div>
      <SectionHeader eyebrow="Your basket" title="Shopping cart" />

      {loading && <p className="font-mono text-sm text-navy/50">Loading cart...</p>}

      {!loading && error && <ErrorPanel message={error} />}

      {!loading && !error && items.length === 0 && (
        <EmptyState
          title="Your cart is empty."
          body="Add something you love and it'll show up here ready to check out."
          action={
            <Link to="/product-list" className={buttonVariants({ variant: "primary", size: "md" })}>
              Browse the catalog
            </Link>
          }
        />
      )}

      {!loading && !error && items.length > 0 && (
        <>
          <ul className="flex flex-col gap-4">
            {items.map((item) => {
              const product = item.Product
              const lineTotal = Number(product?.price) * item.quantity
              return (
                <li
                  key={item.id}
                  className="rounded-lg border border-navy/10 bg-white p-4 shadow-card"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={product?.productImages?.[0] || "https://placehold.co/96x96/F2EEE4/1C1B19?text=D%26S"}
                      alt={product?.productName}
                      className="h-20 w-20 flex-shrink-0 rounded-md object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-lg text-navy font-display">{product?.productName || "Product"}</p>
                      <p className="mt-1 font-mono text-xs text-navy/60">
                        <Price value={product?.price} /> each · Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="flex-shrink-0">
                      <Price value={lineTotal} className="font-mono text-sm font-semibold text-ochre-ink" />
                    </p>
                  </div>

                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => onRemove(item.id)}
                      disabled={removingId === item.id}
                      className="flex-shrink-0 rounded-sm border border-rust/40 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-rust transition hover:bg-rust hover:text-cream disabled:opacity-50"
                    >
                      {removingId === item.id ? "Removing..." : "Remove"}
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>

          <div className="mt-8 rounded-lg border border-navy/10 bg-white p-5 shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="font-mono text-xs uppercase tracking-wider text-navy/60">
                Total ({itemCount} {itemCount === 1 ? "item" : "items"})
              </p>
              <Price value={runningTotal} className="font-mono text-xl font-semibold text-ochre-ink" />
            </div>
            <Link
              to="/checkout"
              className={cn(buttonVariants({ variant: "primary", size: "lg" }), "mt-4 w-full")}
            >
              Proceed to checkout
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
