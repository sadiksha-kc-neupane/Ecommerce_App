// ONE-TIME MIGRATION SCRIPT — migrate-category-enum.js
//
// 1) Reassign old retail-category rows (electronics/materials/agriculture/cosmetics)
//    to the neutral fallback "components" (all 8 have order history — user approved).
// 2) Replace enum_products_category with the 7-value IT-hardware taxonomy.
// 3) Add the new "subcategory" plain-string column.

import { sequelize } from "../model/index.js"

const NEW_VALUES = [
  "smartboard", "desktop", "laptop", "components", "cctv", "printer_scanner", "networking",
]

async function main() {
  await sequelize.authenticate()
  console.log("DB connected")

  const q = (sql, bind) => sequelize.query(sql, { bind })

  // ---- Step 0: sanity check current enum ----
  const cur = await q(
    `SELECT string_agg(e.enumlabel, ',' ORDER BY e.enumsortorder) AS labels
       FROM pg_type t JOIN pg_enum e ON e.enumtypid = t.oid
      WHERE t.typname = 'enum_products_category'`
  )
  console.log("current enum:", cur[0][0]?.labels)

  // ---- Step 1: reassign old rows to 'components' via a TEXT column ----
  console.log("\n[1] Switching category column to TEXT for reassignment...")
  await q(`ALTER TABLE products ALTER COLUMN category TYPE text USING category::text`)

  const old = ["electronics", "materials", "agriculture", "cosmetics"]
  const upd = await q(
    `UPDATE products SET category = 'components' WHERE category IN (${old.map((_, i) => `$${i + 1}`).join(",")}) RETURNING id, category`,
    old
  )
  console.log(`[1] Reassigned ${upd[1]?.rowCount ?? upd[0].length} row(s) to 'components'`)

  // ---- Step 2: swap the ENUM type ----
  console.log("\n[2] Renaming old enum / creating new enum / swapping column type...")
  await q(`ALTER TYPE enum_products_category RENAME TO enum_products_category_old`)
  await q(`CREATE TYPE enum_products_category AS ENUM (${NEW_VALUES.map((v) => `'${v}'`).join(",")})`)
  await q(
    `ALTER TABLE products ALTER COLUMN category TYPE enum_products_category USING category::enum_products_category`
  )
  await q(`DROP TYPE enum_products_category_old`)
  console.log("[2] ENUM swap complete")

  // ---- Step 3: add subcategory column ----
  console.log("\n[3] Adding subcategory column...")
  await q(`ALTER TABLE products ADD COLUMN IF NOT EXISTS subcategory TEXT`)
  console.log("[3] subcategory column ready")

  // ---- Step 4: verify ----
  const range = await q(`SELECT enum_range(NULL::enum_products_category) AS r`)
  console.log("\n[4] enum_range:", range[0][0].r)
  const subcol = await q(
    `SELECT column_name FROM information_schema.columns WHERE table_name='products' AND column_name='subcategory'`
  )
  console.log("[4] subcategory column exists:", subcol[0].length === 1)
  const cats = await q(`SELECT category, COUNT(*) FROM products GROUP BY category ORDER BY category`)
  console.log("[4] products per category:")
  for (const r of cats[0]) console.log(`     ${r.category}: ${r.count}`)

  await sequelize.close()
}

main().catch(async (err) => {
  console.error("MIGRATION FAILED:", err.message)
  await sequelize.close().catch(() => {})
  process.exit(1)
})
