import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { registerUser } from "../lib/api.js"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"

export default function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "customer" })
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
      await registerUser({
        username: form.username,
        email: form.email,
        password: form.password,
        role: "customer",
      })
      navigate("/signin", { state: { justRegistered: true } })
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
                Create your account
              </h1>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-navy/50">
                Dipti&amp;Suppliers
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="username"
                  className="block font-mono text-[11px] uppercase tracking-widest text-navy/60"
                >
                  Full Name / Username
                </label>
                <div className="mt-2">
                  <input
                    id="username"
                    type="text"
                    required
                    autoComplete="username"
                    placeholder="e.g. John Doe"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    className="block w-full rounded-xl bg-white px-3.5 py-2.5 text-sm text-navy outline outline-1 -outline-offset-1 outline-navy/15 placeholder:text-navy/30 focus:outline-2 focus:-outline-offset-2 focus:outline-ochre"
                  />
                </div>
              </div>

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
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="block w-full rounded-xl bg-white px-3.5 py-2.5 text-sm text-navy outline outline-1 -outline-offset-1 outline-navy/15 placeholder:text-navy/30 focus:outline-2 focus:-outline-offset-2 focus:outline-ochre"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block font-mono text-[11px] uppercase tracking-widest text-navy/60"
                >
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    type="password"
                    required
                    autoComplete="new-password"
                    placeholder="At least 6 characters"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="block w-full rounded-xl bg-white px-3.5 py-2.5 text-sm text-navy outline outline-1 -outline-offset-1 outline-navy/15 placeholder:text-navy/30 focus:outline-2 focus:-outline-offset-2 focus:outline-ochre"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block font-mono text-[11px] uppercase tracking-widest text-navy/60"
                >
                  Confirm password
                </label>
                <div className="mt-2">
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    autoComplete="new-password"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="mt-8 border-t border-navy/5 pt-6 text-center font-mono text-xs text-navy/50">
              Already have an account?{" "}
              <Link to="/signin" className="font-semibold text-ochre-ink hover:text-navy">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
