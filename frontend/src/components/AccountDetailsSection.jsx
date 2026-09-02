import { useEffect, useState } from "react"
import { toast } from "sonner"
import { getCurrentUser } from "../lib/auth.js"
import { fetchSingleUser, updateUser } from "../lib/api.js"

// Self-contained account-details editor shared by the customer and seller
// dashboards. It fetches the current user's own data, pre-fills the form,
// handles its own save state, and reports success via a sonner toast.
export default function AccountDetailsSection() {
  const currentUser = getCurrentUser()
  const isLoggedIn = Boolean(localStorage.getItem("token"))
  const id = currentUser?.id

  const [form, setForm] = useState({ username: "", email: "" })
  const [loaded, setLoaded] = useState(false)
  const [loadError, setLoadError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  useEffect(() => {
    if (!isLoggedIn || !id) return
    let cancelled = false

    // fetch-single returns an array (see fetchSingle in userController.js)
    fetchSingleUser(id)
      .then((data) => {
        if (cancelled) return
        const user = Array.isArray(data) ? data[0] : data
        if (user) {
          setForm({ username: user.username || "", email: user.email || "" })
        }
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoaded(true)
      })

    return () => {
      cancelled = true
    }
  }, [isLoggedIn, id])

  async function handleSubmit(e) {
    e.preventDefault()
    setSaveError(null)

    if (!form.username.trim() || !form.email.trim()) {
      setSaveError("Username and email are required.")
      return
    }

    setSaving(true)
    try {
      // only send username + email — never a password key
      await updateUser(id, { username: form.username.trim(), email: form.email.trim() })
      toast.success("Account details updated")
    } catch (err) {
      setSaveError(err.message || "Something went wrong. Try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-wider text-navy/50">Your account</p>
      <h1 className="mt-1 mb-8 text-3xl text-navy font-display">Account details</h1>

      {!loaded && !loadError && (
        <p className="font-mono text-sm text-navy/50">Loading your details...</p>
      )}

      {loadError && (
        <div className="rounded-md bg-paper p-10 text-center outline outline-1 -outline-offset-1 outline-navy/15">
          <p className="font-mono text-sm text-rust">{loadError}</p>
        </div>
      )}

      {loaded && !loadError && (
        <form
          onSubmit={handleSubmit}
          className="max-w-md space-y-5 rounded-md bg-paper p-6 outline outline-1 -outline-offset-1 outline-navy/15"
        >
          <div>
            <label htmlFor="username" className="block font-mono text-[11px] uppercase tracking-wider text-navy/60">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="mt-2 block w-full rounded-md bg-cream px-3 py-2 text-sm text-navy outline outline-1 -outline-offset-1 outline-navy/15 placeholder:text-navy/30 focus:outline-2 focus:-outline-offset-2 focus:outline-ochre"
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-mono text-[11px] uppercase tracking-wider text-navy/60">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-2 block w-full rounded-md bg-cream px-3 py-2 text-sm text-navy outline outline-1 -outline-offset-1 outline-navy/15 placeholder:text-navy/30 focus:outline-2 focus:-outline-offset-2 focus:outline-ochre"
            />
          </div>

          <p className="font-mono text-[10px] tracking-wider text-navy/40">
            Password changes aren&apos;t available yet
          </p>

          {saveError && (
            <p className="font-mono text-xs text-rust">{saveError}</p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="rounded-sm bg-ochre px-6 py-3 font-mono text-xs uppercase tracking-wider text-navy transition hover:bg-navy hover:text-cream disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      )}
    </div>
  )
}
