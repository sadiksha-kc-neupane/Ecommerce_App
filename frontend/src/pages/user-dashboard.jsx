import { useEffect, useState } from 'react'
import Navbar from '../components/navbar'
import { Link } from 'react-router-dom'
import UserDashboardProducts from '../components/UserDashboardProducts'
import { fetchOrders, cancelOrder as cancelOrderApi } from '../lib/api.js'

const NON_CANCELLABLE_STATUSES = ["shipped", "delivered", "cancelled"]

const Userdashboard = () => {
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [ordersError, setOrdersError] = useState("")

  async function loadOrders() {
    try {
      setOrdersLoading(true)
      setOrdersError("")
      const data = await fetchOrders()
      setOrders(data.orders || [])
    } catch (error) {
      setOrdersError(error.message || "Failed to load orders.")
    } finally {
      setOrdersLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  async function handleCancelOrder(id) {
    try {
      await cancelOrderApi(id)
      loadOrders()
    } catch (error) {
      alert(error.message || "Something went wrong. Try again.")
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow-sm">
          <h1 className="mb-6 text-3xl font-semibold text-slate-900">User Dashboard</h1>
          <p className="mb-8 text-slate-600">Welcome back! Use the button below to create a new product.</p>
          <Link
            to="/create-Product"
            className="inline-flex rounded-md bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700"
          >
            Create New Product
          </Link>
        </div>
        <UserDashboardProducts/>

        <section className="mx-auto mt-8 max-w-4xl rounded-xl bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-semibold text-slate-900">My Orders</h2>

          {ordersLoading && (
            <p className="text-slate-500">Loading orders…</p>
          )}

          {!ordersLoading && ordersError && (
            <p className="text-red-600">{ordersError}</p>
          )}

          {!ordersLoading && !ordersError && orders.length === 0 && (
            <p className="text-slate-500">
              You haven&apos;t placed any orders yet. Browse the product list above to get started.
            </p>
          )}

          <div className="flex flex-col gap-6">
            {orders.map((order) => {
              const canCancel = !NON_CANCELLABLE_STATUSES.includes(order.status)
              return (
                <div
                  key={order.id}
                  className="rounded-lg border border-slate-200 p-5 shadow-sm"
                >
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium capitalize ${
                        order.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : order.status === "delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "shipped"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status}
                    </span>
                    {canCancel && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="rounded-md bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>

                  <ul className="mb-4 flex flex-col gap-2">
                    {(order.OrderItems || []).map((item) => (
                      <li
                        key={item.id}
                        className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2 text-slate-700 last:border-b-0"
                      >
                        <span className="font-medium">{item.Product?.productName}</span>
                        <span className="text-sm">
                          Qty: {item.quantity} × ${item.price} = ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <p className="text-right text-lg font-bold text-slate-900">
                    Total: ${Number(order.totalAmount).toFixed(2)}
                  </p>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </>
  )
}

export default Userdashboard
