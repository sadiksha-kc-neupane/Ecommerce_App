import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"

function initials(name) {
  if (!name) return "?"
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

// Shared dashboard navigation: a fixed navy sidebar on desktop (lg+) that
// collapses into a compact top bar with a slide-down drawer on mobile/tablet.
// The currently-active section is always labelled in the top bar and
// highlighted in the drawer.
export default function DashboardSidebar({ navItems, activeKey, onSelect, username, roleLabel, onLogout }) {
  const [open, setOpen] = useState(false)

  function handleSelect(key) {
    setOpen(false)
    onSelect(key)
  }

  const identity = (
    <div className="flex items-center gap-3 rounded-md bg-navy/5 p-3">
      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-ochre bg-white font-mono text-sm font-semibold text-ochre-ink">
        {initials(username)}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm capitalize text-navy">{username || roleLabel}</p>
        <span className="mt-0.5 inline-block rounded-full bg-ochre/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-ochre-ink">
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
            className={`relative border-l-2 px-3 py-2 text-left font-mono text-[11px] uppercase tracking-widest transition ${
              active
                ? "border-ochre bg-ochre/10 text-navy"
                : "border-transparent text-navy/60 hover:bg-navy/5 hover:text-navy"
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
      className="mt-auto rounded-sm border border-rust/40 px-3 py-2 text-left font-mono text-[11px] uppercase tracking-widest text-rust/80 transition hover:bg-rust hover:text-cream"
    >
      Log out
    </button>
  )

  const activeLabel = navItems.find((item) => item.key === activeKey)?.label || ""

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-60 flex-col rounded-md border border-navy/10 bg-paper p-4 text-navy lg:sticky lg:top-24 lg:flex">
        <div className="mb-6">{identity}</div>
        {nav}
        {logoutButton}
      </aside>

      {/* Mobile/tablet: compact top bar + slide-down drawer */}
      <div className="relative w-full lg:hidden">
        <div className="flex items-center justify-between gap-3 rounded-md border border-navy/10 bg-paper p-3 text-navy">
          <div className="min-w-0 flex-1">{identity}</div>
          <span className="flex-shrink-0 px-2 font-mono text-[10px] uppercase tracking-widest text-ochre-ink">
            {activeLabel}
          </span>
          <button
            type="button"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border border-navy/20 text-navy transition hover:border-ochre hover:text-ochre focus:outline-none focus:ring-2 focus:ring-ochre"
          >
            {open ? <XMarkIcon className="h-5 w-5" aria-hidden="true" /> : <Bars3Icon className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              key="dashboard-drawer"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-md border border-navy/10 bg-paper p-3 text-navy shadow-2xl shadow-navy/20"
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
