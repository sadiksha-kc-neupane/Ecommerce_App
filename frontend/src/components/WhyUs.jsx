import { Link } from "react-router-dom"
import { CheckIcon } from "@heroicons/react/20/solid"
import { XMarkIcon } from "@heroicons/react/24/outline"

const typicalCounts = [
  "No way to tell genuine stock from a backorder",
  "Specs buried in vague or missing descriptions",
  "Mixed listings from resellers, not real suppliers",
  "Support that disappears after checkout",
]

const whyCounts = [
  "Every listing comes straight from a real supplier — no reseller markup guesswork",
  "Real stock counts shown on every product",
  "Organized the way IT teams actually shop: laptops, desktops & servers, components, CCTV, printers & smartboards",
  "Order tracking and cancellation in one dashboard",
  "A real support line — +977-9804045706",
]

export default function WhyUs() {
  return (
    <section className="bg-cream px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="font-mono text-[10px] uppercase tracking-wider text-rust">
            Why Dipti&Suppliers
          </p>
          <h2 className="mt-3 text-3xl text-navy font-display sm:text-4xl">
            IT hardware you can actually verify
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-navy/60 sm:text-base">
            Not another reseller feed. We list every laptop, server and camera
            the way we&apos;d tag it on a shelf — honest price, real spec sheet,
            real quantity.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch">
          {/* Typical marketplaces — plain, muted */}
          <div className="flex flex-col rounded-md bg-paper p-7 outline outline-1 -outline-offset-1 outline-navy/15 sm:p-9">
            <p className="font-mono text-[10px] uppercase tracking-wider text-navy/40">
              Elsewhere
            </p>
            <h3 className="mt-2 text-xl text-navy font-display">Typical marketplaces</h3>

            <ul className="mt-6 flex flex-1 flex-col gap-4">
              {typicalCounts.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <XMarkIcon
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 flex-none text-rust/60"
                  />
                  <span className="text-sm leading-relaxed text-navy/60">{feature}</span>
                </li>
              ))}
            </ul>

            <p className="mt-6 font-mono text-[10px] uppercase tracking-wider text-navy/35">
              Usually the way it works
            </p>
          </div>

          {/* Dipti&Suppliers — featured */}
          <div className="relative flex flex-col rounded-md bg-navy p-7 text-cream sm:p-9">
            <p className="font-mono text-[10px] uppercase tracking-wider text-ochre">
              Our promise
            </p>
            <h3 className="mt-2 text-xl font-display">Dipti&Suppliers</h3>

            <ul className="mt-6 flex flex-1 flex-col gap-4">
              {whyCounts.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <CheckIcon
                    aria-hidden="true"
                    className="mt-0.5 h-5 w-5 flex-none text-ochre"
                  />
                  <span className="text-sm leading-relaxed text-cream/85">{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              to="/signup"
              className="mt-8 block rounded-sm bg-ochre px-5 py-3 text-center font-mono text-xs uppercase tracking-wider text-navy transition hover:bg-cream"
            >
              Shop the catalog
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}