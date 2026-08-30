// ONE-TIME SEED SCRIPT — seed-tech-products.js
//
// Seeds smartboard, desktop and laptop products owned by the existing
// "seed-seller@bazario.test" account (reused, not duplicated).
//
// Field names are corrected to match the Product model:
//   productName | description | price | stock | category | status | productImages (array)
//
// NOTE: re-running this script WILL create duplicates — there is no unique
// constraint on productName. A guard below skips seeding if the seed seller
// already has at least TECH_PRODUCTS.length products; override with FORCE_SEED=1
// if you really want to.
//
// Usage:
//   node scripts/seed-tech-products.js            # seeds (or skips if already seeded)
//   FORCE_SEED=1 node scripts/seed-tech-products.js   # force re-seed

import { sequelize, Product, User } from "../model/index.js"

const SEED_EMAIL = "seed-seller@bazario.test"

const TECH_PRODUCTS = [
  // ---- smartboard ----
  {
    productName: "Hikvision 65 Inch Interactive Display",
    description: "65-inch 4K UHD interactive flat panel designed for classrooms, offices and meeting rooms. Features 3840x2160 resolution, multi-touch support, anti-glare display and built-in Android system.",
    price: 1799, stock: 8, category: "smartboard", status: "in_stock",
    productImages: ["https://images.unsplash.com/photo-1544717305-2782549b5136"],
  },
  {
    productName: "Hikvision 65 Inch 4K Interactive Panel",
    description: "65-inch 4K interactive display with 3840x2160 resolution, multi-touch functionality, anti-glare glass and support for interactive presentations and collaboration.",
    price: 1899, stock: 6, category: "smartboard", status: "in_stock",
    productImages: ["https://images.unsplash.com/photo-1497366754035-f200968a6e72"],
  },
  {
    productName: "Hikvision 75 Inch Interactive Display",
    description: "75-inch 4K UHD interactive display with 3840x2160 resolution, 50-point infrared touch, Android 14, 8GB RAM and 128GB storage.",
    price: 2499, stock: 5, category: "smartboard", status: "in_stock",
    productImages: ["https://images.unsplash.com/photo-1556761175-b413da4baf72"],
  },
  {
    productName: "Hikvision 75 Inch 4K Interactive Panel",
    description: "75-inch 4K interactive flat panel featuring anti-glare glass, multi-touch support and collaboration features for education and business environments.",
    price: 2599, stock: 4, category: "smartboard", status: "in_stock",
    productImages: ["https://images.unsplash.com/photo-1497366811353-6870744d04b2"],
  },
  {
    productName: "Hikvision 86 Inch Interactive Display",
    description: "86-inch 4K UHD interactive panel with 3840x2160 resolution, 50-point infrared touch, Android 14, 8GB RAM and 128GB storage.",
    price: 3299, stock: 3, category: "smartboard", status: "in_stock",
    productImages: ["https://images.unsplash.com/photo-1497366216548-37526070297c"],
  },
  {
    productName: "Hikvision 98 Inch Interactive Display",
    description: "98-inch 4K UHD interactive display designed for large classrooms, conference rooms and professional presentation environments. Features 3840x2160 resolution and large-format multi-touch interaction.",
    price: 5499, stock: 2, category: "smartboard", status: "in_stock",
    productImages: ["https://images.unsplash.com/photo-1497366754035-f200968a6e72"],
  },

  // ---- desktop ----
  {
    productName: "Acer Aspire C24 Ryzen 5 All-in-One",
    description: "23.8-inch Full HD all-in-one desktop powered by AMD Ryzen 5 7430U processor with 16GB RAM and 512GB PCIe SSD. Suitable for office work, education and everyday computing.",
    price: 699, stock: 10, category: "desktop", status: "in_stock",
    productImages: ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf"],
  },
  {
    productName: "Acer Aspire C24 Intel Core i5 All-in-One",
    description: "23.8-inch Full HD all-in-one desktop featuring Intel Core i5-1334U processor, 8GB RAM and integrated graphics. Designed for productivity, office work and home use.",
    price: 649, stock: 8, category: "desktop", status: "in_stock",
    productImages: ["https://images.unsplash.com/photo-1593642702821-c8da6771f0c6"],
  },
  {
    productName: "Lenovo IdeaCentre AIO 24 Core i5",
    description: "23.8-inch Full HD all-in-one desktop powered by Intel Core i5-13420H processor with DDR5 memory support and integrated Intel graphics. Includes HDMI 2.1 connectivity.",
    price: 799, stock: 7, category: "desktop", status: "in_stock",
    productImages: ["https://images.unsplash.com/photo-1593642532400-2682810df593"],
  },
  {
    productName: "Lenovo IdeaCentre AIO 24 Core i7",
    description: "23.8-inch Full HD all-in-one desktop powered by Intel Core i7-13620H processor with DDR5 memory support and integrated Intel graphics.",
    price: 949, stock: 5, category: "desktop", status: "in_stock",
    productImages: ["https://images.unsplash.com/photo-1550745165-9bc0b252726f"],
  },

  // ---- laptop ----
  {
    productName: "Acer Aspire 5 Ryzen 5 5625U",
    description: "15.6-inch Full HD IPS laptop powered by AMD Ryzen 5 5625U processor with 512GB PCIe SSD and AMD Radeon integrated graphics. Suitable for students, office work and everyday computing.",
    price: 549, stock: 12, category: "laptop", status: "in_stock",
    productImages: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853"],
  },
  {
    productName: "Acer Aspire 5 Core i7 1255U",
    description: "15.6-inch Full HD IPS laptop featuring 12th Gen Intel Core i7-1255U processor, 16GB DDR4 RAM, 512GB PCIe SSD and Intel Iris Xe Graphics.",
    price: 699, stock: 8, category: "laptop", status: "in_stock",
    productImages: ["https://images.unsplash.com/photo-1517336714739-489689fd1ca8"],
  },
  {
    productName: "Acer Aspire 5 RTX 2050",
    description: "15.6-inch Full HD IPS laptop with Intel Core i5-1240P processor, 8GB DDR4 RAM, 512GB PCIe SSD and NVIDIA GeForce RTX 2050 4GB graphics.",
    price: 749, stock: 7, category: "laptop", status: "in_stock",
    productImages: ["https://images.unsplash.com/photo-1603302576837-37561b2e2302"],
  },
  {
    productName: "Acer TravelMate P4 16",
    description: "16-inch business laptop with 1920x1200 IPS display, Intel Core Ultra 5 125U processor, 16GB DDR5 RAM, 512GB PCIe NVMe SSD and Windows 11 Pro.",
    price: 899, stock: 6, category: "laptop", status: "in_stock",
    productImages: ["https://images.unsplash.com/photo-1531297484001-80022131f5a1"],
  },
  {
    productName: "Acer TravelMate X4 14 AI",
    description: "14-inch AI laptop featuring Intel Core Ultra 7 258V processor, 32GB LPDDR5X memory and Intel Arc integrated graphics. Designed for professional productivity and AI workloads.",
    price: 1299, stock: 4, category: "laptop", status: "in_stock",
    productImages: ["https://images.unsplash.com/photo-1541807084-5c52b6b3adef"],
  },
  {
    productName: "Lenovo IdeaPad Slim 3 Core Ultra 5",
    description: "15.3-inch WUXGA IPS laptop powered by Intel Core Ultra 5 processor with Intel integrated graphics and DDR5 memory support. Designed for students and everyday productivity.",
    price: 699, stock: 10, category: "laptop", status: "in_stock",
    productImages: ["https://images.unsplash.com/photo-1484788984921-03950022c9ef"],
  },
  {
    productName: "Lenovo IdeaPad Slim 3 Ryzen",
    description: "15.3-inch laptop from Lenovo's IdeaPad Slim series with AMD Ryzen processor options, PCIe 4.0 SSD support and Windows 11.",
    price: 649, stock: 9, category: "laptop", status: "in_stock",
    productImages: ["https://images.unsplash.com/photo-1593642532744-d377ab507dc8"],
  },
  {
    productName: "Lenovo ThinkPad E14 Gen 6",
    description: "14-inch professional business laptop with Intel Core Ultra processor options, Intel AI Boost NPU, DDR5 memory and Windows 11 Pro. Designed for business and professional productivity.",
    price: 899, stock: 6, category: "laptop", status: "in_stock",
    productImages: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853"],
  },
  {
    productName: "Lenovo ThinkBook 14 G7 Ryzen 7",
    description: "14-inch business laptop powered by AMD Ryzen 7 7735HS processor with Radeon 680M integrated graphics and DDR5 memory support up to 64GB.",
    price: 999, stock: 5, category: "laptop", status: "in_stock",
    productImages: ["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed"],
  },
  {
    productName: "Lenovo LOQ 15 RTX 3050 Gaming Laptop",
    description: "15.6-inch gaming laptop with Full HD 144Hz display, Intel Core i5-13450HX processor, 16GB DDR5 RAM, 512GB PCIe 4.0 SSD and NVIDIA GeForce RTX 3050 6GB graphics.",
    price: 999, stock: 4, category: "laptop", status: "in_stock",
    productImages: ["https://images.unsplash.com/photo-1593642702821-c8da6771f0c6"],
  },
]

// Appends Unsplash sizing params so every image matches the app's format.
function normalizeImage(url) {
  return `${url}?w=800&q=80&fm=jpg`
}

async function main() {
  await sequelize.authenticate()
  console.log("DB connected")

  // ---- Step 1: reuse the existing seed seller (do NOT duplicate) ----
  const seller = await User.findOne({ where: { email: SEED_EMAIL } })
  if (!seller) {
    throw new Error(`Seed seller ${SEED_EMAIL} not found — run seed-products.js first to create it.`)
  }
  console.log(`Reusing seed seller ${SEED_EMAIL} (${seller.id}, role=${seller.role})`)

  // ---- Step 2: guard against accidental double-seeding ----
  const existing = await Product.count({ where: { userId: seller.id } })
  if (existing >= TECH_PRODUCTS.length && !process.env.FORCE_SEED) {
    console.warn(
      `\nSKIP: seed seller already has ${existing} products. ` +
        "Re-running would duplicate them. Use FORCE_SEED=1 to override.\n"
    )
    await sequelize.close()
    return
  }
  if (existing > 0 && process.env.FORCE_SEED) {
    console.log(`Seed seller already has ${existing} products; seeding ${TECH_PRODUCTS.length} more because FORCE_SEED was set.`)
  } else if (existing > 0) {
    console.log(
      `Seed seller already has ${existing} products (below threshold ${TECH_PRODUCTS.length}); ` +
        `seeding ${TECH_PRODUCTS.length} more.`
    )
  }

  // ---- Step 3: bulk-insert ----
  const rows = TECH_PRODUCTS.map((p) => ({
    userId: seller.id,
    productName: p.productName,
    description: p.description,
    price: p.price,
    stock: p.stock,
    category: p.category,
    status: p.status ?? (p.stock === 0 ? "out_of_stock" : "in_stock"),
    productImages: p.productImages.map(normalizeImage),
  }))

  const created = await Product.bulkCreate(rows)
  console.log(`\nInserted ${created.length} products`)

  // summary
  const byCategory = {}
  for (const r of created) byCategory[r.category] = (byCategory[r.category] || 0) + 1
  console.log("Per-category counts:", JSON.stringify(byCategory))

  await sequelize.close()
}

main().catch(async (err) => {
  console.error("SEED FAILED:", err)
  await sequelize.close().catch(() => {})
  process.exit(1)
})
