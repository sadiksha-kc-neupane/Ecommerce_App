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

  return (
    <section className="relative overflow-hidden bg-navy text-cream">
      {/* soft ochre glow + ghost monogram give the navy some depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(232,163,61,0.14),transparent_55%)]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 right-2 select-none text-[11rem] leading-none text-cream/[0.045] sm:text-[16rem] font-display"
      >
        Bz
      </span>

      {/* all slides stay mounted in one grid cell; active one fades/slides in */}
      <div className="grid">
        {SLIDES.map((s, i) => (
          <div
            key={i}
            aria-hidden={i !== index}
            className={`col-start-1 row-start-1 flex flex-col items-center px-6 pb-24 pt-20 text-center transition-all duration-700 ease-out sm:pb-28 sm:pt-24 ${
              i === index
                ? "translate-y-0 opacity-100"
                : "pointer-events-none translate-y-4 opacity-0"
            }`}
          >
            <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-ochre">
              <span className="inline-block h-px w-6 bg-ochre/60" />
              {s.eyebrow}
              <span className="inline-block h-px w-6 bg-ochre/60" />
            </p>

            <h1
              className="mt-5 max-w-3xl text-4xl leading-[1.08] font-display sm:text-5xl lg:text-6xl"
              style={{ fontWeight: 350 }}
            >
              {s.heading}
            </h1>

            <p className="mt-4 max-w-md text-sm leading-relaxed text-cream/70 sm:text-base">
              {s.body}
            </p>

            <button
              tabIndex={i === index ? 0 : -1}
              onClick={() => navigate("/product-list")}
              className="group mt-8 inline-flex items-center gap-3 rounded-sm bg-ochre px-7 py-3 font-mono text-[11px] uppercase tracking-widest text-navy transition-colors hover:bg-cream"
            >
              {s.cta}
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </button>
          </div>
        ))}
      </div>

      {/* arrows */}
      <button
        aria-label="Previous slide"
        onClick={() => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length)}
        className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-cream/20 text-cream/60 transition hover:border-ochre hover:text-ochre sm:flex"
      >
        &larr;
      </button>
      <button
        aria-label="Next slide"
        onClick={() => setIndex((i) => (i + 1) % SLIDES.length)}
        className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-cream/20 text-cream/60 transition hover:border-ochre hover:text-ochre sm:flex"
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
              i === index ? "w-8 bg-ochre" : "w-3 bg-cream/30 hover:bg-cream/60"
            }`}
          />
        ))}
      </div>

      {/* angled divider: navy cuts into the cream page background */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-5 bg-paper [clip-path:polygon(0_100%,100%_0,100%_100%)] sm:h-8"
      />
    </section>
  )
}
