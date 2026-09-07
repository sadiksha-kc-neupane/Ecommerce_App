// Single source of truth for all currency formatting across the application.
// Uses "en-IN" locale for Nepali/South Asian lakh digit grouping (e.g. Rs. 1,23,456.00).

export function formatCurrency(amount) {
  const num = Number(amount) || 0
  return `Rs. ${num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

// For compact chart axis labels and badges (e.g. "Rs. 14k", "Rs. 500")
export function formatCurrencyCompact(amount) {
  const num = Number(amount) || 0
  if (num >= 1000) {
    return `Rs. ${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)}k`
  }
  return `Rs. ${num.toFixed(0)}`
}
