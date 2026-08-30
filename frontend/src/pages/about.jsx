import { Link } from "react-router-dom"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import { buttonVariants } from "../components/ui/buttonVariants.js"
import SectionHeading from "../components/ui/SectionHeading.jsx"
import { CATEGORIES, CATEGORY_COLORS } from "../lib/categories.js"
import {
  CheckBadgeIcon,
  CubeIcon,
  PhoneIcon,
  TruckIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline"

// What Dipti&Suppliers actually provides, drawn from the real application:
// catalog organisation, live stock, a working cart/checkout, order tracking &
// cancellation, and a real support line. No invented statistics or history.
const FEATURES = [
  {
    icon: CubeIcon,
    title: "A real, verified catalog",
    body: "Every listing comes from the catalog with a genuine spec sheet, a real price and an actual stock count — not a vague backorder estimate.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Trustworthy stock levels",
    body: "Low-stock and out-of-stock states are shown before you add to cart, so you know exactly what's on the shelf.",
  },
  {
    icon: TruckIcon,
    title: "Order tracking & cancellation",
    body: "Place an order at checkout, then follow its status and cancel it from your customer dashboard when it's still cancellable.",
  },
  {
    icon: CheckBadgeIcon,
    title: "Support you can reach",
    body: "A single, direct support line — +977-9804045706 — answered by people who know the hardware.",
  },
]

export default function About() {
  return (
    <div className="min-h-screen bg-paper">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="border-b border-navy/10 bg-gradient-to-br from-orange-50 via-paper to-cream px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-rust">About us</p>
            <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-navy sm:text-5xl">
              Dipti&Suppliers — IT hardware, done right
            </h1>
            <p className="mt-5 text-base leading-relaxed text-navy/60 sm:text-lg">
              We supply the hardware businesses and homes actually run on —
              laptops and desktops for daily work, servers and networking to
              keep it all connected, smartboards for classrooms and meeting
              rooms, and CCTV systems to keep it all secure.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/product-list" className={buttonVariants({ variant: "primary", size: "lg" })}>
                Shop the catalog
              </Link>
              <Link to="/contact" className={buttonVariants({ variant: "outline", size: "lg" })}>
                Talk to us
              </Link>
            </div>
          </div>
        </section>

        {/* What we provide */}
        <section className="px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="What we provide" title="Built for how IT teams actually shop" />
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-navy/60">
              We built our catalog the way an IT department shops: real specs,
              real stock counts and no guesswork — whether you're after a single
              graphics card or a batch of routers for a full office rollout.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="rounded-lg border border-navy/10 bg-white p-6 shadow-card"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-ochre/15 text-ochre-ink">
                    <f.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold text-navy">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy/60">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="border-t border-navy/10 bg-cream px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="What we carry" title="Seven categories, one verified shelf" />
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.value}
                  to={`/product-list?category=${encodeURIComponent(cat.value)}`}
                  className="group rounded-lg border border-navy/10 bg-white p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:border-ochre/50 hover:shadow-lift"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-block h-3 w-3 rounded-full transition group-hover:scale-125"
                      style={{ backgroundColor: CATEGORY_COLORS[cat.value] || "#1C1B19" }}
                    />
                    <h3 className="font-display text-lg font-semibold text-navy">{cat.label}</h3>
                  </div>
                  {cat.subcategories.length > 0 ? (
                    <p className="mt-3 text-xs leading-relaxed text-navy/55">
                      {cat.subcategories.join(" · ")}
                    </p>
                  ) : (
                    <p className="mt-3 text-xs text-navy/45">Browse all {cat.label.toLowerCase()}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Support band */}
        <section className="bg-navy px-6 py-16 text-cream sm:py-20">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-ochre/20 text-ochre">
              <PhoneIcon className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              Need a second opinion before you buy?
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-cream/70">
              Our team sources, stocks and ships real hardware — and we're a
              phone call away when something needs a second opinion.
            </p>
            <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
              <a
                href="tel:+977-9804045706"
                className="inline-flex items-center gap-2 rounded-md bg-ochre px-6 py-3 font-mono text-xs uppercase tracking-widest text-navy transition hover:bg-cream"
              >
                <PhoneIcon className="h-4 w-4" aria-hidden="true" />
                +977-9804045706
              </a>
              <Link to="/product-list" className={buttonVariants({ variant: "outline", size: "lg", ...{ className: "border-cream/30 text-cream hover:border-cream hover:text-navy" } })}>
                Browse the catalog
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
