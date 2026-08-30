// Decode the JWT payload client-side for UI display/routing only.
// No signature verification here -- the backend's verifyToken + requireRole
// are the real authorization boundary; this just powers role-aware UI.
//
// SECURITY NOTE: the bearer token is held in localStorage, so it is readable
// by any script that achieves XSS on this origin. Moving it to an httpOnly,
// SameSite cookie (plus CSRF protection) would close this, but requires
// coordinated backend + CORS changes and is tracked as a follow-up. The
// current approach with localhost-only CORS is an accepted dev-phase tradeoff.
export function getCurrentUser() {
  const token = localStorage.getItem("token")
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    return payload // { id, role, iat, exp }
  } catch {
    return null
  }
}
