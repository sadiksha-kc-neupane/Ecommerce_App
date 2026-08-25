import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useCart } from "../context/CartContext.jsx"

export default function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const { cartCount, clearCart } = useCart()
  const [search, setSearch] = useState("")

  function handleLogout() {
    localStorage.removeItem("token")
    clearCart()
    navigate("/signin")
  }

  function handleSearchSubmit(e) {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/product-list?q=${encodeURIComponent(search.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-navy text-cream">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-6 py-3">
        <Link
          to="/"
          className="flex items-center gap-2 font-display"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-ochre font-mono text-[9px] text-ochre">
            Logo
          </span>
          <span className="text-lg">Bazario</span>
        </Link>

        <nav className="hidden gap-5 font-mono text-[11px] uppercase tracking-widest text-cream/85 md:flex">
          <Link to="/" className="transition hover:text-cream">Home</Link>
          <Link to="/product-list" className="transition hover:text-cream">Catalog</Link>
          <Link to="/about" className="transition hover:text-cream">About</Link>
          <Link to="/contact" className="transition hover:text-cream">Contact</Link>
        </nav>

        <form
          onSubmit={handleSearchSubmit}
          className="order-last flex w-full items-center gap-2 rounded-md border border-cream/25 bg-cream/10 px-3 py-1.5 sm:order-none sm:ml-auto sm:w-56"
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products"
            className="w-full bg-transparent text-xs text-cream placeholder:text-cream/40 outline-none"
          />
        </form>

        <Link to="/cart" aria-label="Cart" className="relative">
          <span className="font-mono text-xs uppercase tracking-widest text-cream/85 transition hover:text-cream">
            Cart
          </span>
          {cartCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-ochre font-mono text-[9px] font-semibold text-navy">
              {cartCount}
            </span>
          )}
        </Link>

        {token ? (
          <button
            onClick={handleLogout}
            className="font-mono text-[11px] uppercase tracking-widest text-cream/70 transition hover:text-cream"
          >
            Log out
          </button>
        ) : (
          <>
            <Link
              to="/signin"
              className="font-mono text-[11px] uppercase tracking-widest text-cream/70 transition hover:text-cream"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="rounded-sm bg-ochre px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-navy transition hover:bg-cream"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </header>
  )
}