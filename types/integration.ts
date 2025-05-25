export type IntegrationCategory = 'analytics' | 'payments' | 'social' | 'communication' | 'other'

export interface IntegrationConfig {
  [key: string]: string | boolean | string[] | undefined
  trackingId?: string
  enableEcommerce?: boolean
  anonymizeIp?: boolean
  pixelId?: string
  siteId?: string
  publicKey?: string
  testMode?: boolean
  platforms?: string[]
  appId?: string
}

export interface Integration {
  id: string
  name: string
  description: string
  category: IntegrationCategory
  enabled: boolean
  icon: string
  requiredFields: string[]
  config: IntegrationConfig
}

export interface UserIntegration extends Integration {
  id: string
  userId: string
  integrationId: string
  config: IntegrationConfig
  createdAt: string
  updatedAt: string
}

export interface IntegrationEvent {
  id: string
  integrationId: string
  type: string
  status: 'success' | 'error' | 'pending'
  message: string
  metadata?: Record<string, unknown>
  createdAt: string
}
