import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartProvider.jsx";
import Home from "./components/Home.jsx";
import PageTransition from "./components/PageTransition.jsx";
import RoleRoute from "./components/RoleRoute.jsx";
import { Toaster } from "./components/ui/sonner.jsx";

// Route-level code-splitting: the heavy/secondary pages (dashboards,
// checkout, cart, product detail, auth, …) are fetched on demand instead of
// being in the initial bundle. The seller dashboard is the biggest win — it is
// the only consumer of recharts.
const Contact = lazy(() => import("./pages/contact"));
const About = lazy(() => import("./pages/about"));
const Signup = lazy(() => import("./pages/signup"));
const Signin = lazy(() => import("./pages/signin"));
const Forgot = lazy(() => import("./pages/forgotPassword"));
const Otp = lazy(() => import("./pages/otp"));
const Product = lazy(() => import("./pages/Product"));
const CreateProduct = lazy(() => import("./pages/create-Product"));
const Productlist = lazy(() => import("./pages/product-list"));
const SellerDashboard = lazy(() => import("./pages/seller-dashboard"));
const CustomerDashboard = lazy(() => import("./pages/customer-dashboard"));
const Checkout = lazy(() => import("./pages/checkout"));
const Cart = lazy(() => import("./pages/cart"));
const OrderConfirmation = lazy(() => import("./pages/order-confirmation"));
const NotFound = lazy(() => import("./pages/NotFound"));

function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper">
      <span className="font-mono text-xs uppercase tracking-widest text-navy/40">
        Loading…
      </span>
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
      <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
        <Route path="/signin" element={<PageTransition><Signin /></PageTransition>} />
        <Route path="/forgotPassword" element={<PageTransition><Forgot /></PageTransition>}/>
        <Route path="/otp" element={<PageTransition><Otp /></PageTransition>} />
        <Route path="/product" element={<PageTransition><Product /></PageTransition>} />
        <Route path="/product/:id" element={<PageTransition><Product /></PageTransition>} />
        <Route path="/create-Product" element={<PageTransition><RoleRoute allowedRoles={["seller"]}><CreateProduct /></RoleRoute></PageTransition>}/>
        <Route path="/product-list" element={<PageTransition><Productlist/></PageTransition>}/>
        <Route path="/seller-dashboard" element={<PageTransition><RoleRoute allowedRoles={["seller"]}><SellerDashboard /></RoleRoute></PageTransition>} />
        <Route path="/customer-dashboard" element={<PageTransition><RoleRoute allowedRoles={["customer"]}><CustomerDashboard /></RoleRoute></PageTransition>} />
        <Route path="/checkout" element={<PageTransition><RoleRoute allowedRoles={["customer"]}><Checkout /></RoleRoute></PageTransition>} />
        <Route path="/cart" element={<PageTransition><RoleRoute allowedRoles={["customer"]}><Cart /></RoleRoute></PageTransition>} />
        <Route path="/order-confirmation/:id" element={<PageTransition><RoleRoute allowedRoles={["customer"]}><OrderConfirmation /></RoleRoute></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
      </Suspense>
      <Toaster duration={2500} />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
