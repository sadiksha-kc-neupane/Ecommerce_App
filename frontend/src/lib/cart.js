// Centralized cart/order-line math shared by the cart and checkout pages and
// the OrderSummary component. Keeps subtotal/total calculations in one place.

export function calcTotals(items) {
  const subtotal = (items || []).reduce(
    (sum, it) => sum + Number(it.price) * Number(it.quantity),
    0
  )
  const count = (items || []).reduce((n, it) => n + Number(it.quantity), 0)
  const total = subtotal // no taxes/shipping/discounts are modeled in this app
  return { subtotal, total, count }
}

// Map a CartItem (with nested Product) into the normalized order-line shape
// consumed by OrderSummary. Shared by the cart and checkout pages.
export function toLine(item) {
  const p = item.Product || {}
  return {
    id: item.id,
    name: p.productName || "Product",
    price: Number(p.price),
    quantity: Number(item.quantity),
    image: p.productImages?.[0],
    stock: Number(p.stock) || 0,
    productId: p.id,
  }
}
