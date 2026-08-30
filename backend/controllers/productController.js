import { Product } from "../model/index.js"

const MAX_PRODUCT_IMAGES = 5

// Normalizes the `images` field sent by the client.
// - not provided -> empty array
// - not an array -> rejected ({ ok:false }) so the caller can 400
// - array        -> keeps only non-empty strings, silently truncates to 5
function normalizeImages(images) {
  if (images === undefined || images === null) {
    return { ok: true, value: [] }
  }
  if (!Array.isArray(images)) {
    return { ok: false, message: "images must be an array of strings" }
  }
  const cleaned = images
    .filter((u) => typeof u === "string" && u.trim() !== "")
    .slice(0, MAX_PRODUCT_IMAGES)
  return { ok: true, value: cleaned }
}

// POST /product
export const ProductController = async (req, res) => {
  const userId = req.user.id
  const { productName, description, price, stock, images, category, status, subcategory } = req.body

  const img = normalizeImages(images)
  if (!img.ok) {
    return res.status(400).json({ message: img.message })
  }

  console.log(
    "data",
    productName,
    description,
    price,
    stock,
    img.value
  )

  try {
    const productData = await Product.create({
      userId,
      productName,
      price,
      description,
      stock,
      productImages: img.value,
      category,
      status,
      subcategory,
    })

    console.log("product-data", productData)
    res.status(200).json({
      message: "product is registered",
      data: productData,
    })
  } catch (error) {
    console.error("ProductController error:", error.message)
    res.status(500).json({ message: "Failed to create product", error: error.message })
  }
}

// GET /fetch-product
export const fetchProduct = async (req, res) => {
  const productdatas = await Product.findAll()
  res.json({ data: productdatas })
}

// GET /fetch-single-product/:id
// (BUG FIX: original called user.findAll() here instead of product.findAll())
export const fetchSingleProduct = async (req, res) => {
  const id = req.params.id
  const data = await Product.findAll({ where: { id } })
  res.send(data)
}

// PATCH /update-product/:id
// (BUG FIX: original called blog.update() here instead of product.update())
export const editProduct = async (req, res) => {
  const id = req.params.id
  const userId = req.user.id
  const { productName, price, stock, description, images, subcategory } = req.body

  const img = normalizeImages(images)
  if (!img.ok) {
    return res.status(400).json({ message: img.message })
  }

  const [updatedRows] = await Product.update(
    {
      productName,
      price,
      stock,
      description,
      productImages: img.value,
      subcategory,
    },
    { where: { id, userId } }
  )

  if (updatedRows === 0) {
    return res.status(404).json({ message: "Product not found or not owned by you" })
  }
  res.json({ message: "updated sucessfully" })
}

// DELETE /delete-product/:id
export const deleteProduct = async (req, res) => {
  const Productid = req.params.id
  const userId = req.user.id

  const deletedRows = await Product.destroy({ where: { id: Productid, userId } })

  if (deletedRows === 0) {
    return res.status(404).json({ message: "Product not found or not owned by you" })
  }
  res.status(200).json({ message: "deleted sucessfully" })
}