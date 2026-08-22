// // import { useState } from "react";
// // import Navbar from "../components/navbar";
// // import { Link } from "react-router-dom";
// // import axios from "axios";


// // function Signin() {
// //   const[email, setEmail]= useState('')
// //   const[password, setPassword]= useState('')

// //     async function loginUser(e){
// //     e.preventDefault()
// //    try {
// //     const response = await axios.post("http://localhost:3000/login", {
// //       email,
// //       password,
// //     });

// //     console.log(response.data);
// //     localStorage.setItem("token", response.data.token)
// //     alert("Login Successful!");
// //   } catch (error) {
// //     console.log(error);

// //     alert(
// //        "Login Failed"
// //     );
// //   }
// // }

// //   return (
// //     <>
// //       <Navbar />
// //       <div className="flex items-center justify-center p-12">
// //         {/* Author: FormBold Team */}
// //         <div className="mx-auto w-full max-w-[550px] bg-white">
// //           <form onSubmit={loginUser}>
// //             <div className="mb-5">
// //               <label className="mb-5 block text-base font-semibold text-[#07074D] sm:text-xl">
// //                 Email
// //               </label>
// //               <input
// //                 onChange={(e)=>setEmail(e.target.value)}
// //                 type="email"
// //                 name="email"
// //                 id="email"
// //                 placeholder="Enter your email"
// //                 className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
// //               />
// //             </div>

// //             <div className="mb-5 pt-3">
// //               <label className="mb-5 block text-base font-semibold text-[#07074D] sm:text-xl">
// //                 Password
// //               </label>
// //               <div className="-mx-3 flex flex-wrap">
// //                 <div className="w-full px-3 sm:w-1/2">
// //                   <div className="mb-5">
// //                     <input
// //                       onChange={(e)=>setPassword(e.target.value)}
// //                       type="password"
// //                       name="password"
// //                       id="email"
// //                       placeholder="Enter your password"
// //                       className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
// //                     />
// //                   </div>
// //                 </div>
// //                 <div className="w-full px-3 sm:w-1/2">
// //                   <div className="mb-5"></div>
// //                 </div>
// //                 <div className="w-full px-3 sm:w-1/2">
// //                   <div className="mb-5"></div>
// //                 </div>
// //                 <div className="w-full px-3 sm:w-1/2">
// //                   <div className="mb-5"></div>
// //                 </div>
// //               </div>
// //             </div>
// //             <div>
// //               <button className="hover:shadow-form w-full rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none">
// //                 Sign In
// //               </button>
// //             </div>
// //           </form>
// //         </div>
// //       </div>
// //       <Link to="/forgotPassword">Forgot Password</Link>
// //     </>
// //   );
// // }

// // export default Signin;
// import { useState } from "react"
// import { Link, useNavigate } from "react-router-dom"
// import { loginUser } from "../lib/api.js"

// export default function Signin() {
//   const navigate = useNavigate()
//   const [form, setForm] = useState({ email: "", password: "" })
//   const [error, setError] = useState(null)
//   const [loading, setLoading] = useState(false)

//   async function handleSubmit(e) {
//     e.preventDefault()
//     setError(null)
//     setLoading(true)
//     try {
//       const res = await loginUser(form)
//       localStorage.setItem("token", res.token)
//       navigate("/")
//     } catch (err) {
//       setError(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="flex min-h-screen flex-col justify-center bg-[#14213D] px-6 py-12 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-sm">
//         <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#E8A33D] font-mono text-[10px] text-[#E8A33D]">
//           Logo
//         </span>
//         <h2
//           className="mt-8 text-center text-3xl text-[#FBF7F0]"
//           style={{ fontFamily: "'Fraunces', serif" }}
//         >
//           Sign in to your account
//         </h2>
//         <p className="mt-2 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-[#FBF7F0]/40">
//           Bazario
//         </p>
//       </div>

//       <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <label
//               htmlFor="email"
//               className="block font-mono text-[11px] uppercase tracking-widest text-[#FBF7F0]/60"
//             >
//               Email address
//             </label>
//             <div className="mt-2">
//               <input
//                 id="email"
//                 type="email"
//                 required
//                 autoComplete="email"
//                 value={form.email}
//                 onChange={(e) => setForm({ ...form, email: e.target.value })}
//                 className="block w-full rounded-md bg-[#FBF7F0]/5 px-3 py-2 text-sm text-[#FBF7F0] outline outline-1 -outline-offset-1 outline-[#FBF7F0]/15 placeholder:text-[#FBF7F0]/30 focus:outline-2 focus:-outline-offset-2 focus:outline-[#E8A33D]"
//               />
//             </div>
//           </div>

//           <div>
//             <div className="flex items-center justify-between">
//               <label
//                 htmlFor="password"
//                 className="block font-mono text-[11px] uppercase tracking-widest text-[#FBF7F0]/60"
//               >
//                 Password
//               </label>
//               <Link
//                 to="/forgot-password"
//                 className="font-mono text-[10px] uppercase tracking-widest text-[#E8A33D] hover:text-[#FBF7F0]"
//               >
//                 Forgot password?
//               </Link>
//             </div>
//             <div className="mt-2">
//               <input
//                 id="password"
//                 type="password"
//                 required
//                 autoComplete="current-password"
//                 value={form.password}
//                 onChange={(e) => setForm({ ...form, password: e.target.value })}
//                 className="block w-full rounded-md bg-[#FBF7F0]/5 px-3 py-2 text-sm text-[#FBF7F0] outline outline-1 -outline-offset-1 outline-[#FBF7F0]/15 placeholder:text-[#FBF7F0]/30 focus:outline-2 focus:-outline-offset-2 focus:outline-[#E8A33D]"
//               />
//             </div>
//           </div>

//           {error && (
//             <p className="font-mono text-xs text-[#E8A33D]">{error}</p>
//           )}

//           <button
//             type="submit"
//             disabled={loading}
//             className="flex w-full justify-center rounded-md bg-[#E8A33D] px-3 py-2 font-mono text-xs uppercase tracking-widest text-[#14213D] transition hover:bg-[#FBF7F0] disabled:opacity-50"
//           >
//             {loading ? "Signing in..." : "Sign in"}
//           </button>
//         </form>

//         <p className="mt-8 text-center font-mono text-xs text-[#FBF7F0]/50">
//           Not a member?{" "}
//           <Link to="/signup" className="font-semibold text-[#E8A33D] hover:text-[#FBF7F0]">
//             Create an account
//           </Link>
//         </p>
//       </div>
//     </div>
//   )
// }



import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { loginUser } from "../lib/api.js"

export default function Signin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await loginUser(form)
      localStorage.setItem("token", res.token)
      navigate("/")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-[#14213D] px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#E8A33D] font-mono text-[10px] text-[#E8A33D]">
          Logo
        </span>
        <h2
          className="mt-8 text-center text-3xl text-[#FBF7F0]"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Sign in to your account
        </h2>
        <p className="mt-2 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-[#FBF7F0]/40">
          Bazario
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block font-mono text-[11px] uppercase tracking-widest text-[#FBF7F0]/60"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="block w-full rounded-md bg-[#FBF7F0]/5 px-3 py-2 text-sm text-[#FBF7F0] outline outline-1 -outline-offset-1 outline-[#FBF7F0]/15 placeholder:text-[#FBF7F0]/30 focus:outline-2 focus:-outline-offset-2 focus:outline-[#E8A33D]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block font-mono text-[11px] uppercase tracking-widest text-[#FBF7F0]/60"
              >
                Password
              </label>
              <Link
                to="/forgot-password"
                className="font-mono text-[10px] uppercase tracking-widest text-[#E8A33D] hover:text-[#FBF7F0]"
              >
                Forgot password?
              </Link>
            </div>
            <div className="mt-2">
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="block w-full rounded-md bg-[#FBF7F0]/5 px-3 py-2 text-sm text-[#FBF7F0] outline outline-1 -outline-offset-1 outline-[#FBF7F0]/15 placeholder:text-[#FBF7F0]/30 focus:outline-2 focus:-outline-offset-2 focus:outline-[#E8A33D]"
              />
            </div>
          </div>

          <p className="min-h-[1rem] font-mono text-xs text-[#E8A33D]">
            {error || ""}
          </p>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-md bg-[#E8A33D] px-3 py-2 font-mono text-xs uppercase tracking-widest text-[#14213D] transition hover:bg-[#FBF7F0] disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-8 text-center font-mono text-xs text-[#FBF7F0]/50">
          Not a member?{" "}
          <Link to="/signup" className="font-semibold text-[#E8A33D] hover:text-[#FBF7F0]">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}