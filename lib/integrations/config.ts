import type { Integration } from "./types"

export const defaultIntegrations: Integration[] = [
  {
    id: "google-analytics",
    name: "Google Analytics",
    description: "Track website traffic and user behavior",
    category: "analytics",
    enabled: false,
    icon: "📊",
    requiredFields: ["trackingId"],
    config: {
      trackingId: "",
      enableEcommerce: false,
      anonymizeIp: true,
    },
  },
  {
    id: "facebook-pixel",
    name: "Facebook Pixel",
    description: "Track conversions and optimize ads",
    category: "analytics",
    enabled: false,
    icon: "📘",
    requiredFields: ["pixelId"],
    config: {
      pixelId: "",
    },
  },
  {
    id: "hotjar",
    name: "Hotjar",
    description: "Heatmaps and session recordings",
    category: "analytics",
    enabled: false,
    icon: "🔥",
    requiredFields: ["siteId"],
    config: {
      siteId: "",
    },
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Accept online payments securely",
    category: "payments",
    enabled: false,
    icon: "💳",
    requiredFields: ["publicKey"],
    config: {
      publicKey: "",
      testMode: true,
    },
  },
  {
    id: "social-sharing",
    name: "Social Sharing",
    description: "Share content on social media",
    category: "social",
    enabled: true,
    icon: "📱",
    requiredFields: [],
    config: {
      platforms: ["twitter", "facebook", "linkedin"],
    },
  },
  {
    id: "intercom",
    name: "Intercom",
    description: "Customer support chat",
    category: "communication",
    enabled: false,
    icon: "💬",
    requiredFields: ["appId"],
    config: {
      appId: "",
    },
  },
]

export function getIntegrationsByCategory(category: string, integrations: Integration[]): Integration[] {
  return integrations.filter((integration) => integration.category === category)
}
