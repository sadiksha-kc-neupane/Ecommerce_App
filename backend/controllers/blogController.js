import { Op } from "sequelize"
import { Blog, User } from "../model/index.js"

export function slugify(text) {
  if (!text) return ""
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove non-word chars (except spaces and hyphens)
    .replace(/[\s_-]+/g, "-") // Replace spaces and multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, "") // Trim leading and trailing hyphens
}

export async function generateUniqueSlug(title, currentBlogId = null) {
  const baseSlug = slugify(title) || `post-${Date.now()}`
  let slug = baseSlug
  let counter = 1

  while (true) {
    const where = { slug }
    if (currentBlogId) {
      where.id = { [Op.ne]: currentBlogId }
    }
    const existing = await Blog.findOne({ where })
    if (!existing) {
      return slug
    }
    slug = `${baseSlug}-${counter}`
    counter++
  }
}

// POST /blog (Admin only)
export const BlogController = async (req, res) => {
  try {
    const { title, subtitle, description, category, thumbnail } = req.body

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" })
    }

    const validCategories = ["buying-guides", "tech-tips", "announcements", "news"]
    const selectedCategory = validCategories.includes(category) ? category : "news"

    const slug = await generateUniqueSlug(title)

    const blog = await Blog.create({
      userId: req.user?.id || null,
      title: title.trim(),
      slug,
      subtitle: subtitle ? subtitle.trim() : null,
      description: description.trim(),
      category: selectedCategory,
      thumbnail: thumbnail || null,
    })

    return res.status(201).json({
      message: "Blog post created successfully",
      data: blog,
    })
  } catch (error) {
    console.error("BlogController create error:", error)
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "A blog post with this title or slug already exists" })
    }
    return res.status(500).json({ message: "Failed to create blog post" })
  }
}

// GET /fetch-blog (Public)
export const fetchBlog = async (req, res) => {
  try {
    const { category, search } = req.query
    const where = {}

    if (category && category !== "all") {
      where.category = category
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { subtitle: { [Op.iLike]: `%${search}%` } },
      ]
    }

    const blogs = await Blog.findAll({
      where,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["id", "username"],
          required: false,
        },
      ],
    })

    return res.status(200).json(blogs)
  } catch (error) {
    console.error("fetchBlog error:", error)
    return res.status(500).json({ message: "Failed to fetch blog posts" })
  }
}

// GET /fetch-single-blog/:identifier (Public - supports id or slug)
export const fetchSingleBlog = async (req, res) => {
  try {
    const { id: identifier } = req.params

    if (!identifier) {
      return res.status(400).json({ message: "Blog identifier is required" })
    }

    const isNumeric = /^\d+$/.test(identifier)
    const where = isNumeric
      ? { [Op.or]: [{ id: parseInt(identifier, 10) }, { slug: identifier }] }
      : { slug: identifier }

    const blog = await Blog.findOne({
      where,
      include: [
        {
          model: User,
          attributes: ["id", "username"],
          required: false,
        },
      ],
    })

    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" })
    }

    return res.status(200).json(blog)
  } catch (error) {
    console.error("fetchSingleBlog error:", error)
    return res.status(500).json({ message: "Failed to fetch blog post" })
  }
}

// PATCH /update-blog/:id (Admin only)
export const editBlog = async (req, res) => {
  try {
    const { id } = req.params
    const { title, subtitle, description, category, thumbnail, slug: customSlug } = req.body

    const isNumeric = /^\d+$/.test(id)
    const where = isNumeric ? { id: parseInt(id, 10) } : { slug: id }

    const blog = await Blog.findOne({ where })
    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" })
    }

    let finalSlug = blog.slug
    if (customSlug && customSlug.trim() !== blog.slug) {
      finalSlug = await generateUniqueSlug(customSlug, blog.id)
    } else if (title && title.trim() !== blog.title && !customSlug) {
      finalSlug = await generateUniqueSlug(title, blog.id)
    }

    const validCategories = ["buying-guides", "tech-tips", "announcements", "news"]
    const selectedCategory = category && validCategories.includes(category) ? category : blog.category

    await blog.update({
      title: title !== undefined ? title.trim() : blog.title,
      slug: finalSlug,
      subtitle: subtitle !== undefined ? (subtitle ? subtitle.trim() : null) : blog.subtitle,
      description: description !== undefined ? description.trim() : blog.description,
      category: selectedCategory,
      thumbnail: thumbnail !== undefined ? (thumbnail ? thumbnail.trim() : null) : blog.thumbnail,
    })

    return res.status(200).json({
      message: "Blog post updated successfully",
      data: blog,
    })
  } catch (error) {
    console.error("editBlog error:", error)
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "A blog post with this title or slug already exists" })
    }
    return res.status(500).json({ message: "Failed to update blog post" })
  }
}

// DELETE /delete-blog/:id (Admin only)
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params
    const isNumeric = /^\d+$/.test(id)
    const where = isNumeric ? { id: parseInt(id, 10) } : { slug: id }

    const blog = await Blog.findOne({ where })
    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" })
    }

    await blog.destroy()
    return res.status(200).json({ message: "Blog post deleted successfully" })
  } catch (error) {
    console.error("deleteBlog error:", error)
    return res.status(500).json({ message: "Failed to delete blog post" })
  }
}
