import { Link, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Bars3Icon, ChevronDownIcon, UserCircleIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { useCart } from "../context/CartContext.jsx"
import { getCurrentUser } from "../lib/auth.js"

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = getCurrentUser() // null when logged out; { id, role } when logged in
  const { cartCount, clearCart } = useCart()
  const [search, setSearch] = useState("")
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)

  // Close the mobile panel whenever the route changes so navigating never
  // leaves it stuck open (also covers browser back/forward, not just our links).
  // Same known set-state-in-effect pattern the repo accepts in
  // UserDashboardProducts.jsx.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false)
  }, [location])

  useEffect(() => {
    function closeProfile(event) {
      if (!profileRef.current?.contains(event.target)) setProfileOpen(false)
    }

    document.addEventListener("mousedown", closeProfile)
    return () => document.removeEventListener("mousedown", closeProfile)
  }, [])

  function handleLogout() {
    setMobileOpen(false)
    setProfileOpen(false)
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

  const cartLink = (
    <Link to="/cart" aria-label="Cart" className="relative" onClick={() => setMobileOpen(false)}>
      <span className="font-mono text-sm uppercase tracking-widest text-navy/70 transition hover:text-navy">
        Cart
      </span>
      {cartCount > 0 && (
        <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-ochre font-mono text-[10px] font-semibold text-navy">
          {cartCount}
        </span>
      )}
    </Link>
  )

  const sellLink = (
    <Link
      to="/create-Product"
      onClick={() => setMobileOpen(false)}
      className="font-mono text-sm uppercase tracking-widest text-navy/70 transition hover:text-navy"
    >
      Sell
    </Link>
  )

  const profileOrAuth = user ? (
    <div className="relative" ref={profileRef}>
      <button
        type="button"
        aria-expanded={profileOpen}
        aria-label="Open profile menu"
        onClick={() => setProfileOpen((open) => !open)}
        className="flex items-center gap-1.5 rounded-full text-navy/80 transition hover:text-navy focus:outline-none focus:ring-2 focus:ring-ochre"
      >
        <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-navy/20 bg-navy/5">
          <UserCircleIcon className="h-7 w-7" aria-hidden="true" />
        </span>
        <ChevronDownIcon className={`h-3.5 w-3.5 transition-transform ${profileOpen ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      {profileOpen && (
        <div className="absolute right-0 top-11 z-50 w-48 rounded-md border border-navy/10 bg-paper p-1.5 shadow-2xl shadow-navy/20">
          <div className="border-b border-navy/10 px-3 py-2">
            <p className="font-mono text-[10px] uppercase tracking-widest text-navy/50">Signed in as</p>
            <p className="mt-1 truncate text-sm capitalize text-navy">{user.role}</p>
          </div>
          <Link
            to={user.role === "seller" ? "/seller-dashboard" : "/customer-dashboard"}
            onClick={() => setProfileOpen(false)}
            className="mt-1 block rounded-sm px-3 py-2 font-mono text-xs uppercase tracking-widest text-navy/75 transition hover:bg-navy/5 hover:text-navy"
          >
            Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="w-full rounded-sm px-3 py-2 text-left font-mono text-xs uppercase tracking-widest text-rust/80 transition hover:bg-rust/15 hover:text-rust"
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
        onClick={() => setMobileOpen(false)}
        className="font-mono text-sm uppercase tracking-widest text-navy/70 transition hover:text-navy"
      >
        Login
      </Link>
      <Link
        to="/signup"
        onClick={() => setMobileOpen(false)}
        className="rounded-sm bg-ochre px-4 py-2 font-mono text-sm uppercase tracking-widest text-navy transition hover:bg-navy hover:text-cream"
      >
        Sign up
      </Link>
    </>
  )

  const navLinks = (
    <>
      <Link to="/" onClick={() => setMobileOpen(false)} className="transition hover:text-navy">Home</Link>
      <Link to="/product-list" onClick={() => setMobileOpen(false)} className="transition hover:text-navy">Catalog</Link>
      <Link to="/about" onClick={() => setMobileOpen(false)} className="transition hover:text-navy">About</Link>
      <Link to="/contact" onClick={() => setMobileOpen(false)} className="transition hover:text-navy">Contact</Link>
    </>
  )

  const searchForm = (
    <form
      onSubmit={handleSearchSubmit}
      className="flex w-full items-center gap-2 rounded-md border border-navy/15 bg-white px-3 py-1.5"
    >
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products"
        className="w-full bg-transparent text-sm text-navy placeholder:text-navy/40 outline-none"
      />
    </form>
  )

  return (
    <header className="sticky top-0 z-40 border-b border-navy/10 bg-cream text-navy">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3.5">
        <Link to="/" className="flex items-center gap-2 font-display">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-ochre font-mono text-[11px] text-ochre">
            D&S
          </span>
          <span className="text-xl">Dipti&Suppliers</span>
        </Link>

        {/* Desktop-only controls: nav links, search, cart, profile/auth */}
        <div className="hidden flex-1 items-center gap-4 lg:flex">
          <nav className="flex gap-5 font-mono text-sm uppercase tracking-widest text-navy/80">
            {navLinks}
          </nav>

          <div className="ml-auto flex items-center gap-4">
            <div className="w-56">{searchForm}</div>
            {user && user.role !== "seller" && cartLink}
            {user && user.role === "seller" && sellLink}
            {profileOrAuth}
          </div>
        </div>

        {/* Mobile-only top bar: cart stays reachable at all times + hamburger */}
        <div className="flex items-center gap-3 lg:hidden">
          {user && user.role !== "seller" && cartLink}
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-navy/20 text-navy transition hover:border-ochre hover:text-ochre focus:outline-none focus:ring-2 focus:ring-ochre"
          >
            {mobileOpen ? <XMarkIcon className="h-5 w-5" aria-hidden="true" /> : <Bars3Icon className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile slide-down panel — full parity with the desktop nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            key="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden border-t border-navy/10 bg-cream px-6 pb-6 pt-2 lg:hidden"
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 pt-3 font-mono text-sm uppercase tracking-widest text-navy/80">
                {navLinks}
              </div>

              {searchForm}

              <div className="flex items-center gap-4 border-t border-navy/10 pt-4 font-mono text-sm uppercase tracking-widest">
                {user && user.role !== "seller" && cartLink}
                {user && user.role === "seller" && sellLink}
                {user ? (
                  <>
                    <Link
                      to={user.role === "seller" ? "/seller-dashboard" : "/customer-dashboard"}
                      onClick={() => setMobileOpen(false)}
                      className="transition hover:text-navy"
                    >
                      Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="uppercase tracking-widest transition hover:text-rust"
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/signin"
                      onClick={() => setMobileOpen(false)}
                      className="transition hover:text-navy"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-sm bg-ochre px-4 py-2 text-navy transition hover:bg-navy hover:text-cream"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
