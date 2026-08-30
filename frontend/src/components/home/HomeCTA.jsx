import { Link } from "react-router-dom"
import { buttonVariants } from "../ui/buttonVariants.js"

// Closing "how to start shopping" band on the homepage. The three numbered
// steps reflect the real, working customer flow (catalog -> cart -> checkout
// & track), so no invented claims or statistics are shown.
const STEPS = [
  {
    n: "01",
    title: "Browse the catalog",
    body: "Filter by category, subcategory, price and stock — every listing shows a real stock count.",
  },
  {
    n: "02",
    title: "Add to cart",
    body: "Pick quantities up to what's actually in stock and review your order before paying.",
  },
  {
    n: "03",
    title: "Checkout & track",
    body: "Place your order, then follow its status and cancel from your customer dashboard.",
  },
]

export default function HomeCTA() {
  return (
    <section className="bg-navy px-6 py-20 text-cream sm:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ochre">
            How to start shopping
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">
            From catalog to doorstep in three steps
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.n}
              className="rounded-lg border border-cream/10 bg-white/[0.04] p-6"
            >
              <span className="font-mono text-3xl font-semibold text-ochre/80">
                {step.n}
              </span>
              <h3 className="mt-3 font-display text-xl text-cream">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream/70">{step.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <Link to="/product-list" className={buttonVariants({ variant: "primary", size: "lg" })}>
            Browse the catalog
          </Link>
          <Link
            to="/signup"
            className={buttonVariants({ variant: "outline", size: "lg", ...{ className: "border-cream/30 text-cream hover:border-cream hover:text-navy" } })}
          >
            Create an account
          </Link>
          <p className="mt-3 text-xs leading-relaxed text-cream/60 sm:ml-2 sm:mt-0">
            Need a hand? Call{" "}
            <a href="tel:+977-9804045706" className="font-semibold text-cream underline decoration-ochre/60 underline-offset-2">
              +977-9804045706
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
