import { useEffect, useState } from "react"
import Navbar from "../components/Navbar.jsx"
import HeroSlider from "./HeroSlider.jsx"
import CategoryFilter from "./CategoryFilter.jsx"
import ProductGrid from "./ProductGrid.jsx"
import TrustBadges from "./TrustBadges.jsx"
import FeaturedRow from "./FeaturedRow.jsx"
import Footer from "../components/Footer.jsx"
import { fetchProducts, addToCart } from "../lib/api.js"
import { useCart } from "../context/CartContext.jsx"
import { toast } from "sonner"

export default function Home() {
  const { refreshCart } = useCart()
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

  async function handleAddToCart(productId) {
    try {
      await addToCart(productId, 1)
      refreshCart()
      toast.success("Added to cart")
    } catch (err) {
      toast.error(err.message.includes("token") ? "Sign in to add items" : err.message)
    }
  }

  const visibleProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory)

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <HeroSlider />
      <CategoryFilter activeCategory={activeCategory} onChange={setActiveCategory} />

      <main>
        {/* featured strip uses the unfiltered fetched list; grid stays filterable */}
        {!loading && !error && (
          <FeaturedRow products={products} onAddToCart={handleAddToCart} />
        )}

        <section className="mt-16 pb-20">
          <div className="mx-auto mb-6 flex max-w-6xl items-end justify-between gap-4 px-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-navy/50">
                The full catalog
              </p>
              <h2
                className="mt-2 text-2xl text-navy sm:text-3xl font-display"
              >
                {activeCategory === "all" ? "Everything in stock" : activeCategory}
              </h2>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-navy/40">
              {visibleProducts.length} {visibleProducts.length === 1 ? "item" : "items"}
            </p>
          </div>

          <ProductGrid
            products={visibleProducts}
            loading={loading}
            error={error}
            onAddToCart={handleAddToCart}
          />
        </section>
      </main>

      <div className="pb-16">
        <TrustBadges />
      </div>
      <Footer />
    </div>
  )
}