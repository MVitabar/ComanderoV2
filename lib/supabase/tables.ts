import { supabase } from "./client"
import type { Table, TableWithDetails } from "@/types/table"

export class TableService {
  static async getTables(establishmentId: string): Promise<TableWithDetails[]> {
    const { data, error } = await supabase
      .from("tables")
      .select(`
        *,
        waiter:users(id, firstName, lastName),
        orders:orders(*)
      `)
      .eq("establishmentId", establishmentId)

    if (error) throw error
    return data as TableWithDetails[]
  }

  static async getTable(id: string): Promise<TableWithDetails> {
    const { data, error } = await supabase
      .from("tables")
      .select(`
        *,
        waiter:users(id, firstName, lastName),
        orders:orders(*)
      `)
      .eq("id", id)
      .single()

    if (error) throw error
    return data as TableWithDetails
  }

  static async createTable(table: Omit<Table, "id" | "createdAt" | "updatedAt">) {
    const { data, error } = await supabase.from("tables").insert(table).select().single()

    if (error) throw error
    return data
  }

  static async updateTable(id: string, updates: Partial<Table>) {
    const { data, error } = await supabase.from("tables").update(updates).eq("id", id).select().single()

    if (error) throw error
    return data
  }

  static async deleteTable(id: string) {
    const { error } = await supabase.from("tables").delete().eq("id", id)

    if (error) throw error
  }

  static async updateTableStatus(id: string, status: Table["status"]) {
    return this.updateTable(id, { status })
  }

  static async assignWaiter(tableId: string, waiterId: string) {
    return this.updateTable(tableId, { waiterId })
  }
}
