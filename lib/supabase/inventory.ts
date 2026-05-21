import { supabase } from "./client"
import type { InventoryItem, StockMovement } from "@/types/inventory"

export class InventoryService {
  static async getInventoryItems(establishment_id: string) {
    const { data, error } = await supabase
      .from("inventory_items")
      .select("*")
      .eq("establishment_id", establishment_id)
      .order("name")

    if (error) throw error
    return data
  }

  static async getInventoryItem(id: string) {
    const { data, error } = await supabase.from("inventory_items").select("*").eq("id", id).single()

    if (error) throw error
    return data
  }

  static async createInventoryItem(item: Omit<InventoryItem, "id" | "created_at" | "last_updated">) {
    const { data, error } = await supabase
      .from("inventory_items")
      .insert({
        ...item,
        status: this.calculateStatus(item.currentStock, item.minimumStock),
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updateInventoryItem(id: string, updates: Partial<InventoryItem>) {
    const updatesWithStatus = {
      ...updates,
      last_updated: new Date().toISOString(),
    }

    if (updates.currentStock !== undefined || updates.minimumStock !== undefined) {
      const { data: current } = await supabase
        .from("inventory_items")
        .select("currentStock, minimumStock")
        .eq("id", id)
        .single()

      if (current) {
        const currentStock = updates.currentStock ?? current.currentStock
        const minimumStock = updates.minimumStock ?? current.minimumStock
        updatesWithStatus.status = this.calculateStatus(currentStock, minimumStock)
      }
    }

    const { data, error } = await supabase
      .from("inventory_items")
      .update(updatesWithStatus)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async deleteInventoryItem(id: string) {
    const { error } = await supabase.from("inventory_items").delete().eq("id", id)

    if (error) throw error
  }

  static async getLowStockItems(establishment_id: string) {
    const { data, error } = await supabase
      .from("inventory_items")
      .select("*")
      .eq("establishment_id", establishment_id)
      .eq("status", "low")

    if (error) throw error
    return data
  }

  static async getCategories(establishment_id: string) {
    const { data, error } = await supabase
      .from("inventory_categories")
      .select("*")
      .eq("establishment_id", establishment_id)

    if (error) throw error
    return data
  }

  static async getSuppliers(establishment_id: string) {
    const { data, error } = await supabase.from("suppliers").select("*").eq("establishment_id", establishment_id)

    if (error) throw error
    return data
  }

  static async addStockMovement(movement: Omit<StockMovement, "id" | "created_at">) {
    const { data, error } = await supabase.from("stock_movements").insert(movement).select().single()

    if (error) throw error

    // Update item stock
    if (movement.type === "in") {
      await supabase.rpc("increment_stock", {
        item_id: movement.item_id,
        amount: movement.quantity,
      })
    } else if (movement.type === "out") {
      await supabase.rpc("decrement_stock", {
        item_id: movement.item_id,
        amount: movement.quantity,
      })
    }

    return data
  }

  private static calculateStatus(currentStock: number, minimumStock: number): InventoryItem["status"] {
    if (currentStock <= 0) return "out"
    if (currentStock <= minimumStock) return "low"
    if (currentStock <= minimumStock * 1.5) return "medium"
    return "good"
  }
}
