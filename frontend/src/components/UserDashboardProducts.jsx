import { useEffect, useState } from 'react'
import { fetchProducts, deleteProduct as deleteProductApi } from "../lib/api.js"
import { getCurrentUser } from "../lib/auth.js"
import { isLowStock } from "../lib/stock.js"
import { CATEGORY_COLORS, CATEGORY_LABELS } from "../lib/categories.js"
import Price from "./ui/Price.jsx"
import Badge from "./ui/Badge.jsx"
import EmptyState from "./ui/EmptyState.jsx"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog.jsx"

function UserDashboardProducts() {
  const [dashboardproducts, setDashboardProducts] = useState([])

  async function fetchDashboardProducts() {
    try {
      const data = await fetchProducts()
      const all = data.data || []
      const currentUser = getCurrentUser()
      const mine = all.filter((p) => p.userId === currentUser?.id)
      setDashboardProducts(mine.slice(-4).reverse())
    } catch (error) {
      console.error(error)
    }
  }

  async function deleteProduct(id) {
    try {
      await deleteProductApi(id)
      toast.success("Deleted successfully")
      fetchDashboardProducts()
    } catch (error) {
      toast.error(error.message || "Something went wrong. Try again.")
    }
  }

  useEffect(() => {
    let ignore = false
    fetchProducts()
      .then((data) => {
        if (ignore) return
        const all = data.data || []
        const currentUser = getCurrentUser()
        const mine = all.filter((p) => p.userId === currentUser?.id)
        setDashboardProducts(mine.slice(-4).reverse())
      })
      .catch((error) => console.error(error))
    return () => {
      ignore = true
    }
  }, [])

  return (
    <div>
      {dashboardproducts.length === 0 ? (
        <EmptyState title="No products found." body="Add a listing to see it here." className="mx-0 max-w-none" />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {dashboardproducts.map((products) => (
            <div
              key={products.id}
              className="overflow-hidden rounded-lg border border-navy/10 bg-white shadow-card transition hover:border-ochre/50 hover:shadow-lift"
            >
              {products.productImages?.[0] ? (
                <img
                  src={products.productImages?.[0]}
                  alt={products.productName}
                  className="h-44 w-full object-cover"
                />
              ) : (
                <div className="flex h-44 w-full flex-col items-center justify-center gap-1 bg-[repeating-linear-gradient(45deg,#F7F3EC_0px,#F7F3EC_12px,#F0E9DC_12px,#F0E9DC_24px)]">
                  <span className="text-4xl text-navy/25 font-display">
                    {products.productName?.charAt(0).toUpperCase()}
                  </span>
                  <span className="font-mono text-[8px] uppercase tracking-widest text-navy/35">
                    No photo yet
                  </span>
                </div>
              )}

              <div className="flex flex-col gap-3 p-5">
                <h2 className="text-lg text-navy font-display">
                  {products.productName}
                </h2>

                <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-navy/60">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[products.category] || "#1C1B19" }}
                  />
                  {CATEGORY_LABELS[products.category] || products.category}
                  {products.subcategory && (
                    <span className="rounded-full bg-navy/10 px-2 py-0.5 font-mono text-[10px] normal-case tracking-normal text-navy/60">
                      {products.subcategory}
                    </span>
                  )}
                </p>

                <Price value={products.price} className="font-mono text-xl font-semibold text-ochre-ink" />

                {products.description && (
                  <p className="line-clamp-2 text-sm leading-relaxed text-navy/60">
                    {products.description}
                  </p>
                )}

                <p className="text-sm text-navy/60">
                  Stock:{" "}
                  <span className={isLowStock(products.stock) ? "font-semibold text-teal" : "text-navy"}>
                    {products.stock}
                  </span>
                </p>

                {isLowStock(products.stock) && (
                  <Badge tone="teal" className="w-fit">Low stock — restock soon</Badge>
                )}

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="mt-2 rounded-sm border border-rust/40 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-rust transition hover:bg-rust hover:text-cream">
                      Delete product
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this product?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently remove{" "}
                        {products.productName || "this product"} from the catalog. This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteProduct(products.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UserDashboardProducts
