export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  establishmentId: string
  avatar?: string
  phone?: string
  status: UserStatus
  permissions: UserPermissions
  createdAt: string
  updatedAt: string
  lastLogin?: string
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
  address?: string
  city?: string
  country?: string
  timezone?: string
  plan?: string
  
  // Terms and preferences
  acceptTerms: boolean
  acceptMarketing?: boolean
}

export interface AuthResponse {
  user: any // Reemplazar con el tipo correcto de Supabase User
  profile: User | null
  establishment?: any // Reemplazar con el tipo correcto de Establishment
  requiresEmailVerification?: boolean
}
