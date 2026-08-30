import { useEffect, useState } from 'react'
import { fetchProducts, deleteProduct as deleteProductApi } from "../lib/api.js"
import { getCurrentUser } from "../lib/auth.js"
import { isLowStock } from "../lib/stock.js"
import { CATEGORY_COLORS, CATEGORY_LABELS } from "../lib/categories.js"
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

function UserDashboardProducts  () {
    const [dashboardproducts,setDashboardProducts] = useState([]);

    //fetching products

    //fetching all products
    async function fetchDashboardProducts() {
     try {
       const data = await fetchProducts();
       const all = data.data || [];
       // only show the logged-in seller's own listings, not the whole catalog
       const currentUser = getCurrentUser()
       const mine = all.filter((p) => p.userId === currentUser?.id)
       setDashboardProducts(mine.slice(-4).reverse());
     } catch (error) {
       console.error(error);
     }
    }


//delete product with id
async function deleteProduct(id) {
    try {
        await deleteProductApi(id);
        toast.success("Deleted successfully");
        fetchDashboardProducts(); // Refresh list after deleting
    } catch (error) {
      toast.error(error.message || "Something went wrong. Try again.");
    }
}

useEffect(() => {
    fetchDashboardProducts()
},[])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Product List
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {dashboardproducts.map((products) => (
          <div
            key={products.id}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition duration-300"
          >
            {products.productImages?.[0] ? (
              <img
                src={products.productImages?.[0]}
                alt={products.productName}
                className="h-48 w-full rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-48 w-full flex-col items-center justify-center gap-1 rounded-lg bg-[repeating-linear-gradient(45deg,#F2EEE4_0px,#F2EEE4_12px,#EDE7DA_12px,#EDE7DA_24px)]">
                <span className="text-4xl text-navy/25 font-display">
                  {products.productName?.charAt(0).toUpperCase()}
                </span>
                <span className="font-mono text-[8px] uppercase tracking-widest text-navy/35">
                  No photo yet
                </span>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <h2 className="text-2xl font-semibold text-gray-800">
                {products.productName}
              </h2>

              <p className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-gray-600">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLORS[products.category] || "#1C1B19" }}
                />
                {CATEGORY_LABELS[products.category] || products.category}
                {products.subcategory && (
                  <span className="rounded-full bg-gray-200 px-2 py-0.5 font-mono text-[10px] normal-case tracking-normal text-gray-600">
                    {products.subcategory}
                  </span>
                )}
              </p>

              <p className="text-lg text-green-600 font-bold">
                ${products.price}
              </p>
             <p className="text-lg text-green-600 font-bold">
                {products.description}
              </p>
                 <p className="text-lg text-green-600 font-bold">
                Stock: {products.stock}
              </p>
              {isLowStock(products.stock) && (
                <span className="inline-block w-fit rounded-full bg-teal px-3 py-1 font-mono text-xs font-semibold uppercase tracking-widest text-white">
                  Low stock — restock soon
                </span>
              )}

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition"
                  >
                    Delete Product
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

      {dashboardproducts.length === 0 && (
        <div className="text-center text-gray-500 text-xl mt-10">
          No products found.
        </div>
      )}
    </div>
  );
}



export default UserDashboardProducts 
