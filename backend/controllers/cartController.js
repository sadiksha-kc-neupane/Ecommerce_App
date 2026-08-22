import { Cart, CartItem, Product } from "../model/index.js"

// POST /product/add-to-cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id
    const { productId, quantity } = req.body

    if (!productId) {
      return res.status(400).json({ message: "productId is required" })
    }

    const product = await Product.findByPk(productId)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    // find or create this user's cart
    let cart = await Cart.findOne({ where: { userId } })
    if (!cart) {
      cart = await Cart.create({ userId })
    }

    // if item already in cart, bump quantity instead of duplicating
    let item = await CartItem.findOne({ where: { cartId: cart.id, productId } })
    if (item) {
      item.quantity += quantity || 1
      await item.save()
    } else {
      item = await CartItem.create({
        cartId: cart.id,
        productId,
        quantity: quantity || 1,
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