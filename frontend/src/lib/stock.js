// Reserve the teal token (and this threshold) for low-stock urgency only.
// Products with stock above 0 and at or below this value are considered low stock.
export const LOW_STOCK_THRESHOLD = 5

export function isLowStock(stock) {
  const qty = Number(stock) || 0
  return qty > 0 && qty <= LOW_STOCK_THRESHOLD
}
