// Central API wrapper -- every page imports from here instead of
// hardcoding fetch() calls and the backend base URL everywhere.

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

function getToken() {
  return localStorage.getItem("token")
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" }
  if (auth) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data.message || "Request failed")
  }
  return data
}

// ---- auth ----
export const registerUser = (payload) => request("/auth/register", { method: "POST", body: payload })
export const loginUser = (payload) => request("/auth/login", { method: "POST", body: payload })
export const forgotPassword = (payload) => request("/auth/forgot-password", { method: "POST", body: payload })
export const verifyOtp = (payload) => request("/auth/verify-otp", { method: "POST", body: payload })
export const resetPassword = (payload) => request("/auth/reset-password", { method: "POST", body: payload })

// ---- products ----
export const fetchProducts = () => request("/fetch-product")
export const fetchSingleProduct = (id) => request(`/fetch-single-product/${id}`)
export const createProduct = (payload) => request("/product", { method: "POST", body: payload, auth: true })
export const updateProduct = (id, payload) => request(`/update-product/${id}`, { method: "PATCH", body: payload, auth: true })
export const deleteProduct = (id) => request(`/delete-product/${id}`, { method: "DELETE", auth: true })

// ---- cart ----
export const fetchCart = () => request("/cart", { auth: true })
export const addToCart = (productId, quantity = 1) =>
  request("/product/add-to-cart", { method: "POST", body: { productId, quantity }, auth: true })
export const removeFromCart = (cartItemId) => request(`/cart/${cartItemId}`, { method: "DELETE", auth: true })
export const updateCartItem = (cartItemId, quantity) =>
  request(`/cart/${cartItemId}`, { method: "PATCH", body: { quantity }, auth: true })

// ---- orders ----
export const fetchOrders = () => request("/orders", { auth: true })
export const fetchSingleOrder = (id) => request(`/orders/${id}`, { auth: true })
export const buyProduct = (payload) => request("/product/buy", { method: "POST", body: payload, auth: true })
export const cancelOrder = (id) => request(`/product/cancel/${id}`, { method: "POST", auth: true })

// ---- seller ----
export const fetchSellerOrders = () => request("/seller/orders", { auth: true })
export const verifyOrderPayment = (id, payload) =>
  request(`/orders/verify-payment/${id}`, { method: "PATCH", body: payload, auth: true })

// ---- users ----
export const fetchUsers = () => request("/fetch-users", { auth: true })
export const fetchSingleUser = (id) => request(`/fetch-single/${id}`, { auth: true })
export const updateUser = (id, payload) => request(`/update-users/${id}`, { method: "PATCH", body: payload, auth: true })