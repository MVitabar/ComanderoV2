"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    AuthService.getCurrentUser().then((user) => {
      setUser(user)
      setLoading(false)
    })
  }, [])

  const signIn = async (email: string, password: string) => {
    const { profile } = await AuthService.signIn({ email, password })
    setUser(profile)
  }

  const signUp = async (data: any) => {
    const { profile } = await AuthService.signUp(data)
    setUser(profile)
  }

  const signOut = async () => {
    await AuthService.signOut()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
