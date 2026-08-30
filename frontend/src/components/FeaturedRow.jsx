import { motion } from "framer-motion"
import ProductCard from "./ProductCard.jsx"
import SectionHeading from "./ui/SectionHeading.jsx"
import { Link } from "react-router-dom"
import { useStaggerVariants } from "../lib/motion.js"

// "Featured" = first products returned by the existing fetch (most recent
// first per the backend's ordering). No featured flag exists on the model,
// so this is the agreed substitute. Reuses the shared ProductCard inside a
// horizontal snap-scroll row.
export default function FeaturedRow({ products, onAddToCart }) {
  const stagger = useStaggerVariants({ stagger: 0.08, count: Math.min(products?.length || 0, 8) })

  if (!products?.length) return null

  const featured = products.slice(0, 8)

  return (
    <section className="mt-16">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Fresh on the shelf"
          title="This week's picks"
          aside={
            <Link
              to="/product-list"
              className="hidden font-mono text-[10px] uppercase tracking-widest text-navy/50 transition hover:text-ochre-ink sm:block"
            >
              View all &rarr;
            </Link>
          }
        />
      </div>

      <motion.div
        variants={stagger.container}
        initial="hidden"
        animate="show"
        className="scroll-slim mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-3"
      >
        {featured.map((product) => (
          <motion.div
            key={product.id}
            variants={stagger.item}
            className="w-64 flex-shrink-0 snap-start sm:w-72"
          >
            <ProductCard product={product} onAddToCart={onAddToCart} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
