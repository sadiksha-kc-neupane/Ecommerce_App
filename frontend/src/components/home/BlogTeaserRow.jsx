import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRightIcon } from "@heroicons/react/24/outline"
import SectionHeading from "../ui/SectionHeading.jsx"
import BlogCard from "../BlogCard.jsx"
import { fetchBlogs } from "../../lib/api.js"

export default function BlogTeaserRow() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBlogs()
      .then((data) => {
        if (Array.isArray(data)) {
          setBlogs(data.slice(0, 3))
        }
      })
      .catch((err) => {
        console.error("Error fetching homepage blog teaser:", err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (!loading && blogs.length === 0) {
    return null
  }

  return (
    <section className="py-16 sm:py-20 border-t border-navy/10 bg-white/50">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Knowledge & Resources"
          title="Hardware Guides & Insights"
          aside={
            <Link
              to="/blog-list"
              className="hidden font-mono text-[10px] uppercase tracking-wider text-navy/50 transition hover:text-ochre-ink sm:flex sm:items-center sm:gap-1"
            >
              View all articles <ArrowRightIcon className="h-3 w-3" />
            </Link>
          }
        />

        <div className="mt-8">
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-navy/10 bg-white p-4"
                >
                  <div className="aspect-[16/10] w-full rounded-xl bg-navy/5" />
                  <div className="mt-4 h-4 w-1/3 rounded bg-navy/10" />
                  <div className="mt-2 h-5 w-3/4 rounded bg-navy/10" />
                  <div className="mt-2 h-4 w-full rounded bg-navy/5" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/blog-list"
            className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-ochre-ink hover:text-navy"
          >
            View all articles <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
