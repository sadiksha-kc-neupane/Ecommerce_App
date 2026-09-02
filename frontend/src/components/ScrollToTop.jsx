import { useEffect } from "react"
import { useLocation } from "react-router-dom"

/**
 * ScrollToTop component that automatically scrolls the window to top (0, 0)
 * whenever the route pathname, search params, or location changes.
 */
export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation()

  useEffect(() => {
    // If there is an anchor hash on the URL, scroll to that element
    if (hash) {
      const element = document.getElementById(hash.replace("#", ""))
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
        return
      }
    }

    // Otherwise, instantly reset window scroll position to the very top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    })
  }, [pathname, search, hash])

  return null
}
