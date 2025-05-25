export interface Establishment {
  id: string
  name: string
  type: EstablishmentType
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
  email: string
  website?: string
  description?: string
  logo?: string
  timezone: string
  currency: string
  language: string
  plan: SubscriptionPlan
  status: EstablishmentStatus
  ownerId: string
  settings: EstablishmentSettings
  createdAt: string
  updatedAt: string
}

export type EstablishmentType = "restaurant" | "cafe" | "bar" | "fastfood" | "pizzeria" | "bakery"
export type EstablishmentStatus = "active" | "inactive" | "suspended"
export type SubscriptionPlan = "starter" | "professional" | "enterprise"

export interface EstablishmentSettings {
  notifications: NotificationSettings
  integrations: IntegrationSettings
  security: SecuritySettings
}

export interface NotificationSettings {
  newOrders: boolean
  lowStock: boolean
  staffLogin: boolean
  dailyReports: boolean
  weeklyReports: boolean
  systemUpdates: boolean
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
}

export interface IntegrationSettings {
  thermalPrinter: {
    enabled: boolean
    printerName: string
    ipAddress: string
    port: string
  }
  paymentGateway: {
    enabled: boolean
    provider: string
    testMode: boolean
  }
  analytics: {
    enabled: boolean
    googleAnalytics: string
  }
}

export interface SecuritySettings {
  twoFactorAuth: boolean
  sessionTimeout: string
  passwordPolicy: string
  loginAttempts: string
  ipWhitelist: string
}
