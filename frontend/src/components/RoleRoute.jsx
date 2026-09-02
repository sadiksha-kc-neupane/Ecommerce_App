import { Navigate } from "react-router-dom"
import { toast } from "sonner"
import { getCurrentUser } from "../lib/auth.js"

// UX guard only -- redirects before the user hits a dead-end 403.
// The backend's verifyToken + requireRole remain the real authorization.
export default function RoleRoute({ allowedRoles, children }) {
  const user = getCurrentUser()

  if (!user) {
    // stable id so StrictMode's double-render doesn't stack duplicate toasts
    toast.error("Please sign in to continue", { id: "role-route-guard" })
    return <Navigate to="/signin" replace />
  }

  if (!allowedRoles.includes(user.role)) {
    toast.info(
      user.role === "seller"
        ? "Redirected to your seller dashboard"
        : "Redirected to your customer dashboard",
      { id: "role-route-guard" }
    )
    return (
      <Navigate
        to={user.role === "seller" ? "/seller-dashboard" : "/customer-dashboard"}
        replace
      />
    )
  }

  return children
}

