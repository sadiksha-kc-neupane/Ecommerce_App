import { useEffect, useMemo, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import AccountDetailsSection from "../components/AccountDetailsSection.jsx"
import { useCart } from "../context/CartContext.jsx"
import { getCurrentUser } from "../lib/auth.js"
import { fetchOrders, fetchCart, fetchSingleUser, cancelOrder as cancelOrderApi, removeFromCart } from "../lib/api.js"

// Statuses that are no longer "in progress" — delivered (done) or cancelled (refunded).
const FINAL_STATUSES = ["delivered", "cancelled"]
// Same disallowed-for-cancel list as orderController.js's cancelOrder route.
const NON_CANCELLABLE_STATUSES = ["shipped", "delivered", "cancelled"]

const STATUS_STYLES = {
  pending: "bg-ochre/20 text-ochre-ink",
  processing: "bg-navy/10 text-navy",
  shipped: "bg-navy/10 text-navy",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-rust/15 text-rust",
}

const NAV_ITEMS = [
  { key: "overview", label: "Overview" },
  { key: "orders", label: "Orders" },
  { key: "cart", label: "Cart" },
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

    // the decoded token only carries { id, role }, so fetch the real
    // username/email for the sidebar identity block via fetch-single
    // (returns an array; see fetchSingle in userController.js)
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
        <main className="mx-auto flex max-w-6xl gap-8 px-6 py-10">
          {/* ---------- Sidebar ---------- */}
          <aside className="flex w-60 flex-col rounded-md bg-navy p-4 text-cream lg:sticky lg:top-24">
            <div className="mb-6 flex items-center gap-3 rounded-md bg-cream/5 p-3">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-ochre bg-cream/10 font-mono text-sm font-semibold text-ochre">
                {initials(profile?.username)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm capitalize text-cream">{profile?.username || "Customer"}</p>
                <span className="mt-0.5 inline-block rounded-full bg-ochre/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-ochre">
                  Customer
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

/* ============================== Overview ============================== */

function Overview({ orders, loading, error, onViewOrders }) {
  const stats = useMemo(() => {
    const total = orders.length
    const active = orders.filter((o) => !FINAL_STATUSES.includes(o.status)).length
    // Only count non-cancelled orders toward "total spent": cancelled orders
    // are refunded so the money was not actually kept/spent.
    const spent = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0)
    return { total, active, spent }
  }, [orders])

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
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-navy/50">Your account</p>
      <h1 className="mt-1 mb-8 text-3xl text-navy font-display">Overview</h1>

      {orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          body="Browse the catalog and place your first order — your stats will show up here."
          cta="Browse the catalog"
          to="/product-list"
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Orders" value={stats.total} />
            <StatCard label="In progress" value={stats.active} />
            <StatCard label="Total spent" value={`$${stats.spent.toFixed(2)}`} />
          </div>

          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-mono text-[11px] uppercase tracking-widest text-navy/60">
                Recent orders
              </h2>
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

function StatCard({ label, value }) {
  return (
    <div className="rounded-md bg-paper p-5 outline outline-1 -outline-offset-1 outline-navy/15">
      <p className="font-mono text-[10px] uppercase tracking-widest text-navy/50">{label}</p>
      <p className="mt-2 font-mono text-2xl font-semibold text-navy">{value}</p>
    </div>
  )
}

/* ============================== Orders ============================== */

function OrdersSection({ orders, loading, error, cancellingId, onCancel }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-navy/50">Your account</p>
      <h1 className="mt-1 mb-8 text-3xl text-navy font-display">Order history</h1>

      {loading && (
        <p className="font-mono text-sm text-navy/50">Loading orders...</p>
      )}

      {!loading && error && (
        <div className="rounded-md bg-paper p-10 text-center outline outline-1 -outline-offset-1 outline-navy/15">
          <p className="font-mono text-sm text-rust">{error}</p>
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <EmptyState
          title="You haven't placed any orders yet."
          body="When you do, they'll show up here with live status and cancellation."
          cta="Browse the catalog"
          to="/product-list"
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
    <ul className="flex flex-col gap-6">
      {orders.map((order) => (
        <li
          key={order.id}
          className="rounded-md bg-paper p-5 outline outline-1 -outline-offset-1 outline-navy/15"
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-widest ${STATUS_STYLES[order.status] || "bg-navy/10 text-navy"}`}
              >
                {order.status}
              </span>
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
                  src={item.Product?.productImage || "https://placehold.co/48x48/F2EEE4/14213D?text=Bazario"}
                  alt={item.Product?.productName}
                  className="h-10 w-10 rounded-md object-cover"
                />
                <span className="min-w-0 flex-1 truncate text-sm text-navy">
                  {item.Product?.productName || "Deleted product"}
                </span>
                <span className="font-mono text-xs text-navy/60">
                  Qty: {item.quantity} × ${Number(item.price).toFixed(2)} = ${(Number(item.price) * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>

          <p className="text-right font-mono text-lg font-semibold text-ochre-ink">
            Total: ${Number(order.totalAmount).toFixed(2)}
          </p>
        </li>
      ))}
    </ul>
  )
}

/* ============================== Cart ============================== */

function CartSection({ items, loading, error, removingId, onRemove }) {
  const runningTotal = items.reduce(
    (sum, item) => sum + Number(item.Product?.price) * item.quantity,
    0
  )

  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-navy/50">Your basket</p>
      <h1 className="mt-1 mb-8 text-3xl text-navy font-display">Shopping cart</h1>

      {loading && (
        <p className="font-mono text-sm text-navy/50">Loading cart...</p>
      )}

      {!loading && error && (
        <div className="rounded-md bg-paper p-10 text-center outline outline-1 -outline-offset-1 outline-navy/15">
          <p className="font-mono text-sm text-rust">{error}</p>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <EmptyState
          title="Your cart is empty."
          body="Add something you love and it'll show up here ready to check out."
          cta="Browse the catalog"
          to="/product-list"
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
                  className="flex items-center gap-4 rounded-md bg-paper p-4 outline outline-1 -outline-offset-1 outline-navy/15"
                >
                  <img
                    src={product?.productImage || "https://placehold.co/96x96/F2EEE4/14213D?text=Bazario"}
                    alt={product?.productName}
                    className="h-20 w-20 flex-shrink-0 rounded-md object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-lg text-navy font-display">
                      {product?.productName}
                    </p>
                    <p className="mt-1 font-mono text-xs text-navy/60">
                      ${Number(product?.price).toFixed(2)} each · Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="flex-shrink-0 font-mono text-sm font-semibold text-ochre-ink">
                    ${lineTotal.toFixed(2)}
                  </p>

                  <button
                    onClick={() => onRemove(item.id)}
                    disabled={removingId === item.id}
                    className="flex-shrink-0 rounded-sm border border-rust/40 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-rust transition hover:bg-rust hover:text-cream disabled:opacity-50"
                  >
                    {removingId === item.id ? "Removing..." : "Remove"}
                  </button>
                </li>
              )
            })}
          </ul>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-md bg-paper p-5 outline outline-1 -outline-offset-1 outline-navy/15">
            <p className="font-mono text-xs uppercase tracking-widest text-navy/60">
              Total ({items.reduce((n, i) => n + i.quantity, 0)} items)
            </p>
            <p className="font-mono text-xl font-semibold text-ochre-ink">
              ${runningTotal.toFixed(2)}
            </p>
            <Link
              to="/checkout"
              className="rounded-sm bg-ochre px-6 py-3 font-mono text-xs uppercase tracking-widest text-navy transition hover:bg-navy hover:text-cream"
            >
              Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

/* ============================== Shared ============================== */

function EmptyState({ title, body, cta, to }) {
  return (
    <div className="rounded-md bg-paper p-10 text-center outline outline-1 -outline-offset-1 outline-navy/15">
      <p className="text-lg text-navy font-display">{title}</p>
      <p className="mt-2 text-sm text-navy/60">{body}</p>
      <Link
        to={to}
        className="mt-5 inline-block rounded-sm bg-ochre px-6 py-3 font-mono text-xs uppercase tracking-widest text-navy transition hover:bg-navy hover:text-cream"
      >
        {cta}
      </Link>
    </div>
  )
}
