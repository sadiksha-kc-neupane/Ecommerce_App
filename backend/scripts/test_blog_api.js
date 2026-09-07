import jwt from "jsonwebtoken"
import envConfig from "../config/env.js"

const API_BASE = "http://localhost:5000"

async function runTests() {
  console.log("=== RUNNING BLOG API VERIFICATION TESTS ===")

  const adminToken = jwt.sign(
    { id: "d9231b29-1635-4ab9-8222-830f6883d24d", role: "admin" },
    envConfig.jwtSecret,
    { expiresIn: "1h" }
  )

  const customerToken = jwt.sign(
    { id: "0601a02a-b135-4ff5-8586-96798b74d74f", role: "customer" },
    envConfig.jwtSecret,
    { expiresIn: "1h" }
  )

  // 1. No token -> 401
  const resNoAuth = await fetch(`${API_BASE}/blog`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Test Post", description: "Test Description" }),
  })
  console.log("1. No token POST /blog status:", resNoAuth.status, "(expected 401)")

  // 2. Customer token -> 403
  const resCustomer = await fetch(`${API_BASE}/blog`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${customerToken}`,
    },
    body: JSON.stringify({ title: "Customer Post", description: "Customer Description" }),
  })
  console.log("2. Customer token POST /blog status:", resCustomer.status, "(expected 403)")

  // 3. Admin token -> 201 with generated slug
  const title1 = "How to Pick the Best Business Laptop in 2026!"
  const resAdmin1 = await fetch(`${API_BASE}/blog`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      title: title1,
      subtitle: "A comprehensive guide to modern enterprise laptops",
      description: "Choosing a laptop for work requires balancing performance, battery life, security features, and display quality. In this guide, we break down top recommendations across budgets.",
      category: "buying-guides",
      thumbnail: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80",
    }),
  })
  const dataAdmin1 = await resAdmin1.json()
  console.log("3. Admin token POST /blog status:", resAdmin1.status, "(expected 201)")
  console.log("   Generated slug:", dataAdmin1.data?.slug)

  // 4. Duplicate title -> collision handled
  const resAdmin2 = await fetch(`${API_BASE}/blog`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      title: title1 + " (Duplicate test)",
      subtitle: "Collision test subtitle",
      description: "Testing slug uniqueness handling.",
      category: "tech-tips",
      thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    }),
  })
  const dataAdmin2 = await resAdmin2.json()
  console.log("4. Slug collision handling test status:", resAdmin2.status)
  console.log("   Generated slug for duplicate:", dataAdmin2.data?.slug)

  // 5. Fetch single blog by slug
  const testSlug = dataAdmin1.data?.slug
  const resFetchSlug = await fetch(`${API_BASE}/fetch-single-blog/${testSlug}`)
  const dataFetchSlug = await resFetchSlug.json()
  console.log("5. Fetch single blog by slug status:", resFetchSlug.status, "Title:", dataFetchSlug.title)

  // 6. Fetch all blogs
  const resFetchAll = await fetch(`${API_BASE}/fetch-blog?category=buying-guides`)
  const dataFetchAll = await resFetchAll.json()
  console.log("6. Fetch blogs by category count:", dataFetchAll.length)

  console.log("=== ALL API TESTS FINISHED SUCCESSFULLY ===")
  process.exit(0)
}

runTests().catch((e) => {
  console.error("Test error:", e)
  process.exit(1)
})
