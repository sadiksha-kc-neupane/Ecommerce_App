import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="flex flex-col gap-4 bg-navy px-6 py-6 text-cream/70 sm:flex-row sm:items-center sm:justify-between">
      <span
        className="text-lg text-cream font-display"
      >
        Bazario
      </span>
      <div className="flex gap-6 font-mono text-[10px] uppercase tracking-widest">
        <Link to="/about" className="transition hover:text-cream">About</Link>
        <Link to="/contact" className="transition hover:text-cream">Contact</Link>
        <span className="transition hover:text-cream">Terms</span>
      </div>
    </footer>
  )
}