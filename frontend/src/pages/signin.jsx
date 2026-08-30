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
    <div className="flex min-h-screen flex-col justify-center bg-paper px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-ochre font-mono text-[10px] text-ochre-ink">
          D&S
        </span>
        <h2
          className="mt-8 text-center text-3xl text-navy font-display"
        >
          Sign in to your account
        </h2>
        <p className="mt-2 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-navy/50">
          Dipti&Suppliers
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
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
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block font-mono text-[11px] uppercase tracking-widest text-navy/60"
              >
                Password
              </label>
              <Link
                to="/forgotPassword"
                className="font-mono text-[10px] uppercase tracking-widest text-ochre-ink hover:text-navy"
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
                className="block w-full rounded-md bg-white px-3 py-2 text-sm text-navy outline outline-1 -outline-offset-1 outline-navy/15 placeholder:text-navy/30 focus:outline-2 focus:-outline-offset-2 focus:outline-ochre"
              />
            </div>
          </div>

          <p className="min-h-[1rem] font-mono text-xs text-ochre-ink">
            {error || ""}
          </p>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-md bg-ochre px-3 py-2 font-mono text-xs uppercase tracking-widest text-navy transition hover:bg-navy hover:text-cream disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-8 text-center font-mono text-xs text-navy/50">
          Not a member?{" "}
          <Link to="/signup" className="font-semibold text-ochre-ink hover:text-navy">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
