import { sequelize } from "../config/connection.js"
import User from "./User.js"
import Product from "./Product.js"
import Cart from "./Cart.js"
import CartItem from "./CartItem.js"
import Order from "./Order.js"
import OrderItem from "./OrderItem.js"
import Blog from "./Blog.js"


// ---- User <-> Product (1 user creates many products) ----
User.hasMany(Product, { foreignKey: "userId", onDelete: "CASCADE" })
Product.belongsTo(User, { foreignKey: "userId" })

// ---- User <-> Order (1 user places many orders) ----
User.hasMany(Order, { foreignKey: "userId", onDelete: "CASCADE" })
Order.belongsTo(User, { foreignKey: "userId" })

// ---- User <-> Cart (1-to-1) ----
User.hasOne(Cart, { foreignKey: "userId", onDelete: "CASCADE" })
Cart.belongsTo(User, { foreignKey: "userId" })

// ---- Cart <-> CartItem (1 cart has many items) ----
Cart.hasMany(CartItem, { foreignKey: "cartId", onDelete: "CASCADE" })
CartItem.belongsTo(Cart, { foreignKey: "cartId" })

// ---- Product <-> CartItem (1 product appears in many cart items) ----
Product.hasMany(CartItem, { foreignKey: "productId", onDelete: "CASCADE" })
CartItem.belongsTo(Product, { foreignKey: "productId" })

// ---- Cart <-> Product (many-to-many, realized through CartItem) ----
Cart.belongsToMany(Product, { through: CartItem, foreignKey: "cartId", otherKey: "productId" })
Product.belongsToMany(Cart, { through: CartItem, foreignKey: "productId", otherKey: "cartId" })

// ---- Order <-> OrderItem (1 order has many items) ----
Order.hasMany(OrderItem, { foreignKey: "orderId", onDelete: "CASCADE" })
OrderItem.belongsTo(Order, { foreignKey: "orderId" })

// ---- Product <-> OrderItem (1 product appears in many order items) ----
Product.hasMany(OrderItem, { foreignKey: "productId", onDelete: "CASCADE" })
OrderItem.belongsTo(Product, { foreignKey: "productId" })

// ---- Order <-> Product (many-to-many, realized through OrderItem) ----
Order.belongsToMany(Product, { through: OrderItem, foreignKey: "orderId", otherKey: "productId" })
Product.belongsToMany(Order, { through: OrderItem, foreignKey: "productId", otherKey: "orderId" })

export { sequelize,Blog, User, Product, Cart, CartItem, Order, OrderItem }