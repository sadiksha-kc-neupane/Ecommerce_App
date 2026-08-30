import Price from "../ui/Price.jsx"
import { calcTotals } from "../../lib/cart.js"

// Cheap warm image placeholder (no external service) used when a product has
// no photo yet — shows the first letter on a paper-dotted background.
export function LineImage({ name, image, className }) {
  return image ? (
    <img src={image} alt="" className={className || "h-14 w-14 rounded-md object-cover"} />
  ) : (
    <div
      className={
        className ||
        "flex h-14 w-14 items-center justify-center rounded-md bg-[repeating-linear-gradient(45deg,#F7F3EC_0px,#F7F3EC_8px,#F0E9DC_8px,#F0E9DC_16px)]"
      }
    >
      <span className="font-display text-xl text-navy/30">
        {name?.charAt(0)?.toUpperCase()}
      </span>
    </div>
  )
}

// Reusable order/summary card used on the cart and checkout pages.
// Accepts normalized line items: [{ id, name, price, quantity, image? }].
// Subtotal/total math lives in lib/cart.js (calcTotals) so it isn't
// duplicated across pages.
export default function OrderSummary({ items, title = "Order summary", showItems = true }) {
  const { subtotal, count } = calcTotals(items)

  return (
    <section className="rounded-lg border border-navy/10 bg-white p-5">
      <h2 className="font-display text-lg font-semibold text-navy">{title}</h2>

      {showItems && items.length > 0 && (
        <ul className="mt-4 flex flex-col gap-4">
          {items.map((item) => (
            <li key={item.id} className="flex items-start gap-3">
              <LineImage name={item.name} image={item.image} />
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 font-display text-sm font-medium leading-snug text-navy">
                  {item.name}
                </p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-navy/50">
                  Qty {item.quantity} · <Price value={item.price} className="text-navy/60" />
                </p>
              </div>
              <p className="flex-shrink-0 font-mono text-sm font-semibold tabular-nums text-navy">
                <Price value={Number(item.price) * Number(item.quantity)} />
              </p>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 space-y-2 border-t border-navy/10 pt-4">
        <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest text-navy/60">
          <span>Subtotal ({count} items)</span>
          <span className="tabular-nums"><Price value={subtotal} /></span>
        </div>
        <div className="flex items-center justify-between border-t border-navy/10 pt-3 font-mono text-base font-semibold text-navy">
          <span className="uppercase tracking-widest">Total</span>
          <span className="tabular-nums text-ochre-ink"><Price value={subtotal} /></span>
        </div>
      </div>
    </section>
  )
}
