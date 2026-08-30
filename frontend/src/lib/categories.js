// Single source of truth for the product category taxonomy.
//
// Categories mirror the Product model's category ENUM (backend):
//   smartboard | desktop | laptop | components | cctv | printer_scanner | networking
//
// Subcategories are intentionally NOT enforced at the database level — they are
// a frontend-driven dropdown list per category, so they can be adjusted here
// without another migration.
export const CATEGORIES = [
  {
    value: "laptop",
    label: "Laptops",
    subcategories: ["Business", "Gaming", "Ultrabooks", "2-in-1"],
  },
  {
    value: "desktop",
    label: "Desktops & Server",
    subcategories: ["All-in-One", "Tower", "Servers", "Workstations"],
  },
  {
    value: "components",
    label: "Components",
    subcategories: ["RAM", "Storage/SSD", "Motherboards", "Graphics Cards", "Processors", "Power Supplies"],
  },
  {
    value: "cctv",
    label: "CCTV & Accessories",
    subcategories: ["Cameras", "DVR/NVR", "Cables & Connectors", "Accessories"],
  },
  {
    value: "printer_scanner",
    label: "Printer & Scanner",
    subcategories: ["Inkjet", "Laser", "Scanners", "Accessories"],
  },
  {
    value: "networking",
    label: "Networking",
    subcategories: ["Routers", "Switches", "Access Points", "Cables"],
  },
  {
    value: "smartboard",
    label: "Smartboards",
    subcategories: [],
  },
]

// Muted, mid-saturation category marker colors. Chosen to stay within the same
// warm/muted family as ochre/rust/moss and to be clearly distinct from the
// reserved teal (#1B7F79) low-stock alert color. Keyed by category value.
export const CATEGORY_COLORS = {
  laptop: "#3D7CA6", // steel blue
  desktop: "#A68A5B", // warm tan
  components: "#A75A7E", // soft rose
  cctv: "#546166", // slate gray
  printer_scanner: "#B07A3C", // amber/bronze
  networking: "#5751A0", // indigo
  smartboard: "#8A63B8", // violet
}

// value -> human-readable label, e.g. "printer_scanner" -> "Printer & Scanner"
export const CATEGORY_LABELS = Object.fromEntries(
  CATEGORIES.map((c) => [c.value, c.label])
)

// Look up a category entry by value; returns undefined if not found.
export const findCategory = (value) =>
  CATEGORIES.find((c) => c.value === value)
