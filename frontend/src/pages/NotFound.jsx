import { Link } from "react-router-dom"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Navbar />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ochre-ink">
          404
        </span>
        <h1 className="mt-3 font-display text-4xl font-bold text-navy sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-navy/70 sm:text-base">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
          Let&apos;s get you back to the catalog.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md bg-ochre px-7 py-3 font-mono text-[11px] uppercase tracking-widest text-navy transition-colors hover:bg-navy hover:text-cream"
          >
            Back to home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
