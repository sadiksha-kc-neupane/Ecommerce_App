import { Cart, CartItem, Product } from "../model/index.js"

// POST /product/add-to-cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id
    const { productId, quantity } = req.body

    if (!productId) {
      return res.status(400).json({ message: "productId is required" })
    }

    const qty = quantity === undefined ? 1 : Number(quantity)
    if (!Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({ message: "Quantity must be a whole number of at least 1" })
    }

    const product = await Product.findByPk(productId)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    if (product.status === "out_of_stock" || product.status === "discontinued") {
      return res.status(400).json({ message: `${product.productName} is not available` })
    }

    // find or create this user's cart
    let cart = await Cart.findOne({ where: { userId } })
    if (!cart) {
      cart = await Cart.create({ userId })
    }

    // if item already in cart, bump quantity instead of duplicating
    let item = await CartItem.findOne({ where: { cartId: cart.id, productId } })
    let newQty = qty
    if (item) {
      newQty = item.quantity + qty
    }

    if (newQty > product.stock) {
      return res.status(400).json({
        message: `Only ${product.stock} available for ${product.productName}`,
      })
    }

    if (item) {
      item.quantity = newQty
      await item.save()
    } else {
      item = await CartItem.create({
        cartId: cart.id,
        productId,
        quantity: newQty,
      })
    }

    return res.status(200).json({ message: "Added to cart", item })
  } catch (error) {
    console.error("addToCart error:", error.message)
    return res.status(500).json({ message: "Something went wrong" })
  }
}

// GET /cart
export const fetchCart = async (req, res) => {
  try {
    const userId = req.user.id

    const cart = await Cart.findOne({
      where: { userId },
      include: [{ model: CartItem, include: [Product] }],
    })

    if (!cart) {
      return res.status(200).json({ cart: null, items: [] })
    }

    return res.status(200).json({ cart })
  } catch (error) {
    console.error("fetchCart error:", error.message)
    return res.status(500).json({ message: "Something went wrong" })
  }
}

// DELETE /cart/:id  (id = CartItem id)
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id
    const { id } = req.params

    const item = await CartItem.findByPk(id, { include: [Cart] })
    if (!item) {
      return res.status(404).json({ message: "Cart item not found" })
    }

    // make sure the cart item actually belongs to this user
    if (item.Cart.userId !== userId) {
      return res.status(403).json({ message: "Not authorized" })
    }

    await item.destroy()
    return res.status(200).json({ message: "Removed from cart" })
  } catch (error) {
    console.error("removeFromCart error:", error.message)
    return res.status(500).json({ message: "Something went wrong" })
  }
}

// PATCH /cart/:id  (id = CartItem id) — set the quantity of a cart line.
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id
    const { id } = req.params
    const { quantity } = req.body

    const qty = Number(quantity)
    if (!Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({ message: "Quantity must be a whole number of at least 1" })
    }

    const item = await CartItem.findByPk(id, { include: [Cart, Product] })
    if (!item) {
      return res.status(404).json({ message: "Cart item not found" })
    }
    if (item.Cart.userId !== userId) {
      return res.status(403).json({ message: "Not authorized" })
    }

    if (item.Product && item.Product.stock < qty) {
      return res.status(400).json({
        message: `Only ${item.Product.stock} available for ${item.Product.productName}`,
      })
    }

    item.quantity = qty
    await item.save()
    return res.status(200).json({ message: "Quantity updated", item })
  } catch (error) {
    console.error("updateCartItem error:", error.message)
    return res.status(500).json({ message: "Something went wrong" })
  }
}