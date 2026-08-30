import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

// Static slide content for now -- swap for data from an API/CMS later if needed
const SLIDES = [
  {
    eyebrow: "IT hardware supplier",
    heading: "Laptops, desktops, servers & components in one catalog.",
    body: "Every listing shows real-time stock, fair prices and genuine products.",
    cta: "Shop now",
  },
  {
    eyebrow: "Live stock counts",
    heading: "Stock levels you can trust.",
    body: "Each product shows exactly what's left on the shelf before you order.",
    cta: "View catalog",
  },
  {
    eyebrow: "From CCTV to smartboards",
    heading: "Everything your business needs, under one roof.",
    body: "CCTV, networking, printers, smartboards and more — all in stock.",
    cta: "Browse products",
  },
]

export default function HeroSlider() {
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const slideVariants = {
    enter: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 },
    center: { opacity: 1, y: 0 },
    exit: reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 },
  }

  const slide = SLIDES[index]

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-cream to-paper text-navy">
      {/* ghost monogram gives the hero some subtle depth.
          Static background element, NOT part of the slides. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 right-2 select-none text-[11rem] leading-none text-ochre/[0.06] sm:text-[16rem] font-display"
      >
        D&S
      </span>

      {/* only ONE slide is mounted at a time; mode="wait" ensures the old
          slide fully fades out and unmounts before the next one enters,
          so content never stacks/ghosts on top of each other. */}
      <div className="flex min-h-[19rem] flex-col justify-center sm:min-h-[22rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial="enter"
            animate="center"
            exit="exit"
            variants={slideVariants}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center px-6 pb-24 pt-20 text-center sm:pb-28 sm:pt-24"
          >
            <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-ochre-ink">
              <span className="inline-block h-px w-6 bg-ochre/70" />
              {slide.eyebrow}
              <span className="inline-block h-px w-6 bg-ochre/70" />
            </p>

            <h1
              className="mt-5 max-w-3xl font-display text-3xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl"
            >
              {slide.heading}
            </h1>

            <p className="mt-4 max-w-md text-sm leading-relaxed text-navy/60 sm:text-base">
              {slide.body}
            </p>

            <button
              onClick={() => navigate("/product-list")}
              className="group mt-8 inline-flex items-center gap-3 rounded-lg bg-ochre px-7 py-3 font-mono text-[11px] uppercase tracking-widest text-navy transition-colors hover:bg-navy hover:text-cream"
            >
              {slide.cta}
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* arrows */}
      <button
        aria-label="Previous slide"
        onClick={() => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length)}
        className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-navy/20 text-navy/60 transition hover:border-ochre hover:text-ochre sm:flex"
      >
        &larr;
      </button>
      <button
        aria-label="Next slide"
        onClick={() => setIndex((i) => (i + 1) % SLIDES.length)}
        className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-navy/20 text-navy/60 transition hover:border-ochre hover:text-ochre sm:flex"
      >
        &rarr;
      </button>

      {/* dots */}
      <div className="absolute inset-x-0 bottom-16 flex justify-center gap-2 sm:bottom-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === index ? "w-8 bg-ochre" : "w-3 bg-navy/30 hover:bg-navy/60"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
