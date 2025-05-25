export interface Integration {
  id: string
  name: string
  description: string
  category: "analytics" | "payments" | "social" | "communication"
  enabled: boolean
  icon: string
  requiredFields: string[]
  config: Record<string, any>
}

export interface IntegrationField {
  key: string
  label: string
  type: "text" | "password" | "boolean" | "select"
  required: boolean
  placeholder?: string
  description?: string
  options?: Array<{ label: string; value: string }>
}

export interface IntegrationConfig {
  [key: string]: Integration
}
