// import { useState } from "react";
// import Navbar from "../components/Navbar";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function Signup() {
//   const[username, setUsername]= useState('')
//   const[password, setPassword]= useState('')
//   const[email, setEmail]= useState('')
//   const Navigate = useNavigate()

//   async function sendDataToBackend(e){
//     e.preventDefault()
//     const response = await axios.post("http://localhost:3000/auth/register",{
//       username, password, email
//     })
//     if(response.status === 200){
//       Navigate("/Signin")

//     }else{
//       alert("Registration failed")
//     }
//   }
//   return (
//     <>
//       <Navbar/>
//       <div className="flex items-center justify-center p-12">
//         {/* Author: FormBold Team */}
//         <div className="mx-auto w-full max-w-[550px] bg-white">
//           <form onSubmit={sendDataToBackend}>
//             <div className="mb-5">
//               <label
//                 htmlFor="name"
//                 className="mb-3 block text-base font-medium text-[#07074D]"
//               >
//                 User Name
//               </label>
//               <input
//                 onChange={(e)=>setUsername(e.target.value)}
//                 type="text"
//                 name="name"
//                 id="name"
//                 placeholder="Full Name"
//                 className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
//               />
//             </div>
//             <div className="mb-5">
//               <label
//                 htmlFor="phone"
//                 className="mb-3 block text-base font-medium text-[#07074D]"
//               >
//                 Password
//               </label>
//               <input
//                onChange={(e)=>setPassword(e.target.value)}
//                 type="password"
//                 name="phone"
//                 id="phone"
//                 placeholder="Enter your phone number"
//                 className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
//               />
//             </div>
//             <div className="mb-5">
//               <label
//                 htmlFor="email"
//                 className="mb-3 block text-base font-medium text-[#07074D]"
//               >
//                 Email Address
//               </label>
//               <input
//                 onChange={(e)=>setEmail(e.target.value)}
//                 type="email"
//                 name="email"
//                 id="email"
//                 placeholder="Enter your email"
//                 className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
//               />
//             </div>
//             <div>
//               <button className="hover:shadow-form w-full rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none">
//                 Click here
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Signup;


import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { registerUser } from "../lib/api.js"

export default function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: "", email: "", password: "" })
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (form.password !== confirmPassword) {
      setError("Passwords don't match")
      return
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)
    try {
      await registerUser(form)
      // registerUser doesn't return a token (only /login does),
      // so send them to sign in after a successful registration
      navigate("/signin", { state: { justRegistered: true } })
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
          Create your account
        </h2>
        <p className="mt-2 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-[#FBF7F0]/40">
          Bazario
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block font-mono text-[11px] uppercase tracking-widest text-[#FBF7F0]/60"
            >
              Username
            </label>
            <div className="mt-2">
              <input
                id="username"
                type="text"
                required
                autoComplete="username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="block w-full rounded-md bg-[#FBF7F0]/5 px-3 py-2 text-sm text-[#FBF7F0] outline outline-1 -outline-offset-1 outline-[#FBF7F0]/15 placeholder:text-[#FBF7F0]/30 focus:outline-2 focus:-outline-offset-2 focus:outline-[#E8A33D]"
              />
            </div>
          </div>

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
            <label
              htmlFor="password"
              className="block font-mono text-[11px] uppercase tracking-widest text-[#FBF7F0]/60"
            >
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                type="password"
                required
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="block w-full rounded-md bg-[#FBF7F0]/5 px-3 py-2 text-sm text-[#FBF7F0] outline outline-1 -outline-offset-1 outline-[#FBF7F0]/15 placeholder:text-[#FBF7F0]/30 focus:outline-2 focus:-outline-offset-2 focus:outline-[#E8A33D]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block font-mono text-[11px] uppercase tracking-widest text-[#FBF7F0]/60"
            >
              Confirm password
            </label>
            <div className="mt-2">
              <input
                id="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full rounded-md bg-[#FBF7F0]/5 px-3 py-2 text-sm text-[#FBF7F0] outline outline-1 -outline-offset-1 outline-[#FBF7F0]/15 placeholder:text-[#FBF7F0]/30 focus:outline-2 focus:-outline-offset-2 focus:outline-[#E8A33D]"
              />
            </div>
          </div>

          {error && (
            <p className="font-mono text-xs text-[#E8A33D]">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-md bg-[#E8A33D] px-3 py-2 font-mono text-xs uppercase tracking-widest text-[#14213D] transition hover:bg-[#FBF7F0] disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-8 text-center font-mono text-xs text-[#FBF7F0]/50">
          Already have an account?{" "}
          <Link to="/signin" className="font-semibold text-[#E8A33D] hover:text-[#FBF7F0]">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}