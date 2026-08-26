// Decode the JWT payload client-side for UI display/routing only.
// No signature verification here -- the backend's verifyToken + requireRole
// are the real authorization boundary; this just powers role-aware UI.
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
