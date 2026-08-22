import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"

export default function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const [search, setSearch] = useState("")

  function handleLogout() {
    localStorage.removeItem("token")
    navigate("/signin")
  }

  function handleSearchSubmit(e) {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/product-list?q=${encodeURIComponent(search.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-[#14213D] text-[#FBF7F0]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-6 py-3">
        <Link
          to="/"
          className="flex items-center gap-2"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E8A33D] font-mono text-[9px] text-[#E8A33D]">
            Logo
          </span>
          <span className="text-lg">Bazario</span>
        </Link>

        <nav className="hidden gap-5 font-mono text-[11px] uppercase tracking-widest text-[#FBF7F0]/85 md:flex">
          <Link to="/" className="transition hover:text-[#FBF7F0]">Home</Link>
          <Link to="/product-list" className="transition hover:text-[#FBF7F0]">Catalog</Link>
          <Link to="/about" className="transition hover:text-[#FBF7F0]">About</Link>
          <Link to="/contact" className="transition hover:text-[#FBF7F0]">Contact</Link>
        </nav>

        <form
          onSubmit={handleSearchSubmit}
          className="order-last flex w-full items-center gap-2 rounded-md border border-[#FBF7F0]/25 bg-[#FBF7F0]/10 px-3 py-1.5 sm:order-none sm:ml-auto sm:w-56"
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products"
            className="w-full bg-transparent text-xs text-[#FBF7F0] placeholder:text-[#FBF7F0]/40 outline-none"
          />
        </form>

        <Link to="/cart" aria-label="Cart" className="relative">
          <span className="font-mono text-xs uppercase tracking-widest text-[#FBF7F0]/85 transition hover:text-[#FBF7F0]">
            Cart
          </span>
          <CartBadge />
        </Link>

        {token ? (
          <button
            onClick={handleLogout}
            className="font-mono text-[11px] uppercase tracking-widest text-[#FBF7F0]/70 transition hover:text-[#FBF7F0]"
          >
            Log out
          </button>
        ) : (
          <>
            <Link
              to="/signin"
              className="font-mono text-[11px] uppercase tracking-widest text-[#FBF7F0]/70 transition hover:text-[#FBF7F0]"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="rounded-sm bg-[#E8A33D] px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-[#14213D] transition hover:bg-[#FBF7F0]"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </header>
  )
}

// Reads cart count from localStorage cache if you keep one, otherwise
// wire this up to your fetchCart() call and lift the count into context.
function CartBadge() {
  const count = Number(localStorage.getItem("cartCount") || 0)
  if (!count) return null
  return (
    <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#E8A33D] font-mono text-[9px] font-semibold text-[#14213D]">
      {count}
    </span>
  )
}