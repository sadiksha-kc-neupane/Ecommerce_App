import { useState, useEffect, useMemo } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import {
  MagnifyingGlassIcon,
  PlusIcon,
  BookOpenIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import BlogCard from "../components/BlogCard.jsx"
import { fetchBlogs } from "../lib/api.js"
import { getCurrentUser } from "../lib/auth.js"
import { BLOG_CATEGORIES } from "../lib/blogCategories.js"

export default function BlogList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentCategory = searchParams.get("category") || "all"
  const user = getCurrentUser()
  const isAdmin = user && user.role === "admin"

  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState("")

  useEffect(() => {
    setLoading(true)
    setError(null)
    const params = currentCategory !== "all" ? { category: currentCategory } : undefined
    fetchBlogs(params)
      .then((data) => {
        setBlogs(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        console.error("Error loading blogs:", err)
        setError(err.message || "Failed to load articles")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [currentCategory])

  const filteredBlogs = useMemo(() => {
    if (!search.trim()) return blogs
    const q = search.toLowerCase().trim()
    return blogs.filter(
      (b) =>
        b.title?.toLowerCase().includes(q) ||
        b.description?.toLowerCase().includes(q) ||
        b.subtitle?.toLowerCase().includes(q)
    )
  }, [blogs, search])

  const featuredPost = useMemo(() => {
    if (filteredBlogs.length === 0) return null
    // Pick the most recent post as hero if looking at "all" and no active search
    return currentCategory === "all" && !search.trim() ? filteredBlogs[0] : null
  }, [filteredBlogs, currentCategory, search])

  const remainingPosts = useMemo(() => {
    if (!featuredPost) return filteredBlogs
    return filteredBlogs.slice(1)
  }, [filteredBlogs, featuredPost])

  function handleCategoryChange(catValue) {
    if (catValue === "all") {
      searchParams.delete("category")
      setSearchParams(searchParams)
    } else {
      setSearchParams({ category: catValue })
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Navbar />

      <main className="flex-1">
        {/* Hero Header Section */}
        <section className="border-b border-navy/10 bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-ochre/20 text-ochre-ink">
                    <SparklesIcon className="h-3.5 w-3.5" />
                  </span>
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-navy/60">
                    Dipti &amp; Suppliers Knowledge Hub
                  </span>
                </div>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl font-sans">
                  Hardware Guides &amp; Insights
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-navy/70 sm:text-base">
                  Expert purchasing checklists, IT setup walkthroughs, hardware troubleshooting, and store announcements curated by our engineering team.
                </p>
              </div>

              {isAdmin && (
                <div className="flex-shrink-0">
                  <Link
                    to="/create-blog"
                    className="inline-flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-cream shadow-sm transition hover:bg-ochre hover:text-navy cursor-pointer"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Write New Article
                  </Link>
                </div>
              )}
            </div>

            {/* Filter and Search Bar */}
            <div className="mt-10 flex flex-col gap-4 border-t border-navy/10 pt-6 md:flex-row md:items-center md:justify-between">
              {/* Category Pills */}
              <div className="scroll-slim flex gap-2 overflow-x-auto pb-2 md:pb-0">
                {BLOG_CATEGORIES.map((cat) => {
                  const isActive = currentCategory === cat.value
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => handleCategoryChange(cat.value)}
                      className={`whitespace-nowrap rounded-full px-4 py-1.5 font-mono text-xs uppercase tracking-wider transition cursor-pointer ${
                        isActive
                          ? "bg-navy text-cream font-semibold shadow-sm"
                          : "border border-navy/15 bg-white text-navy/70 hover:border-navy/40 hover:text-navy"
                      }`}
                    >
                      {cat.label}
                    </button>
                  )
                })}
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-72">
                <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-navy/15 bg-white py-2 pl-9 pr-4 text-xs text-navy outline-none placeholder:text-navy/40 focus:border-ochre focus:ring-1 focus:ring-ochre"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-navy/40 hover:text-navy"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="mx-auto max-w-6xl px-6 py-12">
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-navy/10 bg-white p-4"
                >
                  <div className="aspect-[16/10] w-full rounded-xl bg-navy/5" />
                  <div className="mt-4 h-4 w-1/3 rounded bg-navy/10" />
                  <div className="mt-2 h-6 w-3/4 rounded bg-navy/10" />
                  <div className="mt-2 h-4 w-full rounded bg-navy/5" />
                  <div className="mt-4 h-4 w-1/4 rounded bg-navy/5" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-rust/20 bg-rust/5 p-12 text-center">
              <p className="text-sm font-semibold text-rust">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 rounded-xl bg-navy px-4 py-2 font-mono text-xs text-cream hover:bg-ochre hover:text-navy"
              >
                Retry
              </button>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="rounded-3xl border border-navy/10 bg-white p-16 text-center shadow-sm">
              <BookOpenIcon className="mx-auto h-12 w-12 text-navy/30" />
              <h3 className="mt-4 text-lg font-bold text-navy font-sans">
                No articles found
              </h3>
              <p className="mt-1 text-sm text-navy/60">
                {search
                  ? `No posts matching "${search}". Try adjusting your search query.`
                  : `No articles available in this category yet.`}
              </p>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="mt-4 font-mono text-xs font-semibold text-ochre-ink hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-10">
              {/* Featured Hero Article */}
              {featuredPost && (
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-navy/50">
                      Featured Highlight
                    </span>
                  </div>
                  <BlogCard blog={featuredPost} featured={true} />
                </div>
              )}

              {/* Grid of Remaining Articles */}
              {remainingPosts.length > 0 && (
                <div>
                  {featuredPost && (
                    <h2 className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-navy/50">
                      Latest Articles &amp; Updates
                    </h2>
                  )}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {remainingPosts.map((blog) => (
                      <BlogCard key={blog.id} blog={blog} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
