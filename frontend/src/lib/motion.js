import { useReducedMotion } from "framer-motion"

// Shared stagger variants so ProductGrid / FeaturedRow entrances stay
// consistent. Returns inert variants when the user prefers reduced motion.
// Pass `count` to cap the total sequence length on long lists.
export function useStaggerVariants({ stagger = 0.06, rise = 16, count } = {}) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return { container: {}, item: {} }
  }

  const effectiveStagger =
    count && count > 1 ? Math.min(stagger, 0.9 / (count - 1)) : stagger

  return {
    container: {
      hidden: {},
      show: { transition: { staggerChildren: effectiveStagger } },
    },
    item: {
      hidden: { opacity: 0, y: rise },
      show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    },
  }
}
