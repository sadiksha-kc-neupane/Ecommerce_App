// Shared order-status and payment-status presentation.

export const STATUS_META = {
  pending: { tone: "ochre", label: "Pending" },
  processing: { tone: "navy", label: "Processing" },
  shipped: { tone: "navy", label: "Shipped" },
  delivered: { tone: "moss", label: "Delivered" },
  cancelled: { tone: "rust", label: "Cancelled" },
  payment_rejected: { tone: "rust", label: "Payment Rejected" },
}

export const PAYMENT_STATUS_META = {
  unpaid: { tone: "navy", label: "Unpaid" },
  pending_verification: { tone: "ochre", label: "Verification Pending" },
  paid: { tone: "moss", label: "Paid" },
  rejected: { tone: "rust", label: "Payment Rejected" },
  refunded: { tone: "navy", label: "Refunded" },
}

// Fallback for any unrecognised status value.
export const UNKNOWN_STATUS = { tone: "navy", label: "Unknown" }

export function orderStatusMeta(status) {
  return STATUS_META[status] || { tone: "navy", label: String(status || "Unknown").replace(/_/g, " ") }
}

export function paymentStatusMeta(paymentStatus) {
  return PAYMENT_STATUS_META[paymentStatus] || { tone: "navy", label: String(paymentStatus || "Unpaid").replace(/_/g, " ") }
}

export function orderStatusTone(status) {
  return orderStatusMeta(status).tone
}
