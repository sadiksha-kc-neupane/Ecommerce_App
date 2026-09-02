import { useState } from "react"
import { Link } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"

// Shared dashboard navigation shell. Renders a full-height (h-full) sidebar on
// desktop (lg+) that stays pinned while the main content scrolls, and collapses
// into a compact top bar with a slide-down drawer on mobile/tablet.
export default function DashboardSidebar({ navItems, activeKey, onSelect, username, roleLabel, onLogout }) {
  const [open, setOpen] = useState(false)

  function handleSelect(key) {
    setOpen(false)
    onSelect(key)
  }

  // Single product brand logo
  const brand = (
    <Link
      to="/"
      className="flex items-center gap-2.5 font-display text-navy group"
      aria-label="Dipti&Suppliers — back to homepage"
    >
      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-ochre font-mono text-[11px] font-bold text-navy shadow-xs transition group-hover:scale-105">
        D&S
      </span>
      <span className="truncate text-base font-bold leading-tight text-navy">
        Dipti<span className="text-ochre">&</span>Suppliers
      </span>
    </Link>
  )

  // Clean user identity card (single product logo at top, no redundant second monogram icon)
  const identity = (
    <div className="rounded-lg border border-navy/10 bg-white/80 p-3 shadow-xs">
      <p className="font-mono text-[10px] uppercase tracking-wider text-navy/50">Signed in as</p>
      <p className="mt-0.5 truncate text-sm font-semibold capitalize text-navy">
        {username || (roleLabel ? `${roleLabel} Account` : "My Account")}
      </p>
      <div className="mt-1.5 flex items-center gap-1.5">
        <span className="inline-block rounded-full bg-ochre/15 px-2.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-ochre-ink">
          {roleLabel}
        </span>
      </div>
    </div>
  )

  const nav = (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const active = activeKey === item.key
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => handleSelect(item.key)}
            className={`relative rounded-md border-l-2 px-3 py-2.5 text-left font-mono text-[11px] uppercase tracking-wider transition ${
              active
                ? "border-ochre bg-white font-semibold text-navy shadow-xs"
                : "border-transparent text-navy/70 hover:bg-white/60 hover:text-navy"
            }`}
          >
            {item.label}
          </button>
        )
      })}
    </nav>
  )

  const logoutButton = (
    <button
      type="button"
      onClick={onLogout}
      className="mt-auto rounded-md border border-rust/30 bg-white/50 px-3 py-2 text-left font-mono text-[11px] uppercase tracking-wider text-rust transition hover:border-rust hover:bg-rust hover:text-white"
    >
      Log out
    </button>
  )

  const activeLabel = navItems.find((item) => item.key === activeKey)?.label || ""

  return (
    <>
      {/* Desktop sidebar — full height, pinned while content scrolls, greyish background */}
      <aside className="hidden w-64 flex-shrink-0 flex-col gap-6 overflow-y-auto border-r border-navy/10 bg-[#f1f3f5] p-5 text-navy lg:flex">
        {brand}
        {identity}
        <div className="flex flex-1 flex-col">
          {nav}
          {logoutButton}
        </div>
      </aside>

      {/* Mobile/tablet: compact top bar + slide-down drawer */}
      <div className="relative w-full border-b border-navy/10 bg-[#f1f3f5] text-navy lg:hidden">
        <div className="flex items-center justify-between gap-3 p-3">
          <div className="min-w-0 flex-1">{brand}</div>
          <span className="flex-shrink-0 font-mono text-[10px] uppercase tracking-wider text-ochre-ink">
            {activeLabel}
          </span>
          <button
            type="button"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md border border-navy/20 bg-white/70 text-navy transition hover:border-ochre hover:text-ochre focus:outline-none focus:ring-2 focus:ring-ochre"
          >
            {open ? <XMarkIcon className="h-5 w-5" aria-hidden="true" /> : <Bars3Icon className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
        <div className="border-t border-navy/10 p-3">{identity}</div>

        <AnimatePresence>
          {open && (
            <motion.div
              key="dashboard-drawer"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="overflow-hidden bg-[#f1f3f5] px-3 pb-3 text-navy"
            >
              {nav}
              <div className="mt-3 border-t border-navy/10 pt-3">{logoutButton}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
