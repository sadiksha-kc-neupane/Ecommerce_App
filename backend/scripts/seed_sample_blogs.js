import { sequelize } from "../config/connection.js"
import { Blog, User } from "../model/index.js"
import { generateUniqueSlug } from "../controllers/blogController.js"

async function seed() {
  console.log("Checking and seeding realistic blog posts...")

  const admin = await User.findOne({ where: { role: "admin" } })
  const adminId = admin ? admin.id : null

  const posts = [
    {
      title: "How to Choose the Right Interactive Smartboard for Modern Classrooms & Boardrooms",
      subtitle: "Comparing 4K touch displays, multi-touch latency, OS integration, and optical bonding.",
      category: "buying-guides",
      thumbnail: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80",
      description: `Interactive flat panel displays (smartboards) have revolutionized teaching institutions and enterprise conference rooms across Nepal. When choosing a smartboard, four core technical specifications determine whether your investment will deliver lasting value:

1. Display Resolution & Optical Bonding: Ensure the panel features true 4K UHD (3840x2160) resolution with anti-glare tempered glass. Opt for zero-gap optical bonding to eliminate parallax error when writing with a stylus.

2. Touch Point Sensitivity: Modern collaborative setups require at least 20 to 40 simultaneous touch points to accommodate multiple users working side-by-side without lag.

3. Dual Operating System Architecture: Look for panels that run Android on-board for fast whiteboard startup, alongside an Open Pluggable Specification (OPS) slot supporting a dedicated Windows PC module for heavy productivity workloads.

4. Audio-Visual Integration: Built-in 8-array beamforming microphones and high-resolution wide-angle cameras simplify Zoom and Microsoft Teams hybrid meetings without needing messy external wiring.

Dipti & Suppliers stocks certified interactive smartboard displays ranging from 65-inch to 86-inch panels with on-site installation and staff training included.`,
    },
    {
      title: "Optimizing CCTV Security Infrastructure for Commercial Buildings & Warehouses",
      subtitle: "IP camera sensor selection, NVR bandwidth calculation, and night-vision coverage tips.",
      category: "tech-tips",
      thumbnail: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80",
      description: `Securing enterprise facilities, retail stores, and warehouses requires strategic surveillance planning beyond just mounting cameras at entrances:

1. Lens Focal Length & Field of View: Wide-angle 2.8mm lenses are ideal for reception lobbies and open warehouse floors, while 4mm to 6mm lenses provide the necessary magnification to capture license plates and facial details at security gates.

2. Network Video Recorder (NVR) Throughput: Calculate total camera bitrates (H.265 compression reduces bandwidth requirements by up to 50% compared to H.264). Ensure your PoE switches and NVR have sufficient power budget and incoming throughput.

3. Low-Light & ColorVu Technology: High-risk perimeters require cameras equipped with large aperture sensors (F1.0) and supplementary warm lighting to maintain full-color video even in pitch-black conditions.

4. Uninterruptible Power Supply (UPS): Never connect surveillance equipment directly to mains without a dedicated online UPS to prevent recording loss during voltage drops or planned power outages.`,
    },
    {
      title: "Dipti & Suppliers Expands Enterprise Server & Network Hardware Deployment Services",
      subtitle: "Dedicated IT infrastructure consultation, rack mounting, and structured cabling solutions.",
      category: "announcements",
      thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
      description: `We are pleased to announce our expanded enterprise solutions catalog for businesses, educational institutions, and government offices.

Our team now offers complete turnkey procurement:
- Enterprise rackmount and tower servers customized with ECC RAM and redundant NVMe RAID arrays.
- High-density Gigabit PoE switches, enterprise Wi-Fi 6 access points, and hardware firewall routers.
- High-volume thermal barcode scanners, heavy-duty network printers, and digital signature capture pads.

Contact our business sales desk at +977-9804045706 or email hello@diptisuppliers.com for tailored institutional pricing and warranty support.`,
    },
  ]

  for (const post of posts) {
    const existing = await Blog.findOne({ where: { title: post.title } })
    if (!existing) {
      const slug = await generateUniqueSlug(post.title)
      await Blog.create({
        userId: adminId,
        title: post.title,
        slug,
        subtitle: post.subtitle,
        description: post.description,
        category: post.category,
        thumbnail: post.thumbnail,
      })
      console.log(`Created sample post: "${post.title}" (slug: ${slug})`)
    } else {
      console.log(`Post already exists: "${post.title}"`)
    }
  }

  console.log("Seeding complete.")
  process.exit(0)
}

seed().catch((e) => {
  console.error("Seeding error:", e)
  process.exit(1)
})
