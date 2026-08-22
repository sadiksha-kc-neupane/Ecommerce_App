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
import Contact from "./pages/contact";
import About from "./pages/about";
import Home from "./pages/home";
import Signup from "./pages/signup";
import Signin from "./pages/signin";
import Forgot from "./pages/forgotPassword";
import Otp from "./pages/otp";
import Product from "./pages/Product";
import CreateProduct from "./pages/create-Product";
import Userlist from "./pages/users";
import Productlist from "./pages/product-list";
import UserDashboard from "./pages/user-dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/forgotPassword" element={<Forgot />}/>
        <Route path="/otp" element={<Otp />} />
        <Route path="/product" element={<Product />} />
        <Route path="/create-Product" element={<CreateProduct/>}/>
        <Route path="/fetch-users" element={<Userlist/>}/>
        <Route path="/fetch-products" element={<Productlist/>}/>
        <Route path="/user-dashboard" element={<UserDashboard/>}/>
        <Route path="/:error" element={<h2>Error not found</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
