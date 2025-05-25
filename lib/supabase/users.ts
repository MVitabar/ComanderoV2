import { supabase } from "./client"
import type { User } from "@/types/auth"

export class UserService {
  static async getUsers(establishmentId: string) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("establishmentId", establishmentId)
      .order("firstName")

    if (error) throw error
    return data
  }

  static async getUser(id: string) {
    const { data, error } = await supabase.from("users").select("*").eq("id", id).single()

    if (error) throw error
    return data
  }

  static async createUser(user: Omit<User, "id" | "createdAt" | "updatedAt">) {
    const { data, error } = await supabase.from("users").insert(user).select().single()

    if (error) throw error
    return data
  }

  static async updateUser(id: string, updates: Partial<User>) {
    const { data, error } = await supabase.from("users").update(updates).eq("id", id).select().single()

    if (error) throw error
    return data
  }

  static async deleteUser(id: string) {
    const { error } = await supabase.from("users").delete().eq("id", id)

    if (error) throw error
  }

  static async updateUserStatus(id: string, status: User["status"]) {
    return this.updateUser(id, { status })
  }

  static async getUsersByRole(establishmentId: string, role: User["role"]) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("establishmentId", establishmentId)
      .eq("role", role)

    if (error) throw error
    return data
  }

  static async updateLastLogin(id: string) {
    return this.updateUser(id, { lastLogin: new Date().toISOString() })
  }
}
