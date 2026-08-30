// Shared order-status presentation.
//
// Order statuses come from the backend Order model ENUM:
//   pending | processing | shipped | delivered | cancelled
// Map each to a Badge `tone` (see components/ui/Badge.jsx) plus a short
// human label so every dashboard/confirmation page renders them identically.

export const STATUS_META = {
  pending: { tone: "ochre", label: "Pending" },
  processing: { tone: "navy", label: "Processing" },
  shipped: { tone: "navy", label: "Shipped" },
  delivered: { tone: "moss", label: "Delivered" },
  cancelled: { tone: "rust", label: "Cancelled" },
}

// Fallback for any unrecognised status value.
export const UNKNOWN_STATUS = { tone: "navy", label: "Unknown" }

export function orderStatusMeta(status) {
  return STATUS_META[status] || UNKNOWN_STATUS
}

export function orderStatusTone(status) {
  return orderStatusMeta(status).tone
}
