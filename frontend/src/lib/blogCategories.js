export const BLOG_CATEGORIES = [
  { value: "all", label: "All Articles" },
  { value: "buying-guides", label: "Buying Guides", description: "In-depth hardware recommendations and buyer checklists." },
  { value: "tech-tips", label: "Tech Tips & Setup", description: "Step-by-step installation guides, maintenance, and IT optimization." },
  { value: "announcements", label: "Announcements", description: "Company updates, store promotions, and service expansion notices." },
  { value: "news", label: "Industry News", description: "Tech hardware trends, computing innovations, and market insights." },
]

export function getBlogCategoryLabel(category) {
  const match = BLOG_CATEGORIES.find((c) => c.value === category)
  return match ? match.label : "Article"
}

export function getBlogCategoryColor(category) {
  switch (category) {
    case "buying-guides":
      return "bg-amber-100 text-amber-900 border-amber-300/60"
    case "tech-tips":
      return "bg-sky-100 text-sky-900 border-sky-300/60"
    case "announcements":
      return "bg-purple-100 text-purple-900 border-purple-300/60"
    case "news":
    default:
      return "bg-emerald-100 text-emerald-900 border-emerald-300/60"
  }
}

export function estimateReadingTime(text) {
  if (!text) return "1 min read"
  const words = text.trim().split(/\s+/).length
  const minutes = Math.ceil(words / 200)
  return `${minutes} min read`
}

export function formatDate(dateString) {
  if (!dateString) return "Recent"
  try {
    const d = new Date(dateString)
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  } catch {
    return "Recent"
  }
}
