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
import UserDashboard from "./pages/user-dashboard";
import Checkout from "./pages/checkout";
import Cart from "./pages/cart";
import PageTransition from "./components/PageTransition.jsx";
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
        <Route path="/create-Product" element={<PageTransition><CreateProduct/></PageTransition>}/>
        <Route path="/product-list" element={<PageTransition><Productlist/></PageTransition>}/>
        <Route path="/fetch-products" element={<PageTransition><Productlist/></PageTransition>}/>
        <Route path="/user-dashboard" element={<PageTransition><UserDashboard /></PageTransition>}/>
        <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
        <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
        <Route path="/:error" element={<h2>Error not found</h2>} />
      </Routes>
      <Toaster duration={2500} />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
