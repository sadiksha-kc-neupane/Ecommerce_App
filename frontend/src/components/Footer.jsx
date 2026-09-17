import { Link } from "react-router-dom"
import { PhoneIcon, EnvelopeIcon } from "@heroicons/react/24/outline"
import { CATEGORIES } from "../lib/categories.js"

export default function Footer() {
  return (
    <footer className="border-t border-teal/20 bg-[#0F766E] text-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2.5 font-display">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FF7F50] font-mono text-[11px] font-bold text-white shadow-xs">
              D&S
            </span>
            <span className="text-lg font-bold text-white">
              Dipti<span className="text-[#FF7F50]">&</span>Suppliers
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/75">
            IT hardware supplier — laptops, desktops &amp; servers, components,
            CCTV, networking, printers, scanners and smartboards.
          </p>
          <div className="mt-5 space-y-2 font-mono text-xs text-white/80">
            <a href="tel:+977-9804045706" className="flex items-center gap-2 transition hover:text-white">
              <PhoneIcon className="h-4 w-4 text-[#FF7F50]" /> +977-9804045706
            </a>
            <a href="mailto:hello@diptisuppliers.com" className="flex items-center gap-2 transition hover:text-white">
              <EnvelopeIcon className="h-4 w-4 text-[#FF7F50]" /> hello@diptisuppliers.com
            </a>
          </div>
        </div>

        {/* Shop by category */}
        <div>
          <h3 className="font-mono text-[10px] uppercase tracking-wider text-white/60">Shop</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link to="/product-list" className="text-white/80 transition hover:text-[#FF7F50]">
                All products
              </Link>
            </li>
            {CATEGORIES.map((cat) => (
              <li key={cat.value}>
                <Link
                  to={`/product-list?category=${encodeURIComponent(cat.value)}`}
                  className="text-white/80 transition hover:text-[#FF7F50]"
                >
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-mono text-[10px] uppercase tracking-wider text-white/60">Company</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link to="/about" className="text-white/80 transition hover:text-[#FF7F50]">About us</Link></li>
            <li><Link to="/contact" className="text-white/80 transition hover:text-[#FF7F50]">Contact</Link></li>
            <li><Link to="/blog-list" className="text-white/80 transition hover:text-[#FF7F50]">Guides &amp; Blog</Link></li>
          </ul>
        </div>

        {/* Account */}
        <div>
          <h3 className="font-mono text-[10px] uppercase tracking-wider text-white/60">Account</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link to="/signin" className="text-white/80 transition hover:text-[#FF7F50]">Sign in</Link></li>
            <li><Link to="/signup" className="text-white/80 transition hover:text-[#FF7F50]">Create account</Link></li>
            <li><Link to="/cart" className="text-white/80 transition hover:text-[#FF7F50]">Cart</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 font-mono text-[10px] uppercase tracking-wider text-white/60 sm:flex-row">
          <span>© {new Date().getFullYear()} Dipti&amp;Suppliers</span>
          <div className="flex gap-6">
            <Link to="/about" className="transition hover:text-white">About</Link>
            <Link to="/contact" className="transition hover:text-white">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
