import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { loginUser } from "../lib/api.js"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"

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
      navigate("/dashboard")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-[440px]">
          {/* White Card with Border */}
          <div className="rounded-3xl border border-navy/10 bg-white p-8 shadow-sm sm:p-10">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl font-sans">
                Sign in to your account
              </h1>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-navy/50">
                Dipti&amp;Suppliers
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block font-mono text-[11px] uppercase tracking-widest text-navy/60"
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
                    className="block w-full rounded-xl bg-white px-3.5 py-2.5 text-sm text-navy outline outline-1 -outline-offset-1 outline-navy/15 placeholder:text-navy/30 focus:outline-2 focus:-outline-offset-2 focus:outline-ochre"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block font-mono text-[11px] uppercase tracking-widest text-navy/60"
                  >
                    Password
                  </label>
                  <Link
                    to="/forgotPassword"
                    className="font-mono text-[10px] uppercase tracking-widest text-ochre-ink hover:text-navy transition"
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
                    className="block w-full rounded-xl bg-white px-3.5 py-2.5 text-sm text-navy outline outline-1 -outline-offset-1 outline-navy/15 placeholder:text-navy/30 focus:outline-2 focus:-outline-offset-2 focus:outline-ochre"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-rust/10 p-3 text-xs font-medium text-rust">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-xl bg-ochre px-4 py-3 font-mono text-xs uppercase tracking-widest text-navy transition hover:bg-navy hover:text-cream disabled:opacity-50 cursor-pointer shadow-sm"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-8 border-t border-navy/5 pt-6 text-center font-mono text-xs text-navy/50">
              Not a member?{" "}
              <Link to="/signup" className="font-semibold text-ochre-ink hover:text-navy">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
