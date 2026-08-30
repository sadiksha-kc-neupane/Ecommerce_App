import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="flex flex-col gap-4 border-t border-navy/10 bg-cream px-6 py-6 text-navy/70 sm:flex-row sm:items-center sm:justify-between">
      <span
        className="text-lg text-navy font-display"
      >
        Dipti&Suppliers
      </span>
      <div className="flex gap-6 font-mono text-[10px] uppercase tracking-widest">
        <Link to="/about" className="transition hover:text-navy">About</Link>
        <Link to="/contact" className="transition hover:text-navy">Contact</Link>
        <span className="transition hover:text-navy">Terms</span>
      </div>
    </footer>
  )
}