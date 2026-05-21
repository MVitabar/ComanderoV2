import { supabase } from "./client"
import type { User } from "@/types/auth"

export class UserService {
  static async getUsers(establishment_id: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("establishment_id", establishment_id)
      .order("first_name")

    if (error) throw error
    return data
  }

  static async getUser(id: string) {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single()

    if (error) throw error
    return data
  }

  static async createUser(user: Omit<User, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase.from("profiles").insert(user).select().single()

    if (error) throw error
    return data
  }

  static async updateUser(id: string, updates: Partial<User>) {
    const { data, error } = await supabase.from("profiles").update(updates).eq("id", id).select().single()

    if (error) throw error
    return data
  }

  static async deleteUser(id: string) {
    const { error } = await supabase.from("profiles").delete().eq("id", id)

    if (error) throw error
  }

  static async updateUserStatus(id: string, status: User["status"]) {
    return this.updateUser(id, { status })
  }

  static async getUsersByRole(establishment_id: string, role: User["role"]) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("establishment_id", establishment_id)
      .eq("role", role)

    if (error) throw error
    return data
  }

  static async updateLastLogin(id: string) {
    return this.updateUser(id, { last_login: new Date().toISOString() })
  }
}
