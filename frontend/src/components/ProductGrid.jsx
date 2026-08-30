import { motion } from "framer-motion"
import ProductCard from "./ProductCard.jsx"
import EmptyState from "./ui/EmptyState.jsx"
import { SkeletonCard } from "./ui/Skeleton.jsx"
import { useStaggerVariants } from "../lib/motion.js"

export default function ProductGrid({ products, loading, error, onAddToCart, gridClassName, empty }) {
  const stagger = useStaggerVariants({ count: products?.length })
  const grid = gridClassName || "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
  if (loading) {
    return (
      <div className={grid}>
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <EmptyState title="Couldn't load products" body={error} className="max-w-md" />
    )
  }

  if (!products.length) {
    if (empty) return empty
    return (
      <EmptyState
        title="Nothing on this shelf yet."
        body="Check back soon."
        className="max-w-md"
      />
    )
  }

  return (
    <motion.div
      variants={stagger.container}
      initial="hidden"
      animate="show"
      className={grid}
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={stagger.item}>
          <ProductCard product={product} onAddToCart={onAddToCart} />
        </motion.div>
      ))}
    </motion.div>
  )
}
