import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import Navbar from "../components/Navbar.jsx"
import CategoryFilter from "../components/CategoryFilter.jsx"
import ProductGrid from "../components/ProductGrid.jsx"
import Footer from "../components/Footer.jsx"
import { fetchProducts } from "../lib/api.js"

export default function ProductList() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get("q") || ""

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState("all")

  useEffect(() => {
    fetchProducts()
      .then((res) => setProducts(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const visibleProducts = products.filter((p) => {
    const matchesCategory =
      activeCategory === "all" || p.category === activeCategory
    const matchesQuery = p.productName
      ?.toLowerCase()
      .includes(query.toLowerCase())
    return matchesCategory && matchesQuery
  })

  return (
    <div className="min-h-screen bg-[#F2EEE4]">
      <Navbar />

      <header className="px-6 pt-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#14213D]/50">
          Catalog
        </p>
        <h1
          className="mt-1 text-3xl text-[#14213D]"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          {query ? `Results for "${query}"` : "Browse everything"}
        </h1>
      </header>

      <CategoryFilter activeCategory={activeCategory} onChange={setActiveCategory} />

      <main className="py-6">
        <ProductGrid products={visibleProducts} loading={loading} error={error} />
      </main>

      {!loading && !error && visibleProducts.length === 0 && products.length > 0 && (
        <p className="px-6 pb-10 font-mono text-sm text-[#14213D]/50">
          No matches for this search or category.
        </p>
      )}

      <Footer />
    </div>
  )
}
