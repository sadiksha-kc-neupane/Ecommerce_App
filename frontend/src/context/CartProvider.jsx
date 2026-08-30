import { useCallback, useEffect, useState } from "react"
import { fetchCart } from "../lib/api.js"
import { getCurrentUser } from "../lib/auth.js"
import { CartContext } from "./cart-context.js"

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0)

  const refreshCart = useCallback(async () => {
    // sellers have no cart on the backend (requireRole("customer")); skip
    // the call so we don't trigger a pointless 403 on every page load
    if (!localStorage.getItem("token") || getCurrentUser()?.role === "seller") {
      setCartCount(0)
      return
    }
    try {
      // response shape: { cart: { CartItems: [...] } }
      const res = await fetchCart()
      setCartCount((res.cart?.CartItems || []).reduce((sum, item) => sum + item.quantity, 0))
    } catch {
      setCartCount(0)
    }
  }, [])

  const clearCart = useCallback(() => setCartCount(0), [])

  useEffect(() => {
    // deferred so the initial cart fetch is not a synchronous setState inside
    // the effect body (avoids react-hooks/set-state-in-effect)
    const id = setTimeout(() => refreshCart(), 0)
    return () => clearTimeout(id)
  }, [refreshCart])

  return (
    <CartContext.Provider value={{ cartCount, refreshCart, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}
