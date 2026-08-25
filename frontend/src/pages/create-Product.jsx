// 



import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar.jsx"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select.jsx"
import { createProduct } from "../lib/api.js"

const CATEGORIES = ["electronics", "materials", "agriculture", "cosmetics"]
const STATUSES = ["in_stock", "out_of_stock", "discontinued"]

const initialForm = {
  productName: "",
  description: "",
  price: "",
  stock: "",
  category: CATEGORIES[0],
  status: "in_stock",
  image: "", // maps to productImage on the backend
}

export default function CreateProduct() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!form.productName || !form.price || !form.category) {
      setError("Product name, price and category are required")
      return
    }
    if (Number(form.price) <= 0) {
      setError("Price must be greater than 0")
      return
    }
    if (form.stock !== "" && Number(form.stock) < 0) {
      setError("Stock can't be negative")
      return
    }

    setLoading(true)
    try {
      await createProduct({
        productName: form.productName,
        description: form.description,
        price: Number(form.price),
        stock: form.stock === "" ? 0 : Number(form.stock),
        category: form.category,
        status: form.status,
        image: form.image, // backend maps this to productImage
      })
      navigate("/user-dashboard")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />

      <div className="mx-auto max-w-xl px-6 py-12">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-navy/50">
          New listing
        </p>
        <h1
          className="mt-1 text-3xl text-navy font-display"
        >
          Add a product
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="productName"
              className="block font-mono text-[11px] uppercase tracking-widest text-navy/60"
            >
              Product name
            </label>
            <input
              id="productName"
              type="text"
              required
              value={form.productName}
              onChange={(e) => update("productName", e.target.value)}
              className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-sm text-navy outline outline-1 -outline-offset-1 outline-navy/15 placeholder:text-navy/30 focus:outline-2 focus:-outline-offset-2 focus:outline-ochre"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block font-mono text-[11px] uppercase tracking-widest text-navy/60"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              className="mt-2 block w-full resize-none rounded-md bg-white px-3 py-2 text-sm text-navy outline outline-1 -outline-offset-1 outline-navy/15 placeholder:text-navy/30 focus:outline-2 focus:-outline-offset-2 focus:outline-ochre"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="price"
                className="block font-mono text-[11px] uppercase tracking-widest text-navy/60"
              >
                Price ($)
              </label>
              <input
                id="price"
                type="number"
                min="0"
                step="0.01"
                required
                value={form.price}
                onChange={(e) => update("price", e.target.value)}
                className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-sm text-navy outline outline-1 -outline-offset-1 outline-navy/15 placeholder:text-navy/30 focus:outline-2 focus:-outline-offset-2 focus:outline-ochre"
              />
            </div>

            <div>
              <label
                htmlFor="stock"
                className="block font-mono text-[11px] uppercase tracking-widest text-navy/60"
              >
                Stock
              </label>
              <input
                id="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => update("stock", e.target.value)}
                placeholder="0"
                className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-sm text-navy outline outline-1 -outline-offset-1 outline-navy/15 placeholder:text-navy/30 focus:outline-2 focus:-outline-offset-2 focus:outline-ochre"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                id="category-label"
                className="block font-mono text-[11px] uppercase tracking-widest text-navy/60"
              >
                Category
              </label>
              <Select
                required
                value={form.category}
                onValueChange={(value) => update("category", value)}
                name="category"
              >
                <SelectTrigger aria-labelledby="category-label" className="mt-2">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label
                id="status-label"
                className="block font-mono text-[11px] uppercase tracking-widest text-navy/60"
              >
                Status
              </label>
              <Select
                value={form.status}
                onValueChange={(value) => update("status", value)}
                name="status"
              >
                <SelectTrigger aria-labelledby="status-label" className="mt-2">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label
              htmlFor="image"
              className="block font-mono text-[11px] uppercase tracking-widest text-navy/60"
            >
              Image URL
            </label>
            <input
              id="image"
              type="url"
              value={form.image}
              onChange={(e) => update("image", e.target.value)}
              placeholder="https://..."
              className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-sm text-navy outline outline-1 -outline-offset-1 outline-navy/15 placeholder:text-navy/30 focus:outline-2 focus:-outline-offset-2 focus:outline-ochre"
            />
          </div>

          <p className="min-h-[1rem] font-mono text-xs text-rust">
            {error || ""}
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-navy py-3 font-mono text-xs uppercase tracking-widest text-cream transition hover:bg-rust disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create product"}
          </button>
        </form>
      </div>
    </div>
  )
}