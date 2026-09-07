import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { toast } from "sonner"
import {
  CalendarIcon,
  ClockIcon,
  UserCircleIcon,
  ShareIcon,
  ArrowLeftIcon,
  PencilSquareIcon,
  TrashIcon,
  BookOpenIcon,
  CheckIcon,
} from "@heroicons/react/24/outline"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import BlogCard from "../components/BlogCard.jsx"
import { fetchBlogBySlug, fetchBlogs, deleteBlog } from "../lib/api.js"
import { getCurrentUser } from "../lib/auth.js"
import {
  getBlogCategoryLabel,
  getBlogCategoryColor,
  estimateReadingTime,
  formatDate,
} from "../lib/blogCategories.js"

export default function BlogPost() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const user = getCurrentUser()
  const isAdmin = user && user.role === "admin"

  const [blog, setBlog] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(null)
    window.scrollTo({ top: 0, behavior: "smooth" })

    fetchBlogBySlug(slug)
      .then((data) => {
        setBlog(data)
        // Fetch related posts from same category or latest
        return fetchBlogs({ category: data.category })
      })
      .then((allCategoryBlogs) => {
        if (Array.isArray(allCategoryBlogs)) {
          const others = allCategoryBlogs.filter((b) => b.slug !== slug && b.id !== slug).slice(0, 3)
          setRelated(others)
        }
      })
      .catch((err) => {
        console.error("Error loading blog post:", err)
        setError(err.message || "Article not found")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [slug])

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    toast.success("Link copied to clipboard!")
    setTimeout(() => setCopied(false), 2500)
  }

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
      return
    }

    setDeleting(true)
    try {
      await deleteBlog(blog.id)
      toast.success("Article deleted successfully")
      navigate("/blog-list")
    } catch (err) {
      toast.error(err.message || "Failed to delete article")
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-paper">
        <Navbar />
        <main className="flex-1 py-16">
          <div className="mx-auto max-w-3xl px-6 animate-pulse space-y-6">
            <div className="h-4 w-32 rounded bg-navy/10" />
            <div className="h-10 w-3/4 rounded bg-navy/10" />
            <div className="h-6 w-1/2 rounded bg-navy/5" />
            <div className="aspect-[16/9] w-full rounded-2xl bg-navy/10" />
            <div className="space-y-3 pt-6">
              <div className="h-4 w-full rounded bg-navy/5" />
              <div className="h-4 w-full rounded bg-navy/5" />
              <div className="h-4 w-3/4 rounded bg-navy/5" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="flex min-h-screen flex-col bg-paper">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-6 py-20">
          <div className="max-w-md text-center">
            <BookOpenIcon className="mx-auto h-16 w-16 text-navy/30" />
            <h1 className="mt-4 text-2xl font-bold text-navy font-sans">
              Article Not Found
            </h1>
            <p className="mt-2 text-sm text-navy/60">
              The article you&apos;re looking for may have been moved, renamed, or deleted.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                to="/blog-list"
                className="rounded-xl bg-navy px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-cream transition hover:bg-ochre hover:text-navy"
              >
                Back to All Articles
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const categoryLabel = getBlogCategoryLabel(blog.category)
  const categoryBadgeClass = getBlogCategoryColor(blog.category)
  const readingTime = estimateReadingTime(blog.description)
  const formattedDate = formatDate(blog.createdAt)
  const thumbnail =
    blog.thumbnail ||
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80"

  // Split description text into paragraphs
  const paragraphs = blog.description
    ? blog.description.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
    : []

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Navbar />

      <main className="flex-1 pb-20">
        {/* Article Header & Hero */}
        <header className="border-b border-navy/10 bg-white py-10 sm:py-14">
          <div className="mx-auto max-w-4xl px-6">
            {/* Breadcrumb & Navigation */}
            <div className="flex items-center justify-between gap-4">
              <Link
                to="/blog-list"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-navy/60 transition hover:text-navy"
              >
                <ArrowLeftIcon className="h-3.5 w-3.5" />
                <span>All Articles</span>
              </Link>

              {isAdmin && (
                <div className="flex items-center gap-2">
                  <Link
                    to={`/create-blog?edit=${blog.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-navy/15 bg-white px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-navy transition hover:border-navy hover:bg-navy/5"
                  >
                    <PencilSquareIcon className="h-3.5 w-3.5" />
                    Edit
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-rust/20 bg-rust/5 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-rust transition hover:bg-rust/10 cursor-pointer disabled:opacity-50"
                  >
                    <TrashIcon className="h-3.5 w-3.5" />
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              )}
            </div>

            {/* Category & Metadata */}
            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <span
                className={`inline-flex items-center rounded-full border px-3 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider ${categoryBadgeClass}`}
              >
                {categoryLabel}
              </span>
              <span className="font-mono text-xs text-navy/40">•</span>
              <span className="flex items-center gap-1 font-mono text-xs text-navy/60">
                <CalendarIcon className="h-3.5 w-3.5" />
                {formattedDate}
              </span>
              <span className="font-mono text-xs text-navy/40">•</span>
              <span className="flex items-center gap-1 font-mono text-xs text-navy/60">
                <ClockIcon className="h-3.5 w-3.5" />
                {readingTime}
              </span>
            </div>

            {/* Headline Title */}
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl font-sans leading-tight">
              {blog.title}
            </h1>

            {/* Subtitle if available */}
            {blog.subtitle && (
              <p className="mt-4 text-lg leading-relaxed text-navy/70 sm:text-xl">
                {blog.subtitle}
              </p>
            )}

            {/* Author bar & Share */}
            <div className="mt-8 flex items-center justify-between border-t border-navy/10 pt-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy font-display text-sm font-bold text-cream">
                  {blog.User?.username ? blog.User.username.slice(0, 1).toUpperCase() : "D"}
                </span>
                <div>
                  <p className="text-sm font-semibold text-navy capitalize">
                    {blog.User?.username || "Dipti & Suppliers Editorial"}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-navy/50">
                    Hardware &amp; IT Solutions Team
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 rounded-full border border-navy/15 bg-white px-3.5 py-1.5 font-mono text-xs font-medium text-navy transition hover:border-navy hover:bg-navy/5 cursor-pointer shadow-sm"
              >
                {copied ? (
                  <>
                    <CheckIcon className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <ShareIcon className="h-3.5 w-3.5 text-navy/60" />
                    <span>Share Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Hero Featured Thumbnail */}
        <div className="mx-auto max-w-4xl px-6 pt-10">
          <div className="overflow-hidden rounded-3xl border border-navy/10 bg-navy/5 shadow-sm">
            <img
              src={thumbnail}
              alt={blog.title}
              className="h-auto max-h-[480px] w-full object-cover"
            />
          </div>
        </div>

        {/* Article Body Content */}
        <article className="mx-auto max-w-3xl px-6 pt-10">
          <div className="rounded-3xl border border-navy/10 bg-white p-8 sm:p-12 shadow-sm">
            <div className="prose prose-navy max-w-none space-y-6 text-base leading-relaxed text-navy/85 font-sans">
              {paragraphs.length > 0 ? (
                paragraphs.map((p, idx) => (
                  <p key={idx} className="leading-relaxed text-navy/80 sm:text-lg">
                    {p}
                  </p>
                ))
              ) : (
                <p className="text-navy/60 italic">No content available for this article.</p>
              )}
            </div>

            {/* In-article CTA banner */}
            <div className="mt-12 rounded-2xl border border-ochre/30 bg-ochre/10 p-6 sm:p-8">
              <h3 className="text-lg font-bold text-navy font-sans">
                Need IT Hardware for your Organization?
              </h3>
              <p className="mt-1.5 text-sm text-navy/75 leading-relaxed">
                Dipti &amp; Suppliers supplies genuine enterprise laptops, servers, security systems, and interactive displays with manufacturer warranty.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  to="/product-list"
                  className="rounded-xl bg-navy px-4 py-2 font-mono text-xs uppercase tracking-wider text-cream transition hover:bg-ochre hover:text-navy"
                >
                  Browse Hardware Catalog
                </Link>
                <Link
                  to="/contact"
                  className="rounded-xl border border-navy/20 bg-white px-4 py-2 font-mono text-xs uppercase tracking-wider text-navy transition hover:bg-navy/5"
                >
                  Request Quotation
                </Link>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts Section */}
        {related.length > 0 && (
          <section className="mx-auto max-w-6xl px-6 pt-16">
            <div className="flex items-center justify-between border-t border-navy/10 pt-10">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-navy font-sans">
                  Related Guides &amp; Articles
                </h2>
                <p className="mt-1 text-sm text-navy/60">
                  More insights from {categoryLabel}
                </p>
              </div>
              <Link
                to="/blog-list"
                className="font-mono text-xs font-semibold uppercase tracking-wider text-ochre-ink hover:text-navy"
              >
                View all &rarr;
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <BlogCard key={item.id} blog={item} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
