import ProductCard from "./ProductCard.jsx"

export default function ProductGrid({ products, loading, error, onAddToCart }) {
  if (loading) {
    return <p className="px-6 font-mono text-sm text-[#14213D]/50">Loading catalog...</p>
  }

  if (error) {
    return (
      <p className="px-6 font-mono text-sm text-[#B33F2E]">
        Couldn't load products: {error}
      </p>
    )
  }

  if (!products.length) {
    return (
      <p className="px-6 font-mono text-sm text-[#14213D]/50">
        Nothing in this category yet.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 px-6 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  )
}