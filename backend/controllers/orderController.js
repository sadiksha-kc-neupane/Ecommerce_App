import { sequelize, Cart, CartItem, Order, OrderItem, Product } from "../model/index.js"

// POST /product/buy  (checkout — turns the user's cart into an order)
export const buyProduct = async (req, res) => {
  const t = await sequelize.transaction()
  try {
    const userId = req.user.id
    const { paymentMethod, address } = req.body

    if (!address) {
      await t.rollback()
      return res.status(400).json({ message: "Shipping address is required" })
    }

  const cart = await Cart.findOne({
      where: { userId },
      include: [{ model: CartItem, include: [Product] }],
      transaction: t,
    })

    if (!cart || !cart.CartItems || cart.CartItems.length === 0) {
      await t.rollback()
      return res.status(400).json({ message: "Cart is empty" })
    }

    // check stock and compute total before creating anything
    let totalAmount = 0
    for (const item of cart.CartItems) {
      if (item.Product.stock < item.quantity) {
        await t.rollback()
        return res.status(400).json({
          message: `Not enough stock for ${item.Product.productName}`,
        })
      }
      totalAmount += Number(item.Product.price) * item.quantity
    }

    const order = await Order.create({
      userId,
      totalAmount,
      status: "pending",
      paymentStatus: "unpaid",
      paymentMethod,
      address,
    }, { transaction: t })

    for (const item of cart.CartItems) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.Product.price, // snapshot price at time of order
      }, { transaction: t })

      // decrement stock
      await item.Product.decrement("stock", { by: item.quantity, transaction: t })
    }

    // empty the cart now that it's been converted to an order
    await CartItem.destroy({ where: { cartId: cart.id }, transaction: t })

    await t.commit()
    return res.status(201).json({ message: "Order placed", order })
  } catch (error) {
    await t.rollback()
    console.error("buyProduct error:", error.message)
    return res.status(500).json({ message: "Something went wrong" })
  }
}

// POST /product/cancel/:id  (id = Order id)
export const cancelOrder = async (req, res) => {
  try {
    const userId = req.user.id
    const { id } = req.params

    const order = await Order.findByPk(id)
    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }
    if (order.userId !== userId) {
      return res.status(403).json({ message: "Not authorized" })
    }
    if (["shipped", "delivered", "cancelled"].includes(order.status)) {
      return res.status(400).json({ message: `Cannot cancel an order that is already ${order.status}` })
    }

    order.status = "cancelled"
    await order.save()

    return res.status(200).json({ message: "Order cancelled", order })
  } catch (error) {
    console.error("cancelOrder error:", error.message)
    return res.status(500).json({ message: "Something went wrong" })
  }
}

// GET /orders  (all orders for the logged-in user)
export const fetchOrders = async (req, res) => {
  try {
    const userId = req.user.id

    const orders = await Order.findAll({
      where: { userId },
      include: [{ model: OrderItem, include: [Product] }],
      order: [["createdAt", "DESC"]],
    })

    return res.status(200).json({ orders })
  } catch (error) {
    console.error("fetchOrders error:", error.message)
    return res.status(500).json({ message: "Something went wrong" })
  }
}

// GET /orders/:id
export const fetchSingleOrder = async (req, res) => {
  try {
    const userId = req.user.id
    const { id } = req.params

    const order = await Order.findByPk(id, {
      include: [{ model: OrderItem, include: [Product] }],
    })

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }
    if (order.userId !== userId) {
      return res.status(403).json({ message: "Not authorized" })
    }

    return res.status(200).json({ order })
  } catch (error) {
    console.error("fetchSingleOrder error:", error.message)
    return res.status(500).json({ message: "Something went wrong" })
  }
}

// GET /seller/orders  (orders containing products owned by the logged-in seller)
//
// Response shape — a flat list of order-items, each enriched with its parent
// order and the product. One item per product-per-order; the same orderId can
// appear multiple times if a buyer ordered several of this seller's products
// in one checkout:
//
// {
//   "orderItems": [
//     {
//       "id": "<orderItemId>",
//       "orderId": "<orderId>",
//       "productId": "<productId>",
//       "quantity": 2,
//       "price": "19.99",            // snapshot price at time of order
//       "createdAt": "...",
//       "updatedAt": "...",
//       "Product": {                 // the seller's product
//         "id": "...", "productName": "...", "price": "...",
//         "stock": 5, "userId": "<sellerId>", ...
//       },
//       "Order": {                   // the buyer's order
//         "id": "...", "userId": "<buyerId>",
//         "totalAmount": "...",      // whole-cart total, not seller-only subtotal
//         "status": "pending" | "shipped" | ...,
//         "paymentStatus": "unpaid" | ...,
//         "paymentMethod": "...",
//         "address": "...",
//         "createdAt": "...", "updatedAt": "..."
//       }
//     },
//     ...
//   ]
// }
export const fetchSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user.id

    const orderItems = await OrderItem.findAll({
      include: [
        { model: Product, where: { userId: sellerId } },
        { model: Order },
      ],
      order: [["createdAt", "DESC"]],
    })

    return res.status(200).json({ orderItems })
  } catch (error) {
    console.error("fetchSellerOrders error:", error.message)
    return res.status(500).json({ message: "Something went wrong" })
  }
}