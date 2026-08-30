// ONE-TIME MIGRATION SCRIPT — migrate-product-images.js
//
// Copies each existing product's single `productImage` (string) into the new
// `productImages` (array) field, so the array becomes the single source of
// truth for up to 5 images per product — without losing any existing image.
//
// Reuses the existing `connectDB` flow (authenticate + sync({ alter: true }))
// so the new `productImages` column is created before we backfill it.
//
// Usage:
//   node scripts/migrate-product-images.js

import { connectDB } from "../config/index.js"
import { sequelize, Product } from "../model/index.js"

async function main() {
  await connectDB()
  console.log("Migration: connected, model synced")

  const products = await Product.findAll()
  console.log(`Migration: found ${products.length} products`)

  let migrated = 0
  let alreadyHadImages = 0
  let noImage = 0

  for (const product of products) {
    const currentImages = Array.isArray(product.productImages) ? product.productImages : []

    if (product.productImage && currentImages.length === 0) {
      await product.update({ productImages: [product.productImage] })
      migrated++
    } else if (Array.isArray(product.productImages) && product.productImages.length > 0) {
      alreadyHadImages++
    } else {
      noImage++
    }
  }

  console.log(`Migration: migrated ${migrated} products into productImages`)
  console.log(`Migration: ${alreadyHadImages} already had productImages (left untouched)`)
  console.log(`Migration: ${noImage} products had no single image to migrate`)

  // ---- verify: list any product where the prev image did NOT make it in ----
  const after = await Product.findAll()
  let lost = 0
  for (const p of after) {
    const arr = Array.isArray(p.productImages) ? p.productImages : []
    if (p.productImage && !(arr.length > 0)) {
      lost++
      console.warn(`  !! LOST image for "${p.productName}" (${p.id})`)
    }
  }
  console.log(`Migration: products that lost their image = ${lost}`)

  await sequelize.close()
  console.log("Migration: done, connection closed")
}

main().catch(async (err) => {
  console.error("MIGRATION FAILED:", err)
  await sequelize.close().catch(() => {})
  process.exit(1)
})
