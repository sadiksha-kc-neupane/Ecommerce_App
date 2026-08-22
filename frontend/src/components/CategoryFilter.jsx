// Matches the Product model's category ENUM exactly:
// electronics | materials | agriculture | cosmetics
const CATEGORIES = ["all", "electronics", "materials", "agriculture", "cosmetics"]

export default function CategoryFilter({ activeCategory, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 px-6 pt-5 font-mono text-[10px] uppercase tracking-widest">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`rounded-full border px-4 py-1.5 transition ${
            activeCategory === cat
              ? "border-[#14213D] bg-[#14213D] text-[#FBF7F0]"
              : "border-[#14213D]/25 text-[#14213D]/60 hover:border-[#14213D]/50"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}