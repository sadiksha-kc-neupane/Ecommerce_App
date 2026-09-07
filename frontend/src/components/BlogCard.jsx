import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  CalendarIcon,
  ClockIcon,
  BookOpenIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline"
import {
  getBlogCategoryLabel,
  getBlogCategoryColor,
  estimateReadingTime,
  formatDate,
} from "../lib/blogCategories.js"

export default function BlogCard({ blog, featured = false }) {
  if (!blog) return null

  const slug = blog.slug || blog.id
  const categoryLabel = getBlogCategoryLabel(blog.category)
  const categoryBadgeClass = getBlogCategoryColor(blog.category)
  const readingTime = estimateReadingTime(blog.description)
  const formattedDate = formatDate(blog.createdAt)

  // Fallback image if thumbnail is missing
  const thumbnail =
    blog.thumbnail ||
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80"

  const excerpt =
    blog.subtitle ||
    (blog.description
      ? blog.description.length > 150
        ? `${blog.description.slice(0, 150).trim()}…`
        : blog.description
      : "Read complete hardware insights and recommendations.")

  if (featured) {
    return (
      <motion.article
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2 }}
        className="group relative flex flex-col overflow-hidden rounded-3xl border border-navy/10 bg-white shadow-sm transition hover:border-navy/20 hover:shadow-card md:flex-row"
      >
        <Link
          to={`/blog/${slug}`}
          className="relative h-64 w-full overflow-hidden bg-navy/5 md:h-auto md:w-1/2"
        >
          <img
            src={thumbnail}
            alt={blog.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/30 via-transparent to-transparent md:hidden" />
          <div className="absolute left-4 top-4">
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider ${categoryBadgeClass}`}
            >
              {categoryLabel}
            </span>
          </div>
        </Link>

        <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
          <div>
            <div className="hidden items-center gap-2 md:flex">
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider ${categoryBadgeClass}`}
              >
                {categoryLabel}
              </span>
              <span className="font-mono text-[11px] text-navy/40">•</span>
              <span className="flex items-center gap-1 font-mono text-[11px] text-navy/50">
                <ClockIcon className="h-3.5 w-3.5" />
                {readingTime}
              </span>
            </div>

            <Link to={`/blog/${slug}`} className="mt-3 block">
              <h2 className="text-xl font-bold tracking-tight text-navy transition group-hover:text-ochre-ink sm:text-2xl font-sans">
                {blog.title}
              </h2>
            </Link>

            <p className="mt-3 text-sm leading-relaxed text-navy/70 line-clamp-3">
              {excerpt}
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-navy/10 pt-4">
            <div className="flex items-center gap-2 font-mono text-[11px] text-navy/50">
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>{formattedDate}</span>
              {blog.User?.username && (
                <>
                  <span>•</span>
                  <span className="capitalize">{blog.User.username}</span>
                </>
              )}
            </div>

            <Link
              to={`/blog/${slug}`}
              className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-ochre-ink transition hover:text-navy"
            >
              Read post <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </motion.article>
    )
  }

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-sm transition hover:border-navy/20 hover:shadow-card"
    >
      {/* Thumbnail */}
      <Link to={`/blog/${slug}`} className="relative aspect-[16/10] w-full overflow-hidden bg-navy/5">
        <img
          src={thumbnail}
          alt={blog.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute left-3.5 top-3.5">
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider shadow-sm ${categoryBadgeClass}`}
          >
            {categoryLabel}
          </span>
        </div>
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-navy/40">
            <span className="flex items-center gap-1">
              <CalendarIcon className="h-3 w-3" />
              {formattedDate}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ClockIcon className="h-3 w-3" />
              {readingTime}
            </span>
          </div>

          <Link to={`/blog/${slug}`} className="mt-2.5 block">
            <h3 className="text-base font-bold leading-snug tracking-tight text-navy transition group-hover:text-ochre-ink line-clamp-2">
              {blog.title}
            </h3>
          </Link>

          <p className="mt-2 text-xs leading-relaxed text-navy/65 line-clamp-3">
            {excerpt}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-navy/5 pt-3.5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-navy/40">
            {blog.User?.username ? `By ${blog.User.username}` : "Dipti Editorial"}
          </span>

          <Link
            to={`/blog/${slug}`}
            className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-ochre-ink transition hover:text-navy"
          >
            Read <ArrowRightIcon className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}
