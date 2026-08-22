const BADGES = [
  { label: "Secure checkout" },
  { label: "Fast delivery" },
  { label: "Easy returns" },
]

export default function TrustBadges() {
  return (
    <div className="flex flex-wrap justify-center gap-6 bg-[#14213D]/5 px-6 py-4 font-mono text-[10px] text-[#14213D]/60">
      {BADGES.map((b) => (
        <span key={b.label}>{b.label}</span>
      ))}
    </div>
  )
}