import { Link, useNavigate } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { ChevronDownIcon, UserCircleIcon } from "@heroicons/react/24/outline"
import { useCart } from "../context/CartContext.jsx"
import { getCurrentUser } from "../lib/auth.js"

export default function Navbar() {
  const navigate = useNavigate()
  const user = getCurrentUser() // null when logged out; { id, role } when logged in
  const { cartCount, clearCart } = useCart()
  const [search, setSearch] = useState("")
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)

  useEffect(() => {
    function closeProfile(event) {
      if (!profileRef.current?.contains(event.target)) setProfileOpen(false)
    }

    document.addEventListener("mousedown", closeProfile)
    return () => document.removeEventListener("mousedown", closeProfile)
  }, [])

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
          <span className="text-lg">Dipti&Suppliers</span>
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

        {user && user.role !== "seller" && (
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
        )}

        {user && user.role === "seller" && (
          <Link
            to="/create-Product"
            className="font-mono text-xs uppercase tracking-widest text-cream/85 transition hover:text-cream"
          >
            Sell
          </Link>
        )}

        {user ? (
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              aria-expanded={profileOpen}
              aria-label="Open profile menu"
              onClick={() => setProfileOpen((open) => !open)}
              className="flex items-center gap-1.5 rounded-full text-cream/80 transition hover:text-cream focus:outline-none focus:ring-2 focus:ring-ochre"
            >
              <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-cream/30 bg-cream/10">
                <UserCircleIcon className="h-6 w-6" aria-hidden="true" />
              </span>
              <ChevronDownIcon className={`h-3.5 w-3.5 transition-transform ${profileOpen ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-11 z-50 w-48 rounded-md border border-cream/15 bg-[#10141f] p-1.5 shadow-2xl shadow-navy/30">
                <div className="border-b border-cream/10 px-3 py-2">
                  <p className="font-mono text-[9px] uppercase tracking-widest text-cream/40">Signed in as</p>
                  <p className="mt-1 truncate text-sm capitalize text-cream">{user.role}</p>
                </div>
                <Link
                  to={user.role === "seller" ? "/seller-dashboard" : "/customer-dashboard"}
                  onClick={() => setProfileOpen(false)}
                  className="mt-1 block rounded-sm px-3 py-2 font-mono text-[11px] uppercase tracking-widest text-cream/75 transition hover:bg-cream/10 hover:text-cream"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full rounded-sm px-3 py-2 text-left font-mono text-[11px] uppercase tracking-widest text-cream/50 transition hover:bg-rust/15 hover:text-cream"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
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