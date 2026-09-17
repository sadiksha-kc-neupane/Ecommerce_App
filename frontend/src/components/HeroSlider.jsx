import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

import slide1 from "../assets/hero/slide1.png"
import slide2 from "../assets/hero/slide2.png"
import slide3 from "../assets/hero/slide3.png"

// Static slide content
const SLIDES = [
  {
    eyebrow: "IT hardware supplier",
    heading: "Laptops, desktops, servers & components in one catalog.",
    body: "Every listing shows real-time stock, fair prices and genuine products.",
    cta: "Shop now",
    image: slide3,
  },
  {
    eyebrow: "Live stock counts",
    heading: "Stock levels you can trust.",
    body: "Each product shows exactly what's left on the shelf before you order.",
    cta: "View catalog",
    image: slide2,
  },
  {
    eyebrow: "From CCTV to smartboards",
    heading: "Everything your business needs, under one roof.",
    body: "CCTV, networking, printers, smartboards and more — all in stock.",
    cta: "Browse products",
    image: slide1,
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
    <section className="relative isolate min-h-[26rem] w-full overflow-hidden text-navy sm:min-h-[32rem]">
      {/* z-0: full-bleed background image */}
      <AnimatePresence mode="wait">
        <motion.img
          key={`bg-${index}`}
          src={slide.image}
          alt=""
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.6, ease: "easeOut" }}
          className="absolute inset-0 z-0 h-full w-full object-cover"
          style={{ objectPosition: "70% center" }}
        />
      </AnimatePresence>

      {/* z-10: scrim */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(to right, #FAFAFA 0%, #FAFAFA 30%, rgba(250,250,250,0.7) 48%, rgba(250,250,250,0) 65%)",
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 select-none text-[11rem] leading-none text-[#0F766E]/[0.05] font-display sm:text-[16rem]"
        style={{ textAlign: "right", paddingRight: "1rem", paddingTop: "1rem" }}
      >
        D&S
      </span>

      {/* z-20: real text content */}
      <div className="relative z-20 mx-auto flex min-h-[26rem] max-w-6xl items-center px-6 py-16 sm:min-h-[32rem] sm:py-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial="enter"
            animate="center"
            exit="exit"
            variants={slideVariants}
            transition={{ duration: reduceMotion ? 0 : 0.5, ease: "easeOut" }}
            className="max-w-lg text-center sm:text-left"
          >
            <p className="font-mono text-[10px] uppercase tracking-wider text-[#0F766E] font-semibold">
              {slide.eyebrow}
            </p>

            <h1 className="mt-5 font-display text-3xl font-bold leading-[1.1] sm:text-5xl">
              {slide.heading}
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-navy/70 sm:mx-0 sm:text-base">
              {slide.body}
            </p>

            <button
              onClick={() => navigate("/product-list")}
              className="group mt-8 inline-flex items-center gap-3 rounded-lg bg-[#FF7F50] px-7 py-3 font-mono text-[11px] uppercase tracking-wider text-white font-semibold transition-colors hover:bg-[#E86C3E] shadow-sm cursor-pointer"
            >
              {slide.cta}
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* z-30: arrows */}
      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length)}
        className="absolute left-3 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-navy/20 bg-white/80 text-navy/70 backdrop-blur-sm transition hover:border-[#FF7F50] hover:text-[#FF7F50] sm:flex cursor-pointer"
      >
        &larr;
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={() => setIndex((i) => (i + 1) % SLIDES.length)}
        className="absolute right-3 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-navy/20 bg-white/80 text-navy/70 backdrop-blur-sm transition hover:border-[#FF7F50] hover:text-[#FF7F50] sm:flex cursor-pointer"
      >
        &rarr;
      </button>

      {/* z-30: dots */}
      <div className="absolute inset-x-0 bottom-6 z-30 flex justify-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
              i === index ? "w-8 bg-[#FF7F50]" : "w-3 bg-navy/30 hover:bg-navy/60"
            }`}
          />
        ))}
      </div>
    </section>
  )
}