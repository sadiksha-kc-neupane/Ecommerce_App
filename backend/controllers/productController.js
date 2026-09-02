import { Product } from "../model/index.js"

const MAX_PRODUCT_IMAGES = 5

// Must match the ENUM on the Product model (backend/model/Product.js).
const CATEGORIES = ["smartboard", "desktop", "laptop", "components", "cctv", "printer_scanner", "networking"]
const STATUSES = ["in_stock", "out_of_stock", "discontinued"]

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

// Shared server-side validation + normalization for product payloads. Used by
// BOTH create and update so the rules can never drift apart.
//
// - When `partial` is false (create), the required fields must be present.
// - When `partial` is true (edit/update), only the fields that were actually
//   sent are validated and returned; absent fields are simply omitted.
//
// Returns { ok: true, values } on success or { ok: false, message } on failure.
// Numbers are always sanitised server-side — never trust the client.
//
// NOTE on `subcategory`: it is intentionally a free-form optional string. It is
// NOT DB-ENFORCED — the frontend drives the dropdown per category and adjusts it
// without migrations (see frontend/src/lib/categories.js). So we only coerce it
// to a trimmed string (or undefined) rather than pinning it to a fixed list.
function validateProductPayload(input = {}, { partial = false } = {}) {
  const values = {}

  if (input.productName !== undefined) {
    if (typeof input.productName !== "string" || !input.productName.trim()) {
      return { ok: false, message: "productName is required" }
    }
    values.productName = input.productName.trim()
  } else if (!partial) {
    return { ok: false, message: "productName is required" }
  }

  if (input.price !== undefined && input.price !== null && input.price !== "") {
    const cleanPrice = Number(input.price)
    if (!Number.isFinite(cleanPrice) || cleanPrice <= 0) {
      return { ok: false, message: "price must be a number greater than 0" }
    }
    // round to cents to avoid floating-point drift
    values.price = Math.round(cleanPrice * 100) / 100
  } else if (!partial) {
    return { ok: false, message: "price must be a number greater than 0" }
  }

  if (input.stock !== undefined && input.stock !== null && input.stock !== "") {
    const cleanStock = Number(input.stock)
    if (!Number.isInteger(cleanStock) || cleanStock < 0) {
      return { ok: false, message: "stock must be a whole number of at least 0" }
    }
    values.stock = cleanStock
  } else if (!partial) {
    values.stock = 0
  }

  if (input.category !== undefined) {
    if (!CATEGORIES.includes(input.category)) {
      return { ok: false, message: `category must be one of: ${CATEGORIES.join(", ")}` }
    }
    values.category = input.category
  } else if (!partial) {
    return { ok: false, message: `category must be one of: ${CATEGORIES.join(", ")}` }
  }

  if (input.status !== undefined) {
    if (!STATUSES.includes(input.status)) {
      return { ok: false, message: `status must be one of: ${STATUSES.join(", ")}` }
    }
    values.status = input.status
  } else if (!partial) {
    values.status = "in_stock"
  }

  if (input.subcategory !== undefined) {
    values.subcategory =
      typeof input.subcategory === "string" && input.subcategory.trim() ? input.subcategory.trim() : null
  }

  return { ok: true, values }
}

// POST /product
export const ProductController = async (req, res) => {
  const userId = req.user.id
  const { productName, description, price, stock, images, category, status, subcategory } = req.body

  const img = normalizeImages(images)
  if (!img.ok) {
    return res.status(400).json({ message: img.message })
  }

  // ---- server-side validation (never trust the client) ----
  const validated = validateProductPayload({ productName, description, price, stock, category, status, subcategory })
  if (!validated.ok) {
    return res.status(400).json({ message: validated.message })
  }

  try {
    const productData = await Product.create({
      userId,
      ...validated.values,
      description,
      productImages: img.value,
    })

    res.status(200).json({
      message: "product is registered",
      data: productData,
    })
  } catch (error) {
    console.error("ProductController error:", error.message)
    res.status(500).json({ message: "Failed to create product" })
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

  // Same validator as create — partial mode so only the fields being updated
  // are checked, then only those are written back. Keeps price/stock/category
  // rules identical between create and edit.
  const validated = validateProductPayload(
    { productName, price, stock, subcategory },
    { partial: true }
  )
  if (!validated.ok) {
    return res.status(400).json({ message: validated.message })
  }

  const [updatedRows] = await Product.update(
    {
      ...validated.values,
      description,
      productImages: img.value,
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