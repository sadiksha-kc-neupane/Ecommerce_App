import { Link, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  Bars3Icon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"
import { useCart } from "../context/useCart.js"
import { getCurrentUser } from "../lib/auth.js"
import { CATEGORIES } from "../lib/categories.js"

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const activeCategory = new URLSearchParams(location.search).get("category")
  const user = getCurrentUser() // null when logged out; { id, role } when logged in
  const { cartCount, clearCart } = useCart()
  const [search, setSearch] = useState("")
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [openCategory, setOpenCategory] = useState(null) // mega-menu hover group
  const profileRef = useRef(null)
  const categoryRef = useRef(null)

  // Close the mobile panel whenever the route changes so navigating never
  // leaves it stuck open (also covers browser back/forward, not just our links).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false)
    setOpenCategory(null)
  }, [location])

  // Close the profile dropdown on outside click.
  useEffect(() => {
    function closeProfile(event) {
      if (!profileRef.current?.contains(event.target)) setProfileOpen(false)
    }

    document.addEventListener("mousedown", closeProfile)
    return () => document.removeEventListener("mousedown", closeProfile)
  }, [])

  // Close the mega menu on outside click.
  useEffect(() => {
    function closeMenu(event) {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setOpenCategory(null)
      }
    }

    document.addEventListener("mousedown", closeMenu)
    return () => document.removeEventListener("mousedown", closeMenu)
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
      setSearch("")
    }
  }

  const handleLogoutFromProfile = () => {
    handleLogout()
    setOpenCategory(null)
  }

  const cartLink = (
    <Link
      to="/cart"
      aria-label="Cart"
      className="relative flex items-center gap-1.5 text-navy/80 transition hover:text-navy"
      onClick={() => setMobileOpen(false)}
    >
      <ShoppingBagIcon className="h-6 w-6" aria-hidden="true" />
      <span className="hidden font-mono text-xs uppercase tracking-wider sm:inline">Cart</span>
      {cartCount > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ochre font-mono text-[10px] font-bold text-navy ring-2 ring-white">
          {cartCount}
        </span>
      )}
    </Link>
  )

  const sellLink = (user && (user.role === "admin" || user.role === "seller")) ? (
    <Link
      to="/create-Product"
      onClick={() => setMobileOpen(false)}
      className="rounded-md border border-ochre px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider text-ochre-ink transition hover:bg-ochre hover:text-navy"
    >
      + Add Product
    </Link>
  ) : null

  const profileOrAuth = user ? (
    <div className="relative" ref={profileRef}>
      <button
        type="button"
        aria-expanded={profileOpen}
        aria-label="Open profile menu"
        onClick={() => setProfileOpen((open) => !open)}
        className="flex items-center gap-1.5 text-navy/80 transition hover:text-navy focus:outline-none"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy font-display text-xs font-semibold text-cream">
          {user.role === "admin" ? "A" : user.role.slice(0, 1).toUpperCase()}
        </span>
        <ChevronDownIcon className={`h-3.5 w-3.5 transition-transform ${profileOpen ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      {profileOpen && (
        <div className="absolute right-0 top-11 z-50 w-52 rounded-lg border border-navy/10 bg-white p-1.5 shadow-card">
          <div className="border-b border-navy/10 px-3 py-2">
            <p className="font-mono text-[10px] uppercase tracking-wider text-navy/50">Signed in as</p>
            <p className="mt-1 truncate text-sm capitalize text-navy font-semibold">
              {user.role === "admin" ? "Store Administrator" : "Customer"}
            </p>
          </div>
          <Link
            to={(user.role === "admin" || user.role === "seller") ? "/admin-dashboard" : "/customer-dashboard"}
            onClick={() => setProfileOpen(false)}
            className="mt-1 block rounded-md px-3 py-2 text-sm text-navy/80 transition hover:bg-navy/5 hover:text-navy"
          >
            {(user.role === "admin" || user.role === "seller") ? "Admin Workspace" : "My Account & Orders"}
          </Link>
          <Link
            to="/cart"
            onClick={() => setProfileOpen(false)}
            className="block rounded-md px-3 py-2 text-sm text-navy/80 transition hover:bg-navy/5 hover:text-navy"
          >
            Cart
          </Link>
          <button
            onClick={handleLogoutFromProfile}
            className="w-full rounded-md px-3 py-2 text-left text-sm text-rust/80 transition hover:bg-rust/10 hover:text-rust"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <Link
        to="/signin"
        onClick={() => setMobileOpen(false)}
        className="rounded-md px-3 py-1.5 text-sm font-medium text-navy/80 transition hover:text-navy"
      >
        Sign in
      </Link>
      <Link
        to="/signup"
        onClick={() => setMobileOpen(false)}
        className="rounded-md bg-ochre px-4 py-1.5 text-sm font-semibold text-navy transition hover:bg-navy hover:text-cream"
      >
        Register
      </Link>
    </div>
  )

  const searchForm = (
    <form
      onSubmit={handleSearchSubmit}
      className="flex w-full items-center gap-2 rounded-full border border-navy/15 bg-white py-1.5 pl-4 pr-1.5 shadow-sm"
    >
      <MagnifyingGlassIcon className="h-4 w-4 text-navy/40" aria-hidden="true" />
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search laptops, CCTV, printers..."
        className="w-full bg-transparent text-sm text-navy placeholder:text-navy/40 outline-none"
      />
      <button
        type="submit"
        className="rounded-full bg-navy px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider text-cream transition hover:bg-ochre hover:text-navy"
      >
        Search
      </button>
    </form>
  )

  // Mega-menu link targets for each category + optional subcategory.
  const categoryLink = (cat, sub) =>
    `/product-list?category=${encodeURIComponent(cat)}` + (sub ? `&subcategory=${encodeURIComponent(sub)}` : "")

  return (
    <header className="sticky top-0 z-40 bg-white text-navy shadow-sm">
      {/* Utility bar */}
      <div className="bg-navy text-cream">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-1.5">
          <a
            href="tel:+977-9804045706"
            className="flex items-center gap-1.5 font-mono text-[11px] tracking-wide text-cream/80 transition hover:text-cream"
          >
            <PhoneIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Support +977-9804045706
          </a>
          <div className="hidden items-center gap-5 font-mono text-[11px] uppercase tracking-wider text-cream/70 sm:flex">
            {user?.role === "customer" && (
              <Link to="/customer-dashboard" className="transition hover:text-cream">Order tracking</Link>
            )}
            {user ? (
              <Link
                to={user.role === "seller" ? "/seller-dashboard" : "/customer-dashboard"}
                className="transition hover:text-cream"
              >
                My account
              </Link>
            ) : (
              <Link to="/signin" className="transition hover:text-cream">Sign in</Link>
            )}
          </div>
        </div>
      </div>

      {/* Primary bar */}
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3">
        <Link to="/" className="flex items-center gap-2.5 font-display">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ochre font-mono text-[11px] font-bold text-navy">
            D&S
          </span>
          <span className="text-lg font-bold leading-tight">
            Dipti
            <span className="text-ochre">&</span>
            Suppliers
          </span>
        </Link>

        {/* Desktop search + actions */}
        <div className="hidden flex-1 items-center gap-4 lg:flex">
          <div className="mx-auto w-full max-w-md">{searchForm}</div>
          <div className="ml-auto flex items-center gap-5">
            {(!user || user.role === "customer") && cartLink}
            {(user?.role === "admin" || user?.role === "seller") && sellLink}
            {profileOrAuth}
          </div>
        </div>

        {/* Mobile top bar */}
        <div className="flex items-center gap-3 lg:hidden">
          {(!user || user.role === "customer") && cartLink}
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-navy/15 text-navy transition hover:border-ochre hover:text-ochre"
          >
            {mobileOpen ? <XMarkIcon className="h-5 w-5" aria-hidden="true" /> : <Bars3Icon className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile search */}
      <div className="px-6 pb-3 lg:hidden">{searchForm}</div>

      {/* Category mega-menu bar (desktop) */}
      <div className="hidden border-t border-navy/10 lg:block" ref={categoryRef}>
        <nav className="mx-auto flex max-w-6xl items-center gap-1 px-6">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.value}
              className="relative"
              onMouseEnter={() => setOpenCategory(cat.value)}
              onMouseLeave={() => setOpenCategory(null)}
            >
              <Link
                to={categoryLink(cat.value)}
                className={`flex items-center gap-1 px-3 py-2.5 font-mono text-[12px] uppercase tracking-wider transition ${
                  openCategory === cat.value || activeCategory === cat.value
                    ? "text-ochre"
                    : "text-navy/75 hover:text-navy"
                }`}
              >
                {cat.label}
                {cat.subcategories.length > 0 && (
                  <ChevronDownIcon
                    className={`h-3 w-3 transition-transform ${openCategory === cat.value ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                )}
              </Link>

              {openCategory === cat.value && cat.subcategories.length > 0 && (
                <div className="absolute left-0 top-full z-50 min-w-56 rounded-lg border border-navy/10 bg-white p-2 shadow-lift">
                  <Link
                    to={categoryLink(cat.value)}
                    className="mb-1 block rounded-md px-3 py-2 text-sm font-semibold text-ochre transition hover:bg-navy/5"
                  >
                    View all {cat.label}
                  </Link>
                  {cat.subcategories.map((sub) => (
                    <Link
                      key={sub}
                      to={categoryLink(cat.value, sub)}
                      className="block rounded-md px-3 py-2 text-sm text-navy/80 transition hover:bg-navy/5 hover:text-navy"
                    >
                      {sub}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="ml-auto">
            <Link
              to="/product-list"
              className={`px-3 py-2.5 font-mono text-[12px] uppercase tracking-wider transition ${
                location.pathname === "/product-list" && !activeCategory ? "text-ochre" : "text-navy/75 hover:text-navy"
              }`}
            >
              All products
            </Link>
          </div>
        </nav>
      </div>

      {/* Mobile slide-down panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            key="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden border-t border-navy/10 bg-white px-6 pb-6 pt-3 lg:hidden"
          >
            <div className="flex flex-col gap-1">
              {CATEGORIES.map((cat) => (
                <div key={cat.value} className="border-b border-navy/5 py-2">
                  <div className="flex items-center justify-between">
                    <Link
                      to={categoryLink(cat.value)}
                      onClick={() => setMobileOpen(false)}
                      className={`font-mono text-sm uppercase tracking-wider ${
                        activeCategory === cat.value ? "text-ochre-ink" : "text-navy/80"
                      }`}
                    >
                      {cat.label}
                    </Link>
                    {cat.subcategories.length > 0 && (
                      <Link
                        to={categoryLink(cat.value)}
                        onClick={() => setMobileOpen(false)}
                        className="font-mono text-[10px] uppercase text-ochre"
                      >
                        View all
                      </Link>
                    )}
                  </div>
                  {cat.subcategories.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {cat.subcategories.map((sub) => (
                        <Link
                          key={sub}
                          to={categoryLink(cat.value, sub)}
                          onClick={() => setMobileOpen(false)}
                          className="rounded-full border border-navy/15 px-2.5 py-1 text-xs text-navy/70 transition hover:border-ochre hover:text-ochre"
                        >
                          {sub}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="mt-3 flex items-center justify-between border-t border-navy/10 pt-4 text-sm">
                {(!user || user.role === "customer") && cartLink}
                {(user?.role === "admin" || user?.role === "seller") && sellLink}
                {user ? (
                  <div className="flex items-center gap-4">
                    <Link
                      to={(user.role === "admin" || user.role === "seller") ? "/admin-dashboard" : "/customer-dashboard"}
                      onClick={() => setMobileOpen(false)}
                      className="font-medium text-navy/80 hover:text-navy"
                    >
                      {(user.role === "admin" || user.role === "seller") ? "Admin Workspace" : "Dashboard"}
                    </Link>
                    <button onClick={handleLogout} className="font-medium text-rust/80 hover:text-rust cursor-pointer">
                      Log out
                    </button>
                  </div>
                ) : (
                  <>
                    <Link to="/signin" onClick={() => setMobileOpen(false)} className="font-medium text-navy/80 hover:text-navy">
                      Sign in
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-md bg-ochre px-4 py-2 text-sm font-semibold text-navy"
                    >
                      Register
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
