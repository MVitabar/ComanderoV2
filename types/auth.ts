export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  role: UserRole
  establishment_id: string
  avatar?: string
  phone?: string
  status: UserStatus
  permissions: UserPermissions
  created_at: string
  updated_at: string
  last_login?: string
}

export interface UserPermissions {
  tables: boolean
  orders: boolean
  kitchen: boolean
  inventory: boolean
  reports: boolean
  users: boolean
  settings: boolean
}

export type UserRole = "owner" | "manager" | "chef" | "waiter" | "bartender" | "cashier"
export type UserStatus = "active" | "inactive" | "suspended" | "pending_verification"

export interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  // User information
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  phone?: string
  
  // Establishment information
  establishmentName: string
  establishmentType: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  timezone?: string
  plan?: 'starter' | 'professional' | 'enterprise'
}

export interface AuthResponse {
  user: any
  profile: User | null
  establishment?: any
  requiresEmailVerification?: boolean
}
