import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

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

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const slide = SLIDES[index]

  return (
    <section className="relative bg-[#14213D] px-6 py-14 text-center text-[#FBF7F0]">
      <button
        aria-label="Previous slide"
        onClick={() => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length)}
        className="absolute left-4 top-1/2 hidden -translate-y-1/2 rounded-full p-2 text-[#FBF7F0]/50 transition hover:text-[#FBF7F0] sm:block"
      >
        &larr;
      </button>
      <button
        aria-label="Next slide"
        onClick={() => setIndex((i) => (i + 1) % SLIDES.length)}
        className="absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-full p-2 text-[#FBF7F0]/50 transition hover:text-[#FBF7F0] sm:block"
      >
        &rarr;
      </button>

      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#E8A33D]">
        Slide {index + 1} of {SLIDES.length} &middot; {slide.eyebrow}
      </p>

      <h1
        className="mx-auto mt-3 max-w-xl text-3xl leading-tight sm:text-4xl"
        style={{ fontFamily: "'Fraunces', serif" }}
      >
        {slide.heading}
      </h1>

      <p className="mx-auto mt-2 max-w-md text-xs text-[#FBF7F0]/70">
        {slide.body}
      </p>

      <button
        onClick={() => navigate("/product-list")}
        className="mt-5 rounded-sm bg-[#E8A33D] px-5 py-2.5 font-mono text-[11px] uppercase tracking-widest text-[#14213D] transition hover:bg-[#FBF7F0]"
      >
        {slide.cta}
      </button>

      <div className="mt-6 flex justify-center gap-1.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 w-1.5 rounded-full transition ${
              i === index ? "bg-[#E8A33D]" : "bg-[#FBF7F0]/30"
            }`}
          />
        ))}
      </div>
    </section>
  )
}