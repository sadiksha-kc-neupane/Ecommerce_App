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

import dotenv from "dotenv"
dotenv.config()
import express from "express"
import { connectDB } from "./config/index.js"
import { verifyToken, requireRole } from './middleware/auth.middleware.js'
import { homePageController, aboutPageController } from "./controllers/pageController.js"
import { registerUser, loginUser } from "./controllers/authController.js"
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
import { addToCart, fetchCart, removeFromCart } from "./controllers/cartController.js"
import { buyProduct, cancelOrder, fetchOrders, fetchSingleOrder, fetchSellerOrders } from "./controllers/orderController.js"
import envConfig from './config/env.js'



const app = express()
app.use(express.json()) //middleware converting in to json
app.use(cors({
  origin: "*",
}))



await connectDB();

// ---- pages ----
app.get("/", homePageController);
app.get("/about", aboutPageController);

// ---- auth ----
app.post("/auth/register", registerUser)
app.post("/auth/login", loginUser)

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

// ---- order ----
app.post("/product/buy", verifyToken, requireRole("customer"), buyProduct)
app.post("/product/cancel/:id", verifyToken, requireRole("customer"), cancelOrder)
app.get("/orders", verifyToken, requireRole("customer"), fetchOrders)
app.get("/orders/:id", verifyToken, requireRole("customer"), fetchSingleOrder)

// ---- seller ----
app.get("/seller/orders", verifyToken, requireRole("seller"), fetchSellerOrders)

// ---- user ----
app.get("/fetch-users", verifyToken, fetchUser)
app.get("/fetch-single/:id", verifyToken, fetchSingle)
app.patch("/update-users/:id", verifyToken, editUser)
app.delete("/delete-user/:id", verifyToken, deleteUser)

// ---- blog ----
app.post("/blog", verifyToken, BlogController)
app.get("/fetch-blog", fetchBlog)
app.get("/fetch-single-blog/:id", fetchSingleBlog)
app.patch("/update-blog/:id", verifyToken, editBlog)

const PORT = envConfig.port
app.listen(PORT, function () {
  console.log(`Express server is working at port ${PORT}`);
});