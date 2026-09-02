import { Blog } from "../model/index.js"

// POST /blog
export const BlogController = async (req, res) => {
  const { title, subtitle, description, category } = req.body

  await Blog.create({
    title,
    subtitle,
    description,
    category,
  })
  res.send("this is blog")
}

// GET /fetch-blog
// (BUG FIX: original called product.findAll() here instead of blog.findAll())
export const fetchBlog = async (req, res) => {
  const blogdatas = await Blog.findAll()
  res.send(blogdatas)
}

// GET /fetch-single-blog/:id
export const fetchSingleBlog = async (req, res) => {
  const id = req.params.id
  const data = await Blog.findAll({ where: { id } })
  res.send(data)
}

// PATCH /update-blog/:id
export const editBlog = async (req, res) => {
  const id = req.params.id
  const { title, description, subtitle, category } = req.body

  await Blog.update(
    {
      title,
      description,
      subtitle,
      category,
    },
    { where: { id } }
  )
  res.send("updated sucessfully")
}


