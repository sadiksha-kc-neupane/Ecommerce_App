// import cors from 'cors'
// import dotenv from "dotenv"
// dotenv.config()
// import express from "express"
// const app = express()
// app.use(express.json())


// app.use(cors({
//   origin: "*"
// }))

// // const app = require("express") () // this is alternative way
// import { connectDB } from "./config/index.js"
// import { aboutPageController, BlogController, deleteProduct, deleteUser, editBlog, editProduct, editUser, fetchBlog, fetchProduct, fetchSingle, fetchSingleBlog, fetchSingleProduct, fetchUser, homePageController, loginUser, ProductController, registerUser } from "./controllers/exampleControllers.js"
// import Blog from "./model/Blog.js"
// import { verifyToken } from './middleware/auth.middleware.js'


// await connectDB();

// app.get("/", homePageController);
// app.get("/about", aboutPageController);
// app.post("/register", registerUser)
// app.post("/login", loginUser)

// //create blog
// app.post("/product", verifyToken, ProductController)

// app.get("/fetch-users", fetchUser)
// app.get("/fetch-product/:id", fetchProduct)
// app.get("/fetch-blog", fetchBlog)
// app.get("/fetch-single-blog/:id", fetchSingleBlog)
// app.get("/fetch-single/:id", fetchSingle)
// app.get("/fetch-single-product/:id", fetchSingleProduct)
// app.post("/product/buy")
// app.post("/product/add-to-cart")
// app.post("/product/cancel")

// app.delete("/delete-user/:id", deleteUser)
// app.delete("/delete-product/:id", deleteProduct) 

// app.post("/blog", verifyToken, BlogController)
// app.patch("/update-users/:id", editUser)
// app.patch("/update-blog/:id", editBlog)
// app.patch("/update-product/:id", editProduct) 



// //port number
// app.listen(3000, function () {
//   console.log("Express server is working at port 3000");
// });


import cors from 'cors'
import helmet from "helmet"
import rateLimit from "express-rate-limit"

import dotenv from "dotenv"
dotenv.config()
import express from "express"
import { connectDB } from "./config/index.js"
import { verifyToken, requireRole } from './middleware/auth.middleware.js'
import { homePageController, aboutPageController } from "./controllers/pageController.js"
import { registerUser, loginUser, forgotPassword, verifyOtp, resetPassword } from "./controllers/authController.js"
import { fetchUser, fetchSingle, editUser, deleteUser } from "./controllers/userController.js"
import {
  ProductController,
  fetchProduct,
  fetchSingleProduct,
  editProduct,
  deleteProduct,
} from "./controllers/productController.js"
import {
  BlogController,
  fetchBlog,
  fetchSingleBlog,
  editBlog,
} from "./controllers/blogController.js"
import { addToCart, fetchCart, removeFromCart, updateCartItem } from "./controllers/cartController.js"
import { buyProduct, cancelOrder, fetchOrders, fetchSingleOrder, fetchSellerOrders, verifyPayment } from "./controllers/orderController.js"
import envConfig from './config/env.js'



const app = express()

// 1. CORS MUST BE FIRST to ensure every response (including preflight OPTIONS & errors) gets CORS headers
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:5175",
]

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin) || origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:") || process.env.NODE_ENV !== "production") {
        return callback(null, true)
      }
      return callback(null, true)
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  })
)

// 2. Helmet with cross-origin resource sharing permitted
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
  })
)

app.use(express.json({ limit: "10mb" })) // middleware converting to json with screenshot support

// Loose brute-force guard on the auth endpoints (login is the main target).
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 200, // 200 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === "OPTIONS", // Do not rate-limit preflight OPTIONS
  message: { message: "Too many requests, please try again later" },
})



await connectDB();

// ---- pages ----
app.get("/", homePageController);
app.get("/about", aboutPageController);

// ---- auth ----
app.post("/auth/register", authLimiter, registerUser)
app.post("/auth/login", authLimiter, loginUser)
app.post("/auth/forgot-password", authLimiter, forgotPassword)
app.post("/auth/verify-otp", authLimiter, verifyOtp)
app.post("/auth/reset-password", authLimiter, resetPassword)

// ---- product ----
app.post("/product", verifyToken, requireRole("seller"), ProductController)
app.get("/fetch-product", fetchProduct)
app.get("/fetch-single-product/:id", fetchSingleProduct)
app.patch("/update-product/:id", verifyToken, requireRole("seller"), editProduct)
app.delete("/delete-product/:id", verifyToken, requireRole("seller"), deleteProduct)

// ---- cart ----
app.post("/product/add-to-cart", verifyToken, requireRole("customer"), addToCart)
app.get("/cart", verifyToken, requireRole("customer"), fetchCart)
app.delete("/cart/:id", verifyToken, requireRole("customer"), removeFromCart)
app.patch("/cart/:id", verifyToken, requireRole("customer"), updateCartItem)

// ---- order ----
app.post("/product/buy", verifyToken, requireRole("customer"), buyProduct)
app.post("/product/cancel/:id", verifyToken, requireRole("customer"), cancelOrder)
app.get("/orders", verifyToken, requireRole("customer"), fetchOrders)
app.get("/orders/:id", verifyToken, fetchSingleOrder)
app.patch("/orders/verify-payment/:id", verifyToken, requireRole("seller", "admin"), verifyPayment)

// ---- seller ----
app.get("/seller/orders", verifyToken, requireRole("seller", "admin"), fetchSellerOrders)

// ---- user ----
app.get("/fetch-users", verifyToken, requireRole("admin"), fetchUser)
app.get("/fetch-single/:id", verifyToken, fetchSingle)
app.patch("/update-users/:id", verifyToken, editUser)
app.delete("/delete-user/:id", verifyToken, deleteUser)

// ---- blog ----
app.post("/blog", verifyToken, requireRole("admin"), BlogController)
app.get("/fetch-blog", fetchBlog)
app.get("/fetch-single-blog/:id", fetchSingleBlog)
app.patch("/update-blog/:id", verifyToken, requireRole("admin"), editBlog)

// ---- 404 fallback (must be registered after all routes) ----
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" })
})

// ---- global error handler ----
// Express 5 forwards rejected promises from async handlers here.
// Never echo internal error details to the client; log them server-side.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err)
  res.status(500).json({ message: "Something went wrong" })
})

const PORT = envConfig.port
app.listen(PORT, function () {
  console.log(`Express server is working at port ${PORT}`);
});