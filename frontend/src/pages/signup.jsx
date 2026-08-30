import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { registerUser } from "../lib/api.js"

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
    <div className="flex min-h-screen flex-col justify-center bg-paper px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-ochre font-mono text-[10px] text-ochre-ink">
          D&S
        </span>
        <h2
          className="mt-8 text-center text-3xl text-navy font-display"
        >
          Create your account
        </h2>
        <p className="mt-2 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-navy/50">
          Dipti&Suppliers
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block font-mono text-[11px] uppercase tracking-widest text-navy/60"
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
                className="block w-full rounded-md bg-white px-3 py-2 text-sm text-navy outline outline-1 -outline-offset-1 outline-navy/15 placeholder:text-navy/30 focus:outline-2 focus:-outline-offset-2 focus:outline-ochre"
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
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="block w-full rounded-md bg-white px-3 py-2 text-sm text-navy outline outline-1 -outline-offset-1 outline-navy/15 placeholder:text-navy/30 focus:outline-2 focus:-outline-offset-2 focus:outline-ochre"
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
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="block w-full rounded-md bg-white px-3 py-2 text-sm text-navy outline outline-1 -outline-offset-1 outline-navy/15 placeholder:text-navy/30 focus:outline-2 focus:-outline-offset-2 focus:outline-ochre"
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
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full rounded-md bg-white px-3 py-2 text-sm text-navy outline outline-1 -outline-offset-1 outline-navy/15 placeholder:text-navy/30 focus:outline-2 focus:-outline-offset-2 focus:outline-ochre"
              />
            </div>
          </div>

          <div>
            <span className="block font-mono text-[11px] uppercase tracking-widest text-navy/60">
              I want to
            </span>
            <div className="mt-2 grid grid-cols-2 gap-3">
              {[
                { value: "customer", label: "Customer", hint: "Buy products" },
                { value: "seller", label: "Seller", hint: "List & sell products" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm({ ...form, role: opt.value })}
                  className={
                    form.role === opt.value
                      ? "rounded-md bg-ochre px-3 py-3 text-center text-sm text-navy outline outline-2 -outline-offset-2 outline-ochre transition"
                      : "rounded-md bg-white px-3 py-3 text-center text-sm text-navy outline outline-1 -outline-offset-1 outline-navy/15 transition hover:outline-navy/40"
                  }
                >
                  {opt.label}
                  <span className="mt-1 block font-mono text-[10px] opacity-60">
                    {opt.hint}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="font-mono text-xs text-ochre-ink">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-md bg-ochre px-3 py-2 font-mono text-xs uppercase tracking-widest text-navy transition hover:bg-navy hover:text-cream disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-8 text-center font-mono text-xs text-navy/50">
          Already have an account?{" "}
          <Link to="/signin" className="font-semibold text-ochre-ink hover:text-navy">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
