// function App() {
//   let name = "diksha";
//   let caste = "K.C.";
//   let games = ["pokemon", "freefire"];
//   let information = {
//     name: "diksha",
//     class: 12,
//     roll_no: 21,
//   };
//   return (
//     <>
//       <h1>
//         Hello {name} {caste}
//       </h1>
//       <h2>i love {games[0]}</h2>
//       <h2>i study in class {information.class} </h2>
//     </>
//   );
// }

// export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext.jsx";
import Contact from "./pages/contact";
import About from "./pages/about";
import Home from "./components/Home.jsx";
import Signup from "./pages/signup";
import Signin from "./pages/signin";
import Forgot from "./pages/forgotPassword";
import Otp from "./pages/otp";
import Product from "./pages/Product";
import CreateProduct from "./pages/create-Product";
import Productlist from "./pages/product-list";
import SellerDashboard from "./pages/seller-dashboard";
import CustomerDashboard from "./pages/customer-dashboard";
import Checkout from "./pages/checkout";
import Cart from "./pages/cart";
import OrderConfirmation from "./pages/order-confirmation";
import NotFound from "./pages/NotFound";
import PageTransition from "./components/PageTransition.jsx";
import RoleRoute from "./components/RoleRoute.jsx";
import { Toaster } from "./components/ui/sonner.jsx";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
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
      <Toaster duration={2500} />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
