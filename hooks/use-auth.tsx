"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { AuthService } from "@/lib/supabase/auth"
import type { User } from "@/types/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (data: any) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

// Función para mapear el usuario de AuthService al tipo User de la aplicación
const mapAuthUserToAppUser = (authUser: any): User | null => {
  if (!authUser) return null
  
  return {
    id: authUser.id,
    email: authUser.email || '',
    first_name: authUser.first_name || authUser.user_metadata?.first_name || '',
    last_name: authUser.last_name || authUser.user_metadata?.last_name || '',
    role: authUser.role || 'waiter',
    establishment_id: authUser.establishment_id || '',
    status: authUser.status || 'active',
    permissions: authUser.permissions || {
      tables: true,
      orders: true,
      kitchen: false,
      inventory: false,
      reports: false,
      users: false,
      settings: false
    },
    created_at: authUser.created_at || new Date().toISOString(),
    updated_at: authUser.updated_at || new Date().toISOString(),
    last_login: authUser.last_sign_in_at || null
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data, error } = await AuthService.getCurrentUser()
        if (data?.user) {
          setUser(mapAuthUserToAppUser(data.user))
        }
      } catch (error) {
        console.error("Error al verificar el usuario:", error)
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [])

  const signIn = async (email: string, password: string) => {
    const result = await AuthService.signIn({ email, password })
    if (result.user) {
      setUser(mapAuthUserToAppUser(result.user))
    }
    if (result.error) {
      throw result.error
    }
  }

  const signUp = async (userData: any) => {
    try {
      const { user } = await AuthService.signUp(userData)
      if (user) {
        setUser(mapAuthUserToAppUser(user))
      }
    } catch (error) {
      console.error('Error en el registro:', error)
      throw error
    }
  }

  const signOut = async () => {
    await AuthService.signOut()
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return (
    <>
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    </>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider")
  }
  return context
}
