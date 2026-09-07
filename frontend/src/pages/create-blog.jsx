import { useState, useEffect } from "react"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { toast } from "sonner"
import {
  SparklesIcon,
  ArrowLeftIcon,
  PhotoIcon,
  DocumentTextIcon,
  EyeIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import { createBlog, updateBlog, fetchBlogBySlug } from "../lib/api.js"
import { BLOG_CATEGORIES, getBlogCategoryLabel, getBlogCategoryColor } from "../lib/blogCategories.js"

const SAMPLE_THUMBNAILS = [
  {
    label: "Laptops & Workspace",
    url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=80",
  },
  {
    label: "Server & Data Center",
    url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80",
  },
  {
    label: "Security & CCTV",
    url: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1000&q=80",
  },
  {
    label: "Computer Hardware / Chips",
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80",
  },
  {
    label: "Interactive Displays",
    url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1000&q=80",
  },
]

export default function CreateBlog() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get("edit")
  const isEditing = Boolean(editId)

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    category: "buying-guides",
    thumbnail: "",
    description: "",
  })

  const [loading, setLoading] = useState(false)
  const [fetchingEdit, setFetchingEdit] = useState(isEditing)
  const [error, setError] = useState(null)
  const [previewMode, setPreviewMode] = useState(false)

  useEffect(() => {
    if (editId) {
      setFetchingEdit(true)
      fetchBlogBySlug(editId)
        .then((data) => {
          setForm({
            title: data.title || "",
            subtitle: data.subtitle || "",
            category: data.category || "buying-guides",
            thumbnail: data.thumbnail || "",
            description: data.description || "",
          })
        })
        .catch((err) => {
          toast.error("Failed to load existing post for editing")
          setError(err.message)
        })
        .finally(() => {
          setFetchingEdit(false)
        })
    }
  }, [editId])

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!form.title.trim()) {
      setError("Please enter an article title")
      return
    }
    if (!form.description.trim()) {
      setError("Please write article content")
      return
    }

    setLoading(true)
    try {
      if (isEditing) {
        const res = await updateBlog(editId, form)
        toast.success("Article updated successfully!")
        const targetSlug = res.data?.slug || editId
        navigate(`/blog/${targetSlug}`)
      } else {
        const res = await createBlog(form)
        toast.success("Article published successfully!")
        const targetSlug = res.data?.slug || res.data?.id
        navigate(`/blog/${targetSlug}`)
      }
    } catch (err) {
      console.error("Save blog error:", err)
      setError(err.message || "Failed to save article")
    } finally {
      setLoading(false)
    }
  }

  if (fetchingEdit) {
    return (
      <div className="flex min-h-screen flex-col bg-paper">
        <Navbar />
        <main className="flex flex-1 items-center justify-center p-12">
          <div className="font-mono text-xs uppercase tracking-widest text-navy/40 animate-pulse">
            Loading article details...
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const validCategories = BLOG_CATEGORIES.filter((c) => c.value !== "all")

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Navbar />

      <main className="flex-1 py-10 sm:py-14">
        <div className="mx-auto max-w-4xl px-6">
          {/* Header */}
          <div className="flex flex-col justify-between gap-4 border-b border-navy/10 pb-6 sm:flex-row sm:items-center">
            <div>
              <Link
                to="/blog-list"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-navy/60 transition hover:text-navy"
              >
                <ArrowLeftIcon className="h-3.5 w-3.5" />
                <span>Back to Guides</span>
              </Link>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-navy sm:text-3xl font-sans">
                {isEditing ? "Edit Article" : "Write New Article"}
              </h1>
              <p className="mt-1 text-xs text-navy/60 font-mono uppercase tracking-wider">
                Admin Publishing Panel • Dipti &amp; Suppliers
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPreviewMode(!previewMode)}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 font-mono text-xs uppercase tracking-wider transition cursor-pointer ${
                  previewMode
                    ? "border-ochre bg-ochre/15 text-navy font-semibold"
                    : "border-navy/15 bg-white text-navy/70 hover:bg-navy/5"
                }`}
              >
                <EyeIcon className="h-4 w-4" />
                {previewMode ? "Edit Form" : "Preview"}
              </button>
            </div>
          </div>

          {/* Form / Preview Container */}
          <div className="mt-8">
            {previewMode ? (
              /* Live Preview Mode */
              <div className="rounded-3xl border border-navy/10 bg-white p-8 sm:p-12 shadow-sm space-y-6">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${getBlogCategoryColor(
                      form.category
                    )}`}
                  >
                    {getBlogCategoryLabel(form.category)}
                  </span>
                  <span className="font-mono text-xs text-navy/40">•</span>
                  <span className="font-mono text-xs text-navy/50">Draft Preview</span>
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-navy font-sans">
                  {form.title || "Untitled Article"}
                </h1>

                {form.subtitle && (
                  <p className="text-lg text-navy/70 leading-relaxed">
                    {form.subtitle}
                  </p>
                )}

                {form.thumbnail && (
                  <div className="overflow-hidden rounded-2xl border border-navy/10">
                    <img
                      src={form.thumbnail}
                      alt="Thumbnail preview"
                      className="max-h-80 w-full object-cover"
                    />
                  </div>
                )}

                <div className="space-y-4 border-t border-navy/10 pt-6 text-navy/85 leading-relaxed">
                  {form.description ? (
                    form.description
                      .split(/\n\s*\n/)
                      .map((p, idx) => <p key={idx}>{p}</p>)
                  ) : (
                    <p className="italic text-navy/40">No content entered yet.</p>
                  )}
                </div>

                <div className="pt-6 border-t border-navy/10 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setPreviewMode(false)}
                    className="rounded-xl bg-navy px-4 py-2 font-mono text-xs uppercase tracking-wider text-cream hover:bg-ochre hover:text-navy"
                  >
                    Return to Editing
                  </button>
                </div>
              </div>
            ) : (
              /* Edit Form Mode */
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="rounded-3xl border border-navy/10 bg-white p-6 sm:p-10 shadow-sm space-y-6">
                  {/* Title */}
                  <div>
                    <label
                      htmlFor="title"
                      className="block font-mono text-xs uppercase tracking-wider text-navy/70 mb-2"
                    >
                      Article Title <span className="text-rust">*</span>
                    </label>
                    <input
                      id="title"
                      type="text"
                      required
                      placeholder="e.g. Complete Buyer's Guide to Enterprise Smartboards in 2026"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy placeholder:text-navy/35 outline-none transition focus:border-ochre focus:ring-2 focus:ring-ochre/20"
                    />
                    <p className="mt-1.5 font-mono text-[11px] text-navy/40">
                      A clean URL slug will be automatically generated from this title.
                    </p>
                  </div>

                  {/* Subtitle */}
                  <div>
                    <label
                      htmlFor="subtitle"
                      className="block font-mono text-xs uppercase tracking-wider text-navy/70 mb-2"
                    >
                      Subtitle / Brief Summary
                    </label>
                    <input
                      id="subtitle"
                      type="text"
                      placeholder="e.g. Essential specs, resolution comparisons, and brand recommendations."
                      value={form.subtitle}
                      onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                      className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy placeholder:text-navy/35 outline-none transition focus:border-ochre focus:ring-2 focus:ring-ochre/20"
                    />
                  </div>

                  {/* Category Selection */}
                  <div>
                    <label
                      htmlFor="category"
                      className="block font-mono text-xs uppercase tracking-wider text-navy/70 mb-2"
                    >
                      Category <span className="text-rust">*</span>
                    </label>
                    <select
                      id="category"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy outline-none transition focus:border-ochre focus:ring-2 focus:ring-ochre/20 cursor-pointer"
                    >
                      {validCategories.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label} ({c.description})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Thumbnail Image URL with Preset Pickers */}
                  <div>
                    <label
                      htmlFor="thumbnail"
                      className="block font-mono text-xs uppercase tracking-wider text-navy/70 mb-2"
                    >
                      Featured Image / Thumbnail URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="thumbnail"
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={form.thumbnail}
                        onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                        className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy placeholder:text-navy/35 outline-none transition focus:border-ochre focus:ring-2 focus:ring-ochre/20"
                      />
                    </div>

                    {/* Quick Preset Images */}
                    <div className="mt-3">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-navy/50 mb-2">
                        Quick Presets (click to select):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {SAMPLE_THUMBNAILS.map((item, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setForm({ ...form, thumbnail: item.url })}
                            className="rounded-lg border border-navy/10 bg-navy/5 px-2.5 py-1 font-mono text-[11px] text-navy/70 transition hover:border-ochre hover:bg-ochre/15 hover:text-navy cursor-pointer"
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {form.thumbnail && (
                      <div className="mt-4 overflow-hidden rounded-xl border border-navy/10 bg-navy/5 max-w-sm">
                        <img
                          src={form.thumbnail}
                          alt="Preview"
                          className="h-36 w-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none"
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Article Content Textarea */}
                  <div>
                    <label
                      htmlFor="description"
                      className="block font-mono text-xs uppercase tracking-wider text-navy/70 mb-2"
                    >
                      Article Content <span className="text-rust">*</span>
                    </label>
                    <textarea
                      id="description"
                      rows={14}
                      required
                      placeholder="Write your article here. Separate paragraphs with an empty line.&#10;&#10;Explain technical details, product comparisons, or store policies clearly for customers."
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full rounded-xl border border-navy/15 bg-white p-4 font-sans text-sm text-navy placeholder:text-navy/35 outline-none transition focus:border-ochre focus:ring-2 focus:ring-ochre/20 leading-relaxed"
                    />
                  </div>

                  {error && (
                    <div className="rounded-xl bg-rust/10 p-3.5 text-xs font-medium text-rust">
                      {error}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex items-center justify-end gap-3 border-t border-navy/10 pt-6">
                    <Link
                      to="/blog-list"
                      className="rounded-xl border border-navy/15 px-5 py-3 font-mono text-xs uppercase tracking-wider text-navy transition hover:bg-navy/5"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center justify-center rounded-xl bg-ochre px-6 py-3 font-mono text-xs uppercase tracking-widest text-navy transition hover:bg-navy hover:text-cream disabled:opacity-50 cursor-pointer shadow-sm font-semibold"
                    >
                      {loading
                        ? isEditing
                          ? "Updating..."
                          : "Publishing..."
                        : isEditing
                        ? "Save Changes"
                        : "Publish Article"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
