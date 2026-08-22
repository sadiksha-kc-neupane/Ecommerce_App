import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="flex flex-col gap-4 bg-[#14213D] px-6 py-6 text-[#FBF7F0]/70 sm:flex-row sm:items-center sm:justify-between">
      <span
        className="text-lg text-[#FBF7F0]"
        style={{ fontFamily: "'Fraunces', serif" }}
      >
        Bazario
      </span>
      <div className="flex gap-6 font-mono text-[10px] uppercase tracking-widest">
        <Link to="/about" className="transition hover:text-[#FBF7F0]">About</Link>
        <Link to="/contact" className="transition hover:text-[#FBF7F0]">Contact</Link>
        <span className="transition hover:text-[#FBF7F0]">Terms</span>
      </div>
    </footer>
  )
}