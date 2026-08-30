import { useEffect, useMemo, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import AccountDetailsSection from "../components/AccountDetailsSection.jsx"
import DashboardSidebar from "../components/DashboardSidebar.jsx"
import EmptyState from "../components/ui/EmptyState.jsx"
import Badge from "../components/ui/Badge.jsx"
import Price from "../components/ui/Price.jsx"
import { buttonVariants } from "../components/ui/Button.jsx"
import { cn } from "../lib/utils.js"
import { useCart } from "../context/CartContext.jsx"
import { getCurrentUser } from "../lib/auth.js"
import { fetchOrders, fetchCart, fetchSingleUser, cancelOrder as cancelOrderApi, removeFromCart } from "../lib/api.js"
import { orderStatusMeta } from "../lib/orders.js"

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
            roleLabel="Customer"
            onLogout={handleLogout}
          />

          <section className="min-w-0 flex-1">
            {activeSection === "overview" && (
              <Overview
                orders={orders}
                loading={ordersLoading}
                error={ordersError}
                onViewOrders={() => setActiveSection("orders")}
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
  return (
    <EmptyState
      title="Something went wrong"
      body={message}
      className="mx-0 max-w-none"
    />
  )
}

/* ============================== Overview ============================== */

function Overview({ orders, loading, error, onViewOrders }) {
  const stats = useMemo(() => {
    const total = orders.length
    const active = orders.filter((o) => !FINAL_STATUSES.includes(o.status)).length
    const spent = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0)
    return { total, active, spent }
  }, [orders])

  if (loading) {
    return <p className="font-mono text-sm text-navy/50">Loading your overview...</p>
  }

  if (error) {
    return <ErrorPanel message={error} />
  }

  return (
    <div>
      <SectionHeader eyebrow="Your account" title="Overview" />

      {orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          body="Browse the catalog and place your first order — your stats will show up here."
          action={
            <Link to="/product-list" className={buttonVariants({ variant: "primary", size: "md" })}>
              Browse the catalog
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Orders" value={String(stats.total)} />
            <StatCard label="In progress" value={String(stats.active)} />
            <StatCard label="Total spent">
              <Price value={stats.spent} className="font-mono text-2xl font-semibold text-navy" />
            </StatCard>
          </div>

          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-mono text-[11px] uppercase tracking-widest text-navy/60">Recent orders</h2>
              <button
                type="button"
                onClick={onViewOrders}
                className="font-mono text-[10px] uppercase tracking-widest text-ochre-ink transition hover:text-navy"
              >
                View all
              </button>
            </div>
            <OrderList orders={orders.slice(0, 3)} onCancel={onViewOrders} compact />
          </div>
        </>
      )}
    </div>
  )
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
        return (
          <li
            key={order.id}
            className="overflow-hidden rounded-lg border border-navy/10 bg-white p-5 shadow-card"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone={status.tone}>{status.label}</Badge>
                <span className="font-mono text-xs text-navy/50">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              {!compact && !NON_CANCELLABLE_STATUSES.includes(order.status) && (
                <button
                  onClick={() => onCancel(order.id)}
                  disabled={cancellingId === order.id}
                  className="rounded-sm border border-rust/40 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-rust transition hover:bg-rust hover:text-cream disabled:opacity-50"
                >
                  {cancellingId === order.id ? "Cancelling..." : "Cancel order"}
                </button>
              )}
            </div>

            <ul className="mb-4 flex flex-col gap-2">
              {(order.OrderItems || []).map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-2 border-b border-navy/10 pb-2 last:border-b-0"
                >
                  <img
                    src={item.Product?.productImages?.[0] || "https://placehold.co/48x48/F2EEE4/1C1B19?text=D&S"}
                    alt={item.Product?.productName}
                    className="h-10 w-10 rounded-md object-cover"
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

            <div className="flex items-center justify-between border-t border-navy/10 pt-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-navy/40">Order total</span>
              <Price value={order.totalAmount} className="font-mono text-lg font-semibold text-ochre-ink" />
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
                      src={product?.productImages?.[0] || "https://placehold.co/96x96/F2EEE4/1C1B19?text=D&S"}
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
                      className="flex-shrink-0 rounded-sm border border-rust/40 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-rust transition hover:bg-rust hover:text-cream disabled:opacity-50"
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
              <p className="font-mono text-xs uppercase tracking-widest text-navy/60">
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
