import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

// Static slide content for now -- swap for data from an API/CMS later if needed
const SLIDES = [
  {
    eyebrow: "New arrivals",
    heading: "Everything on the shelf, tagged and priced.",
    body: "Electronics, materials, agriculture, cosmetics in one catalog.",
    cta: "Shop now",
  },
  {
    eyebrow: "This week",
    heading: "Stock counts you can trust.",
    body: "Every listing shows exactly what's left on the shelf.",
    cta: "View catalog",
  },
  {
    eyebrow: "Just landed",
    heading: "New sellers, new categories.",
    body: "More listings added to the catalog every week.",
    cta: "Browse new",
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
    <section className="relative overflow-hidden bg-gradient-to-br from-[#FDF0DD] to-cream text-navy">
      {/* ghost monogram gives the warm gradient some subtle depth.
          Static background element, NOT part of the slides. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 right-2 select-none text-[11rem] leading-none text-navy/[0.05] sm:text-[16rem] font-display"
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
              className="mt-5 max-w-3xl text-3xl leading-[1.08] font-display sm:text-5xl lg:text-6xl"
              style={{ fontWeight: 350 }}
            >
              {slide.heading}
            </h1>

            <p className="mt-4 max-w-md text-sm leading-relaxed text-navy/70 sm:text-base">
              {slide.body}
            </p>

            <button
              onClick={() => navigate("/product-list")}
              className="group mt-8 inline-flex items-center gap-3 rounded-sm bg-ochre px-7 py-3 font-mono text-[11px] uppercase tracking-widest text-navy transition-colors hover:bg-navy hover:text-cream"
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
