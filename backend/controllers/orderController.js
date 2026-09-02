import { sequelize, Cart, CartItem, Order, OrderItem, Product, User } from "../model/index.js"
import { sendPaymentApprovedEmail, sendPaymentRejectedEmail } from "../lib/mailer.js"

// Must match the PAYMENT_METHODS offered by the frontend checkout page.
const PAYMENT_METHODS = [
  "QR Code / Digital Wallet",
  "Cash on Delivery",
  "Credit / Debit Card",
  "Bank Transfer",
]

// POST /product/buy  (checkout — turns the user's cart into an order)
export const buyProduct = async (req, res) => {
  const t = await sequelize.transaction()
  try {
    const userId = req.user.id
    const { paymentMethod, address, paymentScreenshot } = req.body

    if (!address) {
      await t.rollback()
      return res.status(400).json({ message: "Shipping address is required" })
    }

    if (!PAYMENT_METHODS.includes(paymentMethod)) {
      await t.rollback()
      return res.status(400).json({ message: "Invalid payment method" })
    }

    const isQrPayment = paymentMethod === "QR Code / Digital Wallet" || paymentMethod === "Bank Transfer"
    if (isQrPayment && !paymentScreenshot) {
      await t.rollback()
      return res.status(400).json({ message: "Payment screenshot is required for QR / Bank payments" })
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

    // A CartItem whose product has been deleted comes back with Product === null
    const staleItems = cart.CartItems.filter((item) => !item.Product)
    if (staleItems.length > 0) {
      await t.rollback()
      await CartItem.destroy({ where: { id: staleItems.map((s) => s.id) } })
      return res.status(400).json({
        message: "Some items in your cart are no longer available and were removed.",
      })
    }

    // Compute total (server-authoritative)
    let totalAmount = 0
    for (const item of cart.CartItems) {
      if (item.Product.stock < item.quantity) {
        await t.rollback()
        return res.status(400).json({
          message: `Not enough stock for ${item.Product.productName}`,
        })
      }
      totalAmount += Math.round(Number(item.Product.price) * item.quantity * 100) / 100
    }

    const initialPaymentStatus = isQrPayment ? "pending_verification" : "unpaid"

    const order = await Order.create({
      userId,
      totalAmount,
      status: "pending",
      paymentStatus: initialPaymentStatus,
      paymentMethod,
      paymentScreenshot: paymentScreenshot || null,
      address,
    }, { transaction: t })

    for (const item of cart.CartItems) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.Product.price,
      }, { transaction: t })

      const [, affectedRows] = await sequelize.query(
        'UPDATE "products" SET "stock" = "stock" - :qty WHERE "id" = :id AND "stock" >= :qty',
        {
          replacements: { qty: item.quantity, id: item.productId },
          transaction: t,
        }
      )

      if (affectedRows === 0) {
        await t.rollback()
        return res.status(400).json({
          message: `Not enough stock for ${item.Product.productName}`,
        })
      }
    }

    // Empty the cart now that it's been converted to an order
    await CartItem.destroy({ where: { cartId: cart.id }, transaction: t })

    await t.commit()
    return res.status(201).json({ message: "Order placed", order })
  } catch (error) {
    await t.rollback()
    console.error("buyProduct error:", error.message)
    return res.status(500).json({ message: "Something went wrong" })
  }
}

// PATCH /orders/verify-payment/:id (accessible by seller / admin)
export const verifyPayment = async (req, res) => {
  const t = await sequelize.transaction()
  try {
    const { id } = req.params
    const { action, reason } = req.body // "approve" | "reject"

    if (!["approve", "reject"].includes(action)) {
      await t.rollback()
      return res.status(400).json({ message: "Invalid action. Must be 'approve' or 'reject'" })
    }

    const order = await Order.findByPk(id, {
      include: [
        { model: OrderItem, include: [Product] },
        { model: User, attributes: ["id", "username", "email"] },
      ],
      transaction: t,
    })

    if (!order) {
      await t.rollback()
      return res.status(404).json({ message: "Order not found" })
    }

    const customerEmail = order.User?.email
    const customerName = order.User?.username

    if (action === "approve") {
      order.paymentStatus = "paid"
      order.status = "processing"
      order.rejectionReason = null
      await order.save({ transaction: t })
      await t.commit()

      // Send approval confirmation email to customer
      if (customerEmail) {
        sendPaymentApprovedEmail(customerEmail, {
          orderId: order.id,
          totalAmount: order.totalAmount,
          address: order.address,
          customerName,
        })
      }

      return res.status(200).json({
        message: "Payment approved successfully. Order is now processing.",
        order,
      })
    } else {
      // Action === "reject"
      const rejectReason = reason?.trim() || "Payment screenshot unclear, incorrect amount, or transaction not found."
      order.paymentStatus = "rejected"
      order.status = "payment_rejected"
      order.rejectionReason = rejectReason
      await order.save({ transaction: t })
      await t.commit()

      // Send rejection notification email to customer
      if (customerEmail) {
        sendPaymentRejectedEmail(customerEmail, {
          orderId: order.id,
          totalAmount: order.totalAmount,
          reason: rejectReason,
          customerName,
        })
      }

      return res.status(200).json({
        message: "Payment rejected. Customer has been notified via email.",
        order,
      })
    }
  } catch (error) {
    await t.rollback()
    console.error("verifyPayment error:", error.message)
    return res.status(500).json({ message: "Something went wrong" })
  }
}

// POST /product/cancel/:id  (id = Order id)
export const cancelOrder = async (req, res) => {
  const t = await sequelize.transaction()
  try {
    const userId = req.user.id
    const { id } = req.params

    const order = await Order.findByPk(id, {
      include: [{ model: OrderItem, include: [Product] }],
      transaction: t,
    })
    if (!order) {
      await t.rollback()
      return res.status(404).json({ message: "Order not found" })
    }
    if (order.userId !== userId) {
      await t.rollback()
      return res.status(403).json({ message: "Not authorized" })
    }
    if (["shipped", "delivered", "cancelled"].includes(order.status)) {
      await t.rollback()
      return res.status(400).json({ message: `Cannot cancel an order that is already ${order.status}` })
    }

    order.status = "cancelled"
    await order.save({ transaction: t })

    // Restock quantities reserved
    for (const item of order.OrderItems || []) {
      await item.Product.increment("stock", { by: item.quantity, transaction: t })
    }

    await t.commit()
    return res.status(200).json({ message: "Order cancelled", order })
  } catch (error) {
    await t.rollback()
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
      attributes: ["id", "status", "paymentStatus", "paymentMethod", "paymentScreenshot", "rejectionReason", "address", "totalAmount", "createdAt"],
      include: [
        {
          model: OrderItem,
          attributes: ["id", "quantity", "price"],
          include: [{ model: Product, attributes: ["id", "productName", "productImages"] }],
        },
      ],
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
      attributes: [
        "id",
        "userId",
        "status",
        "paymentStatus",
        "paymentMethod",
        "paymentScreenshot",
        "rejectionReason",
        "address",
        "totalAmount",
        "createdAt",
      ],
      include: [
        {
          model: OrderItem,
          attributes: ["id", "quantity", "price"],
          include: [{ model: Product, attributes: ["id", "productName", "productImages"] }],
        },
      ],
    })

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }
    if (order.userId !== userId && req.user.role !== "seller" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" })
    }

    return res.status(200).json({ order })
  } catch (error) {
    console.error("fetchSingleOrder error:", error.message)
    return res.status(500).json({ message: "Something went wrong" })
  }
}

// GET /seller/orders (orders containing products owned by the logged-in seller, or all orders if admin)
export const fetchSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user.id
    const isAdmin = req.user.role === "admin"

    const orderItems = await OrderItem.findAll({
      attributes: ["id", "orderId", "productId", "quantity", "price", "createdAt"],
      include: [
        {
          model: Product,
          where: isAdmin ? undefined : { userId: sellerId },
          attributes: ["id", "productName", "productImages"],
        },
        {
          model: Order,
          attributes: [
            "id",
            "userId",
            "status",
            "paymentStatus",
            "paymentMethod",
            "paymentScreenshot",
            "rejectionReason",
            "address",
            "totalAmount",
            "createdAt",
          ],
          include: [
            {
              model: User,
              attributes: ["id", "username", "email"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    })

    return res.status(200).json({ orderItems })
  } catch (error) {
    console.error("fetchSellerOrders error:", error.message)
    return res.status(500).json({ message: "Something went wrong" })
  }
}