import { useEffect, useMemo, useState } from "react"
import Navbar from "../components/Navbar.jsx"
import HeroSlider from "./HeroSlider.jsx"
import ProductGrid from "./ProductGrid.jsx"
import TrustBadges from "./TrustBadges.jsx"
import FeaturedRow from "./FeaturedRow.jsx"
import Footer from "../components/Footer.jsx"
import { fetchProducts, addToCart } from "../lib/api.js"
import { useCart } from "../context/useCart.js"
import { toast } from "sonner"
import WhyUs from "./WhyUs.jsx"
import CategoryGrid from "./home/CategoryGrid.jsx"
import HomeCTA from "./home/HomeCTA.jsx"
import SectionHeading from "./ui/SectionHeading.jsx"

export default function Home() {
  const { refreshCart } = useCart()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProducts()
      .then((res) => setProducts(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  async function handleAddToCart(productId) {
    try {
      await addToCart(productId, 1)
      refreshCart()
      toast.success("Added to cart")
    } catch (err) {
      toast.error(err.message.includes("token") ? "Sign in to add items" : err.message)
    }
  }

  // real per-category counts for the category tiles
  const categoryCounts = useMemo(() => {
    const counts = {}
    for (const p of products) counts[p.category] = (counts[p.category] || 0) + 1
    return counts
  }, [products])

  // real products shown under "Popular right now": in-stock first, capped at 8
  const popular = useMemo(() => {
    const inStock = [...products].sort(
      (a, b) => (Number(b.stock) > 0) - (Number(a.stock) > 0)
    )
    return inStock.slice(0, 8)
  }, [products])

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <HeroSlider />

      <main>
        <CategoryGrid counts={categoryCounts} />

        {!loading && !error && (
          <FeaturedRow products={products} onAddToCart={handleAddToCart} />
        )}

        {/* why choose / trust */}
        <div className="py-16 sm:py-20">
          <TrustBadges />
        </div>
        <WhyUs />

        {/* curated / popular row */}
        {!loading && !error && popular.length > 0 && (
          <section className="py-16 sm:py-20">
            <div className="mx-auto max-w-6xl px-6">
              <SectionHeading
                eyebrow="Popular right now"
                title="In stock & ready to ship"
              />
              <div className="mt-8">
                <ProductGrid products={popular} loading={loading} error={error} onAddToCart={handleAddToCart} />
              </div>
            </div>
          </section>
        )}
      </main>

      <HomeCTA />
      <Footer />
    </div>
  )
}
