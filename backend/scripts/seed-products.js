// ONE-TIME SEED SCRIPT — seed-products.js

// Seeds 40 realistic products (10 per category: electronics, materials,
// agriculture, cosmetics) owned by a dedicated "Dipti&Suppliers Seed Seller" account.

// NOTE: re-running this script WILL create duplicates — there is no unique
// constraint on productName. A guard below skips seeding if the seed seller
// already has 40+ products; override with FORCE_SEED=1 if you really want to.

// Usage:
//   node scripts/seed-products.js            # seeds (or skips if already seeded)
//   FORCE_SEED=1 node scripts/seed-products.js   # force re-seed

// import bcrypt from "bcrypt"
// import { sequelize, Product, User } from "../model/index.js"

// const SEED_EMAIL = "seed-seller@bazario.test"
// const SEED_USERNAME = "bazario-seed-seller"
// const SEED_PASSWORD = "Bazario#2026"

// // Each product lists image candidates in preference order. The first URL
// // that actually resolves to an image is used (verified live below), so the
// // catalog never ends up with dead links even if an Unsplash ID goes away.
// const PRODUCTS = [
//   // ---- electronics ----
//   {
//     productName: "Aurora Wireless Noise-Cancelling Headphones",
//     description: "Over-ear headphones with hybrid active noise cancellation and 40-hour battery life. Memory-foam earcups fold flat for travel.",
//     price: 189.99, stock: 24, category: "electronics",
//     images: ["photo-1505740420928-5e560c06d30e", "photo-1583394838336-acd977736f90"],
//   },
//   {
//     productName: "Pulse True Wireless Earbuds",
//     description: "Compact earbuds with wireless charging case and USB-C fast charge. Six hours of playback per charge, 24 with the case.",
//     price: 59.99, stock: 40, category: "electronics",
//     images: ["photo-1590658268037-6bf12165a8df", "photo-1572569511254-d8f925fe2cbb"],
//   },
//   {
//     productName: "TactilePro Mechanical Keyboard (Brown Switches)",
//     description: "Tenkeyless mechanical keyboard with hot-swappable brown switches and PBT keycaps. Per-key white backlighting with adjustable brightness.",
//     price: 119.0, stock: 12, category: "electronics",
//     images: ["photo-1587829741301-dc798b83add3", "photo-1541140532154-b024d705b90a", "photo-1595225476474-87563907a212"],
//   },
//   {
//     productName: "Glide Ergonomic Wireless Mouse",
//     description: "Vertical-grip wireless mouse with silent clicks and a 4000 DPI adjustable sensor. Connects via 2.4GHz dongle or Bluetooth.",
//     price: 34.5, stock: 33, category: "electronics",
//     images: ["photo-1527864550417-7fd91fc51a46", "photo-1615663245857-ac93bb7c39e7"],
//   },
//   {
//     productName: 'VistaView 27" 4K IPS Monitor',
//     description: "27-inch 4K IPS display covering 99% sRGB with slim bezels. Includes height-adjustable stand, HDMI 2.0 and DisplayPort inputs.",
//     price: 329.99, stock: 4, category: "electronics",
//     images: ["photo-1527443224154-c4a3942d3acf", "photo-1585792180666-f7347c490ee2"],
//   },
//   {
//     productName: "BoomBox Mini Bluetooth Speaker",
//     description: "Pocket-size speaker with punchy bass and IPX7 water resistance for poolside use. Pairs instantly and runs 12 hours on a charge.",
//     price: 45.0, stock: 0, category: "electronics",
//     images: ["photo-1608043152269-423dbba4e7e1", "photo-1589003077984-894e133dabab", "photo-1545454675-3531b543be5d"],
//   },
//   {
//     productName: "VoltEdge 65W GaN Fast Charger",
//     description: "Three-port GaN charger that powers a laptop, phone and earbuds at once. Foldable prongs and built-in overcurrent protection.",
//     price: 29.99, stock: 52, category: "electronics",
//     images: ["photo-1583863788434-e58a36330cf0", "photo-1601972602288-3fdba9255aa6"],
//   },
//   {
//     productName: "Lumen Smart LED Bulb (Color, E26, 2-Pack)",
//     description: "16-million-color smart bulbs controlled by app or voice assistant. Supports schedules, sunrise wake-up scenes and dimming without a hub.",
//     price: 22.99, stock: 18, category: "electronics",
//     images: ["photo-1565814329452-e1efa11c5b89", "photo-1550985616-06ca44434ca8"],
//   },
//   {
//     productName: "StreamCam Pro 1080p Webcam",
//     description: "Full-HD webcam with autofocus, low-light correction and dual noise-reducing mics. Magnetic mount clips to any monitor or tripod.",
//     price: 64.99, stock: 0, category: "electronics",
//     images: ["photo-1587826298536-f20e2f0a4e21", "photo-1587826080692-f439cd0b70da", "photo-1493723843671-1d655e66ac1c"],
//   },
//   {
//     productName: "RetroRadio Bluetooth Tabletop Speaker",
//     description: "Vintage-style radio cabinet hiding a modern Bluetooth speaker with warm analog volume dial. Discontinued colorway while stocks last.",
//     price: 89.0, stock: 15, status: "discontinued", category: "electronics",
//     images: ["photo-1558537348-c0f8e733989d", "photo-1524678714210-9917a6c619c2"],
//   },

//   // ---- materials ----
//   {
//     productName: "PureForm Copper Wire Roll, 12 AWG, 25 ft",
//     description: "Soft-drawn bare copper wire, 12 gauge, ideal for grounding, jewelry work and craft armatures. Coils neatly without kinking.",
//     price: 18.75, stock: 30, category: "materials",
//     images: ["photo-1536599018102-9f803c140fc1", "photo-1565043666747-69f6646db940", "photo-1504917595217-d4dc5ebe6124"],
//   },
//   {
//     productName: "Timberline Kiln-Dried Oak Boards (Pack of 4)",
//     description: "Four kiln-dried red oak boards, planed smooth on all faces. Great for shelving, table tops and small furniture builds.",
//     price: 64.0, stock: 14, category: "materials",
//     images: ["photo-1520038410233-7141be7e6f97", "photo-1416339442236-8ceb164046f8", "photo-1461360370896-922624d12aa1"],
//   },
//   {
//     productName: "WeaveCo Heavyweight Cotton Canvas Fabric, 10 yd",
//     description: "10-yard roll of 12 oz cotton canvas in natural off-white. Stiff enough for tote bags, drop cloths and upholstery projects.",
//     price: 38.0, stock: 22, category: "materials",
//     images: ["photo-1620799140408-edc6dcb6d633", "photo-1544441893-675973e31985"],
//   },
//   {
//     productName: "GripHold Industrial Contact Adhesive, 1 qt",
//     description: "High-tack sprayable adhesive for laminates, foam and fabric. Bonds on contact and stays flexible once cured.",
//     price: 16.99, stock: 0, category: "materials",
//     images: ["photo-1580287927124-6b4cb66bdc48", "photo-1565043589221-1a6fd9ae45c7"],
//   },
//   {
//     productName: "ForgeFix Hex Bolt Assortment Kit (240 pc)",
//     description: "240 zinc-plated hex bolts, nuts and washers in eight common sizes. Comes in a labeled organizer case for the shop drawer.",
//     price: 24.99, stock: 41, category: "materials",
//     images: ["photo-1621905252507-b35492cc74b4", "photo-1621908745953-4d3ba50be259"],
//   },
//   {
//     productName: 'Birch Plywood Sheet, 1/4" x 2 x 4 ft',
//     description: "Smooth B/B-grade birch plywood with minimal voids on the edges. Cuts cleanly for laser work, dollhouses and drawer bottoms.",
//     price: 19.99, stock: 17, category: "materials",
//     images: ["photo-1517646287270-a5a9ca602e5c", "photo-1504148455328-c376907d081c"],
//   },
//   {
//     productName: 'Braided Nylon Utility Rope, 3/8" x 100 ft',
//     description: "Three-strand braided nylon rope with high tensile strength and good knot-holding. Resists rot, mildew and UV exposure outdoors.",
//     price: 13.25, stock: 55, category: "materials",
//     images: ["photo-1598887142487-3c854d51eabb", "photo-1520716963369-9b24de965de4"],
//   },
//   {
//     productName: "ClearCast Food-Safe Epoxy Resin Kit, 32 oz",
//     description: "Two-part epoxy that cures crystal clear and self-levels. Food-safe once cured, so it's popular for river tables and bar tops.",
//     price: 42.0, stock: 2, category: "materials",
//     images: ["photo-1610551870929-b53f53e0f62e", "photo-1615887023544-a4b1b4d0e0e0"],
//   },
//   {
//     productName: "Stainless Machine Screws M4 (100 pc)",
//     description: "100 stainless steel M4 machine screws in 12mm length with pan heads. Corrosion-resistant and compatible with standard hex drivers.",
//     price: 11.99, stock: 0, category: "materials",
//     images: ["photo-1580291654587-e4e7f34bb2c1", "photo-1531835551805-16d864c8d311"],
//   },
//   {
//     productName: "Heavyweight Jute Webbing, 10 yd",
//     description: "Classic red-and-natural jute webbing for upholstering chair seats and restoring mid-century furniture. Ten continuous yards.",
//     price: 21.0, stock: 6, category: "materials",
//     images: ["photo-1595515106864-077d30192c56", "photo-1620641788421-7a1c342ea42e"],
//   },

//   // ---- agriculture ----
//   {
//     productName: "Heirloom Beefsteak Tomato Seeds (250 ct)",
//     description: "Open-pollinated beefsteak tomato seeds producing large, meaty fruit in about 85 days. Non-GMO with a 90% germination rate.",
//     price: 6.99, stock: 48, category: "agriculture",
//     images: ["photo-1561136594-7f68413baa99", "photo-1592924357228-91a4daadcfea"],
//   },
//   {
//     productName: 'OrchardPro Stainless Pruning Shears, 8"',
//     description: "Bypass pruners with hardened stainless blades and a sap groove to keep cuts clean. Ergonomic non-slip grips reduce hand fatigue.",
//     price: 21.99, stock: 26, category: "agriculture",
//     images: ["photo-1591857177580-2b93496e4915", "photo-1589923188904-5caa9d5c0bfa", "photo-1466692476868-aef1dfb1e735"],
//   },
//   {
//     productName: "Forged Steel Garden Trowel",
//     description: "One-piece forged trowel with a polished blade depth markings for bulb planting. The ash handle is comfortable through long sessions.",
//     price: 12.5, stock: 31, category: "agriculture",
//     images: ["photo-1591857177580-2b93496e4915", "photo-1416879595882-3373a0480b5b", "photo-1589923188904-5caa9d5c0bfa"],
//   },
//   {
//     productName: "RichSoil Organic All-Purpose Fertilizer, 5 lb",
//     description: "OMRI-listed granular fertilizer blended from feather meal, bone meal and kelp. Feeds vegetables, herbs and flowers for up to 8 weeks.",
//     price: 18.99, stock: 0, category: "agriculture",
//     images: ["photo-1615486511484-92e172cc4fe0", "photo-1464226184884-fa280b87c399"],
//   },
//   {
//     productName: 'TerraClay Terracotta Plant Pots, 6" (Set of 6)',
//     description: "Six unglazed terracotta pots with drainage holes and matching saucers. Porous clay wicks excess moisture away from roots.",
//     price: 28.0, stock: 0, category: "agriculture",
//     images: ["photo-1485955900006-10f4d324d411", "photo-1459411552884-841db9b3cc2a"],
//   },
//   {
//     productName: "Soaker Hose Irrigation Kit, 50 ft",
//     description: "Porous soaker hose with brass fittings and a pressure regulator that weeps water directly at the root zone. Cuts water waste by up to 70%.",
//     price: 24.99, stock: 4, category: "agriculture",
//     images: ["photo-1613521140785-e85e427f8002", "photo-1592982537447-7440770cbfc9"],
//   },
//   {
//     productName: "Pollinator Wildflower Seed Mix, 1 oz",
//     description: "Blend of 19 annual and perennial wildflowers chosen for bees and butterflies. Covers roughly 200 square feet and blooms spring through fall.",
//     price: 9.99, stock: 37, category: "agriculture",
//     images: ["photo-1490750967868-88aa4486c946", "photo-1462275646964-a0e3386b89fa"],
//   },
//   {
//     productName: "CloverField Layer Feed Pellets for Chickens, 20 lb",
//     description: "Complete 16%-protein layer feed with added calcium for strong eggshells. Pelleted form reduces waste compared to mash.",
//     price: 17.49, stock: 11, category: "agriculture",
//     images: ["photo-1516467508483-a7212febe31a", "photo-1500595046743-cd271d694d30"],
//   },
//   {
//     productName: "DripLine Emitter Starter Set (30 pc)",
//     description: "Adjustable drip emitters, barbed tees and stakes for building custom watering lines from half-inch tubing. Tool-free assembly.",
//     price: 14.99, stock: 8, status: "discontinued", category: "agriculture",
//     images: ["photo-1563555642114-2d6b5d0e0b3d", "photo-1592982537447-7440770cbfc9"],
//   },
//   {
//     productName: "Cedar Raised Garden Bed Kit, 4x4 ft",
//     description: "Untreated western red cedar boards with rust-proof corner pins. Natural rot resistance means no chemicals near your soil.",
//     price: 59.99, stock: 6, category: "agriculture",
//     images: ["photo-1466692476868-aef1dfb1e735", "photo-1523348837708-15d4a09cfac2"],
//   },

//   // ---- cosmetics ----
//   {
//     productName: "Hydra Glow Vitamin C Brightening Serum, 30 ml",
//     description: "Lightweight serum with 15% stabilized vitamin C and hyaluronic acid. Fades dark spots and boosts radiance without stickiness.",
//     price: 32.0, stock: 21, category: "cosmetics",
//     images: ["photo-1620916566398-39f1143ab7be", "photo-1608248543803-ba4f8c70ae0b"],
//   },
//   {
//     productName: "Silk Finish Lipstick, Rosewood",
//     description: "Creamy satin lipstick in a muted rosewood shade with buildable coverage. Shea butter keeps lips comfortable all day.",
//     price: 18.5, stock: 35, category: "cosmetics",
//     images: ["photo-1586495777744-4413f21062fa", "photo-1631214540242-3cd8c4b0b3b8"],
//   },
//   {
//     productName: "Deep Hydration Ceramide Moisturizer, 50 ml",
//     description: "Fragrance-free daily cream with three ceramides and squalane. Restores the skin barrier overnight without clogging pores.",
//     price: 28.99, stock: 0, category: "cosmetics",
//     images: ["photo-1556228720-195a672e8a03", "photo-1571781926291-c477ebfd024b"],
//   },
//   {
//     productName: "Rose Quartz Facial Roller",
//     description: "Dual-ended rose quartz roller that de-puffs and helps serums absorb. Smooth-polished stone with a quiet, no-squeak frame.",
//     price: 15.99, stock: 27, category: "cosmetics",
//     images: ["photo-1616683693504-3ea7e9ad6fec", "photo-1620916297397-a4a5402a3c6c"],
//   },
//   {
//     productName: "Volumizing Botanical Shampoo, 400 ml",
//     description: "Sulfate-free shampoo with rosemary and rice protein that adds body at the roots. Color-safe and gentle enough for daily washing.",
//     price: 16.99, stock: 44, category: "cosmetics",
//     images: ["photo-1631729371254-42c2892f0e6e", "photo-1585232004423-244e0e6904e3"],
//   },
//   {
//     productName: "Matte Liquid Eyeliner, Jet Black",
//     description: "Ultra-fine felt tip draws precise lines that set fast and last 12 hours without smudging. Ophthalmologist tested for sensitive eyes.",
//     price: 14.5, stock: 0, category: "cosmetics",
//     images: ["photo-1583241800698-e8ab01c85918", "photo-1591360236480-9c6a8b0b7b6d"],
//   },
//   {
//     productName: "Renewal Night Cream with Retinol, 30 ml",
//     description: "Encapsulated retinol paired with peptides and ceramides to smooth fine lines while you sleep. Start with two nights a week.",
//     price: 42.0, stock: 13, category: "cosmetics",
//     images: ["photo-1611930022073-b7a4ba5fcccd", "photo-1620916297397-a4a5402a3c6c"],
//   },
//   {
//     productName: "Shea Butter Lip Balm Trio",
//     description: "Three everyday balms — vanilla, mint and berry — with raw shea butter and beeswax. No petrolatum, no parabens.",
//     price: 11.99, stock: 58, category: "cosmetics",
//     images: ["photo-1608248597279-f99d160bfcbc", "photo-1599305090598-fe179d501227"],
//   },
//   {
//     productName: "Professional Makeup Brush Set (12 pc)",
//     description: "Twelve vegan-fiber brushes covering face, eyes and brows, with labeled handles. Synthetic bristles wash clean and don't shed.",
//     price: 36.0, stock: 10, category: "cosmetics",
//     images: ["photo-1512496015851-a90fb38ba796", "photo-1487412947147-5cebf100ffc2"],
//   },
//   {
//     productName: "Cooling Jade Gua Sha Sculpting Tool",
//     description: "Hand-carved jade gua sha stone with a contoured edge for jawline and under-eye massage. Chill it in the fridge before use.",
//     price: 19.99, stock: 19, category: "cosmetics",
//     images: ["photo-1620916297397-a4a5402a3c6c", "photo-1616683693504-3ea7e9ad6fec"],
//   },
// ]

// // Near-certain famous Unsplash IDs as last-resort fallbacks per category,
// // so every product ends up with SOME working, relevant image.
// const CATEGORY_ANCHORS = {
//   electronics: ["photo-1518770660439-4636190af475", "photo-1498049794561-7780e7231661", "photo-1505740420928-5e560c06d30e"],
//   materials: ["photo-1504148455328-c376907d081c", "photo-1581094794329-c8112a89af12", "photo-1517646287270-a5a9ca602e5c"],
//   agriculture: ["photo-1416879595882-3373a0480b5b", "photo-1466692476868-aef1dfb1e735", "photo-1518843875459-f738682238a6"],
//   cosmetics: ["photo-1512496015851-a90fb38ba796", "photo-1522335789203-aabd1fc54bc9", "photo-1596462502278-27bfdc403348"],
// }

// function url(id) {
//   return `https://images.unsplash.com/${id}?w=800&q=80&fm=jpg`
// }

// async function resolveImage(product) {
//   const candidates = [...(product.images || []), ...CATEGORY_ANCHORS[product.category]]
//   const tried = []
//   for (const id of candidates) {
//     try {
//       const res = await fetch(url(id), { method: "GET" })
//       const type = res.headers.get("content-type") || ""
//       if (res.ok && type.startsWith("image/")) return { resolvedId: id, tried }
//       tried.push({ id, reason: `status ${res.status} type ${type}` })
//     } catch (err) {
//       tried.push({ id, reason: err.message })
//     }
//   }
//   return null
// }

// async function main() {
//   await sequelize.authenticate()
//   console.log("DB connected")

//   // ---- Step 1: find/create the dedicated seed seller ----
//   let seller = await User.findOne({ where: { email: SEED_EMAIL } })
//   if (!seller) {
//     seller = await User.create({
//       username: SEED_USERNAME,
//       email: SEED_EMAIL,
//       password: bcrypt.hashSync(SEED_PASSWORD, 10),
//       role: "seller",
//     })
//     console.log(`Created seed seller ${SEED_EMAIL} (${seller.id})`)
//   } else {
//     console.log(`Using existing seed seller ${SEED_EMAIL} (${seller.id}, role=${seller.role})`)
//   }

//   // ---- Step 5 guard: avoid accidental double-seeding ----
//   const existing = await Product.count({ where: { userId: seller.id } })
//   if (existing >= PRODUCTS.length && !process.env.FORCE_SEED) {
//     console.warn(
//       `\nSKIP: seed seller already has ${existing} products. ` +
//         "Re-running would duplicate them. Use FORCE_SEED=1 to override.\n"
//     )
//     await sequelize.close()
//     return
//   }
//   if (existing > 0) {
//     console.log(`Seed seller already has ${existing} products; seeding ${PRODUCTS.length} more because FORCE_SEED was set.`)
//   }

//   // ---- Step 2/3: verify image URLs and bulk-insert ----
//   const rows = []
//   let fellBack = 0
//   for (const p of PRODUCTS) {
//     const result = await resolveImage(p)
//     if (!result) {
//       console.error(`!! No working image found for "${p.productName}" — skipping this product`)
//       continue
//     }
//     if (result.tried.length > 0) {
//       fellBack++
//       console.warn(`  fallback for "${p.productName}" -> using ${result.resolvedId} (tried ${result.tried.map(t => `${t.id}: ${t.reason}`).join("; ")})`)
//     }
//     rows.push({
//       userId: seller.id,
//       productName: p.productName,
//       description: p.description,
//       price: p.price,
//       stock: p.stock,
//       category: p.category,
//       status: p.status ?? (p.stock === 0 ? "out_of_stock" : "in_stock"),
//       productImage: url(result.resolvedId),
//     })
//   }

//   const created = await Product.bulkCreate(rows)
//   console.log(`\nInserted ${created.length} products`)

//   // summary
//   const byCategory = {}
//   for (const r of created) byCategory[r.category] = (byCategory[r.category] || 0) + 1
//   console.log("Per-category counts:", JSON.stringify(byCategory))
//   console.log(`Products whose primary image fell back to an alternate: ${fellBack}`)

//   await sequelize.close()
// }

// main().catch(async (err) => {
//   console.error("SEED FAILED:", err)
//   await sequelize.close().catch(() => {})
//   process.exit(1)
// })
