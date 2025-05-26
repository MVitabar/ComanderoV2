export interface Establishment {
  id: string
  name: string
  type: EstablishmentType
  address: string
  city: string
  state: string
  zip_code: string
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
  owner_id: string
  settings: EstablishmentSettings
  trial_ends_at?: string
  created_at: string
  updated_at: string
}

export type EstablishmentType = "restaurant" | "cafe" | "bar" | "fastfood" | "pizzeria" | "bakery" | "other"
export type EstablishmentStatus = "active" | "inactive" | "suspended" | "pending_verification"
export type SubscriptionPlan = "free" | "starter" | "professional" | "enterprise"

export interface EstablishmentSettings {
  notifications: NotificationSettings
  integrations: IntegrationSettings
  security: SecuritySettings
  [key: string]: any // Para permitir propiedades adicionales
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
  [key: string]: any // Para permitir propiedades adicionales
}

export interface IntegrationSettings {
  thermalPrinter: {
    enabled: boolean
    printerName: string
    [key: string]: any // Para permitir propiedades adicionales
  }
  [key: string]: any // Para permitir propiedades adicionales
}

export interface SecuritySettings {
  twoFactorAuth: boolean
  sessionTimeout: number
  passwordPolicy: string
  loginAttempts: number
  ipWhitelist: string[]
  [key: string]: any // Para permitir propiedades adicionales
}
