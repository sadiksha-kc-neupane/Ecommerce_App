import { motion, useReducedMotion } from "framer-motion"

export default function PageTransition({ children }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}
