import { useEffect, useState } from "react"
import Navbar from "../components/Navbar.jsx"
import HeroSlider from "./HeroSlider.jsx"
import CategoryFilter from "./CategoryFilter.jsx"
import ProductGrid from "./ProductGrid.jsx"
import TrustBadges from "./TrustBadges.jsx"
import Footer from "../components/Footer.jsx"
import { fetchProducts, addToCart } from "../lib/api.js"
import { useCart } from "../context/CartContext.jsx"

export default function Home() {
  const { refreshCart } = useCart()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState("all")
  const [toast, setToast] = useState(null)

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
      setToast("Added to cart")
      setTimeout(() => setToast(null), 2000)
    } catch (err) {
      setToast(err.message.includes("token") ? "Sign in to add items" : err.message)
      setTimeout(() => setToast(null), 2500)
    }
  }

  const visibleProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory)

  return (
    <div className="min-h-screen bg-[#F2EEE4]">
      <Navbar />
      <HeroSlider />
      <CategoryFilter activeCategory={activeCategory} onChange={setActiveCategory} />

      <main className="py-6">
        <ProductGrid
          products={visibleProducts}
          loading={loading}
          error={error}
          onAddToCart={handleAddToCart}
        />
      </main>

      <TrustBadges />
      <Footer />

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-sm bg-[#14213D] px-5 py-3 font-mono text-xs uppercase tracking-widest text-[#FBF7F0] shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}