import { motion } from "framer-motion"
import ProductCard from "./ProductCard.jsx"
import { useStaggerVariants } from "../lib/motion.js"

export default function ProductGrid({ products, loading, error, onAddToCart }) {
  const stagger = useStaggerVariants({ count: products?.length })
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 px-6 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-md bg-cream outline outline-1 -outline-offset-1 outline-navy/10"
          >
            <div className="h-40 rounded-t-md bg-navy/5" />
            <div className="flex flex-col gap-2 p-4">
              <div className="h-2 w-16 rounded-full bg-navy/10" />
              <div className="h-3 w-3/4 rounded-full bg-navy/10" />
              <div className="mt-2 h-4 w-1/3 rounded-full bg-navy/10" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md rounded-md bg-cream p-10 text-center outline outline-1 -outline-offset-1 outline-rust/30">
        <p className="font-mono text-sm text-rust">
          Couldn&apos;t load products: {error}
        </p>
      </div>
    )
  }

  if (!products.length) {
    return (
      <div className="mx-auto max-w-md rounded-md border border-dashed border-navy/25 p-10 text-center">
        <p className="text-navy/60">Nothing on this shelf yet.</p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-navy/40">
          Check back soon
        </p>
      </div>
    )
  }

  return (
    <motion.div
      variants={stagger.container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 gap-4 px-6 sm:grid-cols-3 lg:grid-cols-4"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={stagger.item}>
          <ProductCard product={product} onAddToCart={onAddToCart} />
        </motion.div>
      ))}
    </motion.div>
  )
}
