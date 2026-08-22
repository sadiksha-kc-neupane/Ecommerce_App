import { Product } from "../model/index.js"

// POST /product
export const ProductController = async (req, res) => {
  const userId = req.user.id
  const { productName, description, price, stock, image, category, status } = req.body

  console.log("data", productName, description, price, stock, image)

  try {
    const productData = await Product.create({
      userId,
      productName,
      price,
      description,
      stock,
      productImage: image,
      category,
      status,
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
  const { productName, price, stock, description } = req.body

  await Product.update(
    {
      productName,
      price,
      stock,
      description,
    },
    { where: { id } }
  )
  res.send("updated sucessfully")
}

// DELETE /delete-product/:id
export const deleteProduct = async (req, res) => {
  const Productid = req.params.id
  await Product.destroy({ where: { id: Productid } })
  res.status(200).json({ message: "deleted sucessfully" })
}