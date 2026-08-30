import { useState } from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import SectionHeading from "../components/ui/SectionHeading.jsx"
import {
  PhoneIcon,
  EnvelopeIcon,
  QuestionMarkCircleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline"

// Real contact details already present in the project (see Footer). The
// online contact form has no backend endpoint, so the UI is honest about it
// rather than pretending a message was sent.
const SUPPORT_PHONE = "+977-9804045706"
const SUPPORT_EMAIL = "hello@diptisuppliers.com"

const HELP = [
  {
    title: "Where is my order?",
    body: "Order status and cancellation live in your customer dashboard once you're signed in.",
    label: "Check order status",
    to: "/customer-dashboard",
  },
  {
    title: "Can I cancel an order?",
    body: "You can cancel before an order ships, straight from the Orders section of your dashboard.",
    label: "Go to my orders",
    to: "/customer-dashboard",
  },
  {
    title: "Stock & pricing questions",
    body: "Every listing shows a real stock count and price — but our team can always double-check for you over the phone.",
    label: "Browse the catalog",
    to: "/product-list",
  },
]

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [previewSent, setPreviewSent] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  return (
    <div>
      {previewSent ? (
        <div className="rounded-lg border border-navy/15 bg-white p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-ochre/15">
            <QuestionMarkCircleIcon className="h-6 w-6 text-ochre-ink" aria-hidden="true" />
          </div>
          <h3 className="mt-4 font-display text-xl text-navy">Thanks, {form.name || "friend"}!</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-navy/60">
            Online message submission isn't connected yet, so this message
            hasn't reached us. To talk to us now, please call{" "}
            <a href={`tel:${SUPPORT_PHONE}`} className="font-semibold text-ochre-ink underline underline-offset-2">
              {SUPPORT_PHONE}
            </a>{" "}
            or email{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-ochre-ink underline underline-offset-2">
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
          <button
            type="button"
            onClick={() => {
              setForm({ name: "", email: "", message: "" })
              setPreviewSent(false)
            }}
            className="mt-6 inline-block rounded-md border border-navy/25 px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-navy/80 transition hover:border-ochre hover:text-ochre-ink"
          >
            Fill it in again
          </button>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setPreviewSent(true)
          }}
          className="flex flex-col gap-4 rounded-lg border border-navy/15 bg-white p-6"
        >
          <div className="rounded-md border border-ochre/40 bg-ochre/10 p-3.5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ochre-ink">
              Before you submit
            </p>
            <p className="mt-1 text-sm leading-relaxed text-navy/70">
              This form is a preview — online submission isn't connected yet.
              For a response, please call{" "}
              <a href={`tel:${SUPPORT_PHONE}`} className="font-semibold text-ochre-ink underline underline-offset-2">
                {SUPPORT_PHONE}
              </a>{" "}
              instead.
            </p>
          </div>

          <label className="flex flex-col gap-1">
            <span className="font-mono text-xs uppercase tracking-widest text-navy/60">Name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Your name"
              className="rounded-md border border-navy/20 bg-paper px-3 py-2 text-sm text-navy placeholder:text-navy/30 focus:border-ochre focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-mono text-xs uppercase tracking-widest text-navy/60">Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="rounded-md border border-navy/20 bg-paper px-3 py-2 text-sm text-navy placeholder:text-navy/30 focus:border-ochre focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-mono text-xs uppercase tracking-widest text-navy/60">Message</span>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              placeholder="What can we help you with?"
              className="rounded-md border border-navy/20 bg-paper px-3 py-2 text-sm text-navy placeholder:text-navy/30 focus:border-ochre focus:outline-none"
            />
          </label>

          <button
            type="submit"
            className="rounded-md bg-ochre px-6 py-3 font-mono text-xs uppercase tracking-widest text-navy transition hover:bg-navy hover:text-cream"
          >
            Preview message
          </button>
        </form>
      )}
    </div>
  )
}

export default function Contact() {
  return (
    <div className="min-h-screen bg-paper">
      <Navbar />

      <main>
        <section className="border-b border-navy/10 bg-gradient-to-br from-orange-50 via-paper to-cream px-6 py-14 sm:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-rust">Contact</p>
            <h1 className="mt-3 font-display text-4xl font-bold text-navy">Talk to Dipti&Suppliers</h1>
            <p className="mt-4 text-base leading-relaxed text-navy/60">
              Real people who know the hardware — reachable by phone or email
              when something needs a second opinion.
            </p>
          </div>
        </section>

        <section className="px-6 py-16 sm:py-20">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[1fr_1.1fr]">
            {/* Contact details + help */}
            <div>
              <SectionHeading eyebrow="Get in touch" title="Reach us directly" />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <a
                  href={`tel:${SUPPORT_PHONE}`}
                  className="group rounded-lg border border-navy/10 bg-white p-6 shadow-card transition hover:border-ochre/50"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-ochre/15 text-ochre-ink">
                    <PhoneIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-navy/50">Support line</p>
                  <p className="mt-1 font-display text-lg text-navy group-hover:text-ochre-ink">{SUPPORT_PHONE}</p>
                  <p className="mt-1 text-xs text-navy/50">Call us about any product, order or stock query.</p>
                </a>

                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="group rounded-lg border border-navy/10 bg-white p-6 shadow-card transition hover:border-ochre/50"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-ochre/15 text-ochre-ink">
                    <EnvelopeIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-navy/50">Email</p>
                  <p className="mt-1 break-all font-display text-lg text-navy group-hover:text-ochre-ink">{SUPPORT_EMAIL}</p>
                  <p className="mt-1 text-xs text-navy/50">For quoting, bulk or business enquiries.</p>
                </a>
              </div>

              <div className="mt-10">
                <h2 className="font-mono text-[11px] uppercase tracking-widest text-navy/60">Quick answers</h2>
                <div className="mt-4 flex flex-col gap-4">
                  {HELP.map((h) => (
                    <div key={h.title} className="rounded-lg border border-navy/10 bg-white p-5">
                      <h3 className="flex items-center gap-2 font-display text-base font-semibold text-navy">
                        <QuestionMarkCircleIcon className="h-4 w-4 flex-none text-ochre" aria-hidden="true" />
                        {h.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-navy/60">{h.body}</p>
                      <Link
                        to={h.to}
                        className="mt-3 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-ochre-ink transition hover:text-navy"
                      >
                        {h.label} <ArrowRightIcon className="h-3 w-3" aria-hidden="true" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Honest contact form preview */}
            <div>
              <SectionHeading eyebrow="Send a message" title="Send us a note" />
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
