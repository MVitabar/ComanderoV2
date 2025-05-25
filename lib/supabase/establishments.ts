import { supabase } from "./client"
import type { Establishment } from "@/types/establishment"

export class EstablishmentService {
  static async getEstablishments(userId: string) {
    const { data, error } = await supabase.from("establishments").select("*").eq("ownerId", userId)

    if (error) throw error
    return data
  }

  static async getEstablishment(id: string) {
    const { data, error } = await supabase.from("establishments").select("*").eq("id", id).single()

    if (error) throw error
    return data
  }

  static async updateEstablishment(id: string, updates: Partial<Establishment>) {
    const { data, error } = await supabase.from("establishments").update(updates).eq("id", id).select().single()

    if (error) throw error
    return data
  }

  static async deleteEstablishment(id: string) {
    const { error } = await supabase.from("establishments").delete().eq("id", id)

    if (error) throw error
  }

  static async getEstablishmentStats(establishmentId: string) {
    // Get tables count
    const { count: tablesCount } = await supabase
      .from("tables")
      .select("*", { count: "exact", head: true })
      .eq("establishmentId", establishmentId)

    // Get staff count
    const { count: staffCount } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("establishmentId", establishmentId)

    // Get monthly revenue (simplified - would need proper date filtering)
    const { data: orders } = await supabase
      .from("orders")
      .select("total")
      .eq("establishmentId", establishmentId)
      .eq("status", "paid")

    const monthlyRevenue = orders?.reduce((sum, order) => sum + order.total, 0) || 0

    return {
      tablesCount: tablesCount || 0,
      staffCount: staffCount || 0,
      monthlyRevenue,
    }
  }
}
