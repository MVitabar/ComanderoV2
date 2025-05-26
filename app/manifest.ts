import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Comandero - Multi-Tenant Restaurant Management SaaS",
    short_name: "Comandero",
    description:
      "Comprehensive multi-tenant SaaS platform for restaurant management with table control, orders, inventory, and more.",
    start_url: "/login",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    orientation: "portrait",
    scope: "/",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    categories: ["business", "productivity", "food"],
    lang: "en",
    dir: "ltr",
  }
}
