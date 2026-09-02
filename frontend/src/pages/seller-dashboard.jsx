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
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  TagIcon,
  TruckIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  XMarkIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline"
import { toast } from "sonner"
import AccountDetailsSection from "../components/AccountDetailsSection.jsx"
import UserDashboardProducts from "../components/UserDashboardProducts.jsx"
import DashboardSidebar from "../components/DashboardSidebar.jsx"
import EmptyState from "../components/ui/EmptyState.jsx"
import Badge from "../components/ui/Badge.jsx"
import Price from "../components/ui/Price.jsx"
import { buttonVariants } from "../components/ui/buttonVariants.js"
import { getCurrentUser } from "../lib/auth.js"
import { fetchProducts, fetchSellerOrders, fetchSingleUser, verifyOrderPayment } from "../lib/api.js"
import { orderStatusMeta, paymentStatusMeta } from "../lib/orders.js"
import { isLowStock, LOW_STOCK_THRESHOLD } from "../lib/stock.js"

// Statuses that are no longer "in progress" — delivered (done) or cancelled (refunded).
const FINAL_STATUSES = ["delivered", "cancelled"]

const NAV_ITEMS = [
  { key: "overview", label: "Overview" },
  { key: "listings", label: "Product Inventory" },
  { key: "sales", label: "Orders & Payments" },
  { key: "account", label: "Admin Profile" },
]

function initials(name) {
  if (!name) return "A"
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

function buildMonthlyRevenueSeries(sales, monthsCount = 6) {
  const now = new Date()
  const monthMap = new Map()
  const months = []

  for (let i = monthsCount - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    const label = d.toLocaleDateString("en-US", { month: "short" })
    const fullLabel = d.toLocaleDateString("en-US", { month: "short", year: "numeric" })
    monthMap.set(key, { label, fullLabel, total: 0, orderCount: 0 })
    months.push(key)
  }

  for (const sale of sales) {
    if (FINAL_STATUSES.includes(sale.Order?.status)) continue
    const dateStr = sale.createdAt || sale.Order?.createdAt
    if (!dateStr) continue
    const d = new Date(dateStr)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    if (monthMap.has(key)) {
      const entry = monthMap.get(key)
      entry.total += Number(sale.price || 0) * Number(sale.quantity || 0)
      entry.orderCount += 1
    }
  }

  return months.map((k) => monthMap.get(k))
}

export default function SellerDashboard() {
  const navigate = useNavigate()
  const currentUser = getCurrentUser()
  const isLoggedIn = Boolean(currentUser)

  const [activeSection, setActiveSection] = useState("overview")
  const [sales, setSales] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [profile, setProfile] = useState(null)

  // Payment Verification Modal State
  const [selectedOrderForReview, setSelectedOrderForReview] = useState(null)

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

  async function loadData() {
    try {
      const [salesRes, productsRes] = await Promise.all([fetchSellerOrders(), fetchProducts()])
      setSales(salesRes.orderItems || [])
      setProducts(productsRes.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isLoggedIn) return
    loadData()
  }, [isLoggedIn, currentUser?.id])

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
            roleLabel="Store Admin"
            onLogout={handleLogout}
          />

          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
              <section className="min-w-0">
                {activeSection === "overview" && (
                  <Overview
                    products={products}
                    sales={sales}
                    profile={profile}
                    loading={loading}
                    error={error}
                    onViewListings={() => setActiveSection("listings")}
                    onViewSales={() => setActiveSection("sales")}
                    onReviewPayment={(order) => setSelectedOrderForReview(order)}
                  />
                )}
                {activeSection === "listings" && <ListingsSection />}
                {activeSection === "sales" && (
                  <SalesSection
                    sales={sales}
                    loading={loading}
                    error={error}
                    onReviewPayment={(order) => setSelectedOrderForReview(order)}
                  />
                )}
                {activeSection === "account" && <AccountDetailsSection />}
              </section>
            </div>
          </main>

          {/* Payment Verification Review Modal */}
          {selectedOrderForReview && (
            <PaymentReviewModal
              order={selectedOrderForReview}
              onClose={() => setSelectedOrderForReview(null)}
              onSuccess={() => {
                setSelectedOrderForReview(null)
                loadData()
              }}
            />
          )}
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
  return <EmptyState title="Something went wrong" body={message} className="mx-0 max-w-none" />
}

function CustomRevenueTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null
  const data = payload[0].payload
  return (
    <div className="rounded-lg border border-navy/15 bg-white p-2.5 shadow-lift font-mono text-xs text-navy">
      <p className="text-[10px] uppercase tracking-wider text-navy/50">{data.fullLabel}</p>
      <p className="mt-1 text-sm font-semibold text-ochre-ink">NPR {data.total.toLocaleString()}</p>
      <p className="text-[10px] text-navy/60">{data.orderCount} active sales</p>
    </div>
  )
}

function CustomPieTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null
  const data = payload[0].payload
  return (
    <div className="rounded-lg border border-navy/15 bg-white p-2.5 shadow-lift font-mono text-xs text-navy">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: data.color }} />
        <span className="font-semibold">{data.name}</span>
      </div>
      <p className="mt-1 text-sm font-semibold text-navy">
        {data.value} orders <span className="text-navy/50 font-normal">({data.percent}%)</span>
      </p>
    </div>
  )
}

/* ============================== Payment Review Modal ============================== */

function PaymentReviewModal({ order, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [rejectMode, setRejectMode] = useState(false)
  const [reason, setReason] = useState("")

  const PRESET_REASONS = [
    "Screenshot illegible / blurry",
    "Transferred amount does not match total",
    "Transaction ID not found in bank statement",
    "Invalid payment method used",
  ]

  async function handleApprove() {
    setLoading(true)
    try {
      const res = await verifyOrderPayment(order.id, { action: "approve" })
      toast.success(res.message || "Payment approved & confirmation email sent to customer!")
      onSuccess()
    } catch (err) {
      toast.error(err.message || "Failed to approve payment")
    } finally {
      setLoading(false)
    }
  }

  async function handleReject() {
    if (!reason.trim()) {
      toast.error("Please provide a reason for rejecting the payment")
      return
    }
    setLoading(true)
    try {
      const res = await verifyOrderPayment(order.id, {
        action: "reject",
        reason: reason.trim(),
      })
      toast.success(res.message || "Payment rejected and customer notified via email.")
      onSuccess()
    } catch (err) {
      toast.error(err.message || "Failed to reject payment")
    } finally {
      setLoading(false)
    }
  }

  const pMeta = paymentStatusMeta(order.paymentStatus)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-navy/10 bg-white p-6 shadow-xl sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-navy/40 hover:bg-navy/5 hover:text-navy transition cursor-pointer"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ochre/15 text-ochre-ink font-bold">
            <QrCodeIcon className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-navy">
              Verify Payment Proof
            </h2>
            <p className="font-mono text-xs text-navy/50">
              Order #{String(order.id).slice(0, 8)} · Customer: {order.User?.username || "Buyer"} ({order.User?.email})
            </p>
          </div>
        </div>

        {/* Order & Payment Summary Bar */}
        <div className="mt-6 grid grid-cols-2 gap-3 rounded-xl border border-navy/10 bg-paper/50 p-4 text-xs sm:grid-cols-4">
          <div>
            <span className="font-mono text-[10px] uppercase text-navy/50">Amount:</span>
            <p className="font-mono font-bold text-ochre-ink text-sm">
              <Price value={order.totalAmount} />
            </p>
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase text-navy/50">Payment Method:</span>
            <p className="font-semibold text-navy truncate">{order.paymentMethod || "Direct QR"}</p>
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase text-navy/50">Status:</span>
            <p className="mt-0.5">
              <Badge tone={pMeta.tone}>{pMeta.label}</Badge>
            </p>
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase text-navy/50">Delivery Address:</span>
            <p className="text-navy truncate">{order.address || "Standard"}</p>
          </div>
        </div>

        {/* Screenshot Image Viewer */}
        <div className="mt-6">
          <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-navy/70 mb-2">
            Customer Uploaded Payment Receipt:
          </label>
          {order.paymentScreenshot ? (
            <div className="rounded-xl border border-navy/15 bg-neutral-900 p-2 flex items-center justify-center overflow-hidden">
              <img
                src={order.paymentScreenshot}
                alt="Payment proof receipt"
                className="max-h-80 w-auto rounded-lg object-contain"
              />
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-navy/20 p-8 text-center text-xs text-navy/50">
              No screenshot attached by buyer.
            </div>
          )}
        </div>

        {/* Rejection Mode View */}
        {rejectMode ? (
          <div className="mt-6 rounded-xl border border-rust/30 bg-rust/5 p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rust font-mono">
              Specify Rejection Reason (Sent to Customer)
            </h3>
            <div className="flex flex-wrap gap-2">
              {PRESET_REASONS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setReason(preset)}
                  className="rounded-lg border border-rust/30 bg-white px-2.5 py-1 text-[11px] text-rust hover:bg-rust hover:text-white transition cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain what is wrong with the payment or screenshot..."
              className="w-full rounded-lg border border-rust/40 bg-white p-3 text-xs text-navy outline-none focus:ring-2 focus:ring-rust/30"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectMode(false)}
                className="rounded-lg border border-navy/20 px-3 py-2 text-xs text-navy hover:bg-navy/5 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading || !reason.trim()}
                onClick={handleReject}
                className="rounded-lg bg-rust px-4 py-2 text-xs font-bold text-white hover:bg-rust/90 transition cursor-pointer disabled:opacity-50"
              >
                {loading ? "Rejecting..." : "Confirm Rejection & Send Email"}
              </button>
            </div>
          </div>
        ) : (
          /* Normal Action Buttons */
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setRejectMode(true)}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-rust/40 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-rust hover:bg-rust hover:text-white transition cursor-pointer"
            >
              <XCircleIcon className="h-4 w-4" />
              Reject Payment
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={handleApprove}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-moss px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-white hover:bg-moss/90 transition shadow-sm cursor-pointer disabled:opacity-50"
            >
              <CheckCircleIcon className="h-4 w-4" />
              {loading ? "Approving..." : "Accept & Approve Payment"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ============================== Overview ============================== */

function Overview({ products, sales, profile, loading, error, onViewListings, onViewSales, onReviewPayment }) {
  const stats = useMemo(() => {
    let totalRevenue = 0
    let activeRevenue = 0
    let inProgressCount = 0
    let deliveredCount = 0
    let pendingApprovalCount = 0

    for (const sale of sales) {
      const saleTotal = Number(sale.price || 0) * Number(sale.quantity || 0)
      totalRevenue += saleTotal
      const isFinal = FINAL_STATUSES.includes(sale.Order?.status)
      if (!isFinal) activeRevenue += saleTotal
      if (sale.Order?.status === "delivered") deliveredCount += 1
      else if (!isFinal) inProgressCount += 1

      if (sale.Order?.paymentStatus === "pending_verification") {
        pendingApprovalCount += 1
      }
    }

    const lowStockCount = products.filter((p) => isLowStock(p.stock)).length
    const deliveredPercent = sales.length ? Math.round((deliveredCount / sales.length) * 100) : 0

    return {
      totalRevenue,
      activeRevenue,
      inProgressCount,
      deliveredCount,
      pendingApprovalCount,
      lowStockCount,
      deliveredPercent,
      listingsCount: products.length,
      ordersCount: sales.length,
    }
  }, [products, sales])

  const revenueSeries = useMemo(() => buildMonthlyRevenueSeries(sales, 6), [sales])

  const statusBreakdown = useMemo(() => {
    if (!sales.length) return []
    const counts = { pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 }
    for (const s of sales) {
      const st = s.Order?.status || "pending"
      if (counts[st] !== undefined) counts[st] += 1
      else counts.pending += 1
    }
    const colors = {
      pending: "#D97706",
      processing: "#1C1B19",
      shipped: "#0F766E",
      delivered: "#3F6212",
      cancelled: "#C2410C",
    }
    return Object.entries(counts)
      .filter(([, val]) => val > 0)
      .map(([key, value]) => ({
        name: orderStatusMeta(key).label,
        value,
        percent: Math.round((value / sales.length) * 100),
        color: colors[key] || "#1C1B19",
      }))
  }, [sales])

  const productMap = useMemo(() => {
    const map = new Map()
    for (const p of products) map.set(p.id, p)
    return map
  }, [products])

  return (
    <div>
      <SectionHeader eyebrow="Seller workspace" title="Overview" />

      {loading && (
        <div className="flex h-64 items-center justify-center">
          <p className="font-mono text-sm text-navy/50">Loading dashboard...</p>
        </div>
      )}

      {!loading && error && <ErrorPanel message={error} />}

      {!loading && !error && (
        <div className="space-y-8">
          {/* Top greeting / Pending Alert Banner */}
          {stats.pendingApprovalCount > 0 && (
            <div className="rounded-2xl border border-ochre/40 bg-ochre/10 p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ochre text-navy font-bold">
                  <QrCodeIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-navy font-display text-sm">
                    {stats.pendingApprovalCount} Payment Proof(s) Awaiting Review
                  </h3>
                  <p className="text-xs text-navy/70">
                    Customers have submitted QR payment screenshots. Review and approve them to process orders.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onViewSales}
                className="rounded-xl bg-ochre px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-navy hover:bg-navy hover:text-white transition cursor-pointer"
              >
                Review Now
              </button>
            </div>
          )}

          {/* Metric cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-navy/10 bg-white p-5 shadow-card">
              <span className="font-mono text-[10px] uppercase tracking-wider text-navy/50">
                Active Revenue
              </span>
              <p className="mt-2 text-2xl font-bold font-mono text-navy">
                <Price value={stats.activeRevenue} />
              </p>
              <p className="mt-1 font-mono text-[10px] text-navy/40">In-progress orders</p>
            </div>

            <div className="rounded-xl border border-navy/10 bg-white p-5 shadow-card">
              <span className="font-mono text-[10px] uppercase tracking-wider text-navy/50">
                Total Orders
              </span>
              <p className="mt-2 text-2xl font-bold font-mono text-navy">{stats.ordersCount}</p>
              <p className="mt-1 font-mono text-[10px] text-navy/40">
                {stats.deliveredCount} delivered ({stats.deliveredPercent}%)
              </p>
            </div>

            <div className="rounded-xl border border-navy/10 bg-white p-5 shadow-card">
              <span className="font-mono text-[10px] uppercase tracking-wider text-navy/50">
                My Listings
              </span>
              <p className="mt-2 text-2xl font-bold font-mono text-navy">{stats.listingsCount}</p>
              <p className="mt-1 font-mono text-[10px] text-navy/40">
                {stats.lowStockCount > 0 ? (
                  <span className="text-ochre-ink font-semibold">{stats.lowStockCount} low on stock</span>
                ) : (
                  "All products in stock"
                )}
              </p>
            </div>

            <div className="rounded-xl border border-navy/10 bg-white p-5 shadow-card">
              <span className="font-mono text-[10px] uppercase tracking-wider text-navy/50">
                Lifetime Sales
              </span>
              <p className="mt-2 text-2xl font-bold font-mono text-ochre-ink">
                <Price value={stats.totalRevenue} />
              </p>
              <p className="mt-1 font-mono text-[10px] text-navy/40">Across all orders</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Revenue Bar Chart */}
            <div className="rounded-xl border border-navy/10 bg-white p-5 shadow-card lg:col-span-2">
              <h2 className="text-base font-bold font-display text-navy">Revenue Trend</h2>
              <p className="font-mono text-[10px] uppercase tracking-wider text-navy/50">
                Last 6 months
              </p>
              <div className="mt-4 h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="label" stroke="#6B7280" fontSize={11} tickLine={false} />
                    <YAxis stroke="#6B7280" fontSize={11} tickLine={false} />
                    <Tooltip content={<CustomRevenueTooltip />} />
                    <Bar dataKey="total" fill="#D97706" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Status Pie Chart */}
            <div className="rounded-xl border border-navy/10 bg-white p-5 shadow-card">
              <h2 className="text-base font-bold font-display text-navy">Order Statuses</h2>
              <p className="font-mono text-[10px] uppercase tracking-wider text-navy/50">
                Fulfillment progress
              </p>
              <div className="relative mt-4 h-56 w-full">
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
              </div>
            </div>
          </div>

          {/* Recent Sales with Payment Proof column */}
          <div className="rounded-xl border border-navy/10 bg-white p-5 shadow-card sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold font-display text-navy">Recent Orders &amp; Payments</h2>
                <p className="font-mono text-[10px] uppercase tracking-wider text-navy/50">
                  Latest customer orders with verification status
                </p>
              </div>
              {sales.length > 0 && (
                <button
                  type="button"
                  onClick={onViewSales}
                  className="flex items-center gap-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-ochre-ink transition hover:text-navy cursor-pointer"
                >
                  View all sales
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {sales.length === 0 ? (
              <EmptyState
                title="No sales yet"
                body="When customers purchase your listings, orders will appear here."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-navy/10 text-[10px] uppercase tracking-wider text-navy/50 font-mono">
                      <th className="pb-3 pr-4 font-semibold">Order ID</th>
                      <th className="pb-3 px-4 font-semibold">Product</th>
                      <th className="pb-3 px-4 font-semibold">Total</th>
                      <th className="pb-3 px-4 font-semibold">Payment Status</th>
                      <th className="pb-3 pl-4 text-right font-semibold">Payment Proof</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy/5">
                    {sales.slice(0, 5).map((sale) => {
                      const pStatus = paymentStatusMeta(sale.Order?.paymentStatus)
                      const productObj = productMap.get(sale.productId)
                      const productImage =
                        productObj?.productImages?.[0] ||
                        "https://placehold.co/40x40/F2EEE4/1C1B19?text=D%26S"
                      const saleTotal = Number(sale.price || 0) * Number(sale.quantity || 0)
                      const hasProof = Boolean(sale.Order?.paymentScreenshot)

                      return (
                        <tr key={sale.id} className="transition hover:bg-paper/40">
                          <td className="py-3.5 pr-4 font-mono font-semibold text-navy">
                            #{String(sale.Order?.id || sale.id).slice(0, 8)}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={productImage}
                                alt={sale.Product?.productName || "Product"}
                                className="h-8 w-8 rounded-md object-cover border border-navy/10"
                              />
                              <div className="max-w-[180px] min-w-0">
                                <p className="truncate font-medium text-navy">
                                  {sale.Product?.productName || "Product"}
                                </p>
                                <p className="font-mono text-[10px] text-navy/50">Qty {sale.quantity}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-semibold text-navy">
                            <Price value={saleTotal} />
                          </td>
                          <td className="py-3.5 px-4">
                            <Badge tone={pStatus.tone}>{pStatus.label}</Badge>
                          </td>
                          <td className="py-3.5 pl-4 text-right">
                            {hasProof ? (
                              <button
                                type="button"
                                onClick={() => onReviewPayment(sale.Order)}
                                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-mono text-[11px] font-semibold transition cursor-pointer ${
                                  sale.Order?.paymentStatus === "pending_verification"
                                    ? "bg-ochre text-navy hover:bg-navy hover:text-white"
                                    : "border border-navy/20 bg-white text-navy hover:border-ochre hover:text-ochre-ink"
                                }`}
                              >
                                <EyeIcon className="h-3.5 w-3.5" />
                                {sale.Order?.paymentStatus === "pending_verification"
                                  ? "Verify Proof"
                                  : "View Proof"}
                              </button>
                            ) : (
                              <span className="font-mono text-[10px] text-navy/40">No Proof</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
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

/* ============================== Sales & Payments ============================== */

function SalesSection({ sales, loading, error, onReviewPayment }) {
  return (
    <div>
      <SectionHeader eyebrow="Seller workspace" title="Sales &amp; Payment Verifications" />

      {loading && (
        <div className="flex h-64 items-center justify-center">
          <p className="font-mono text-sm text-navy/50">Loading sales...</p>
        </div>
      )}

      {!loading && error && <ErrorPanel message={error} />}

      {!loading && !error && sales.length === 0 && (
        <EmptyState
          title="No sales yet"
          body="When customers order your products they'll appear here."
          className="mx-0 max-w-none"
        />
      )}

      {!loading && !error && sales.length > 0 && (
        <div className="rounded-xl border border-navy/10 bg-white p-5 shadow-card sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-mono text-[11px] uppercase tracking-wider text-navy/60">
              Customer Orders &amp; Payment Proofs
            </h2>
            <span className="font-mono text-xs text-navy/50">{sales.length} total orders</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-navy/10 text-[10px] uppercase tracking-wider text-navy/50 font-mono">
                  <th className="pb-3 pr-4 font-semibold">Order ID</th>
                  <th className="pb-3 px-4 font-semibold">Date</th>
                  <th className="pb-3 px-4 font-semibold">Product</th>
                  <th className="pb-3 px-4 font-semibold">Total Amount</th>
                  <th className="pb-3 px-4 font-semibold">Payment Status</th>
                  <th className="pb-3 pl-4 text-right font-semibold">Review Proof</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/5">
                {sales.map((sale) => {
                  const pStatus = paymentStatusMeta(sale.Order?.paymentStatus)
                  const hasProof = Boolean(sale.Order?.paymentScreenshot)

                  return (
                    <tr key={sale.id} className="transition hover:bg-paper/40">
                      <td className="py-3.5 pr-4 font-mono font-semibold text-navy">
                        #{String(sale.Order?.id || sale.id).slice(0, 8)}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-navy/60">
                        {new Date(sale.createdAt || sale.Order?.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-navy truncate max-w-[200px]">
                          {sale.Product?.productName || "Product"}
                        </p>
                        <p className="font-mono text-[10px] text-navy/50">Qty {sale.quantity}</p>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-navy">
                        <Price value={Number(sale.price || 0) * Number(sale.quantity || 0)} />
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge tone={pStatus.tone}>{pStatus.label}</Badge>
                      </td>
                      <td className="py-3.5 pl-4 text-right">
                        {hasProof ? (
                          <button
                            type="button"
                            onClick={() => onReviewPayment(sale.Order)}
                            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-[11px] font-semibold transition cursor-pointer ${
                              sale.Order?.paymentStatus === "pending_verification"
                                ? "bg-ochre text-navy hover:bg-navy hover:text-white"
                                : "border border-navy/20 bg-white text-navy hover:border-ochre hover:text-ochre-ink"
                            }`}
                          >
                            <EyeIcon className="h-3.5 w-3.5" />
                            {sale.Order?.paymentStatus === "pending_verification"
                              ? "Verify Proof"
                              : "View Proof"}
                          </button>
                        ) : (
                          <span className="font-mono text-[10px] text-navy/40">COD / Cash</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
