import { supabase } from "./client"
import type { Order, OrderWithDetails, OrderItem } from "@/types/order"

export class OrderService {
  static async getOrders(establishment_id: string): Promise<OrderWithDetails[]> {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        table:tables(number),
        waiter:profiles(first_name, last_name),
        items:order_items(*)
      `)
      .eq("establishment_id", establishment_id)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data as OrderWithDetails[]
  }

  static async getOrder(id: string): Promise<OrderWithDetails> {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        table:tables(number),
        waiter:profiles(first_name, last_name),
        items:order_items(*)
      `)
      .eq("id", id)
      .single()

    if (error) throw error
    return data as OrderWithDetails
  }

  static async createOrder(order: Omit<Order, "id" | "created_at" | "updated_at">, items: Omit<OrderItem, "id">[]) {
    const { data: orderData, error: orderError } = await supabase.from("orders").insert(order).select().single()

    if (orderError) throw orderError

    // Insert order items
    const orderItems = items.map((item) => ({
      ...item,
      order_id: orderData.id,
    }))

    const { data: itemsData, error: itemsError } = await supabase.from("order_items").insert(orderItems).select()

    if (itemsError) throw itemsError

    return { order: orderData, items: itemsData }
  }

  static async updateOrder(id: string, updates: Partial<Order>) {
    const { data, error } = await supabase.from("orders").update(updates).eq("id", id).select().single()

    if (error) throw error
    return data
  }

  static async updateOrderStatus(id: string, status: Order["status"]) {
    const updates: Partial<Order> = { status }

    if (status === "served") {
      updates.completed_at = new Date().toISOString()
    }

    return this.updateOrder(id, updates)
  }

  static async deleteOrder(id: string) {
    // Delete order items first
    await supabase.from("order_items").delete().eq("order_id", id)

    // Delete order
    const { error } = await supabase.from("orders").delete().eq("id", id)

    if (error) throw error
  }

  static async getOrdersByTable(table_id: string) {
    const { data, error } = await supabase.from("orders").select("*").eq("table_id", table_id).neq("status", "paid")

    if (error) throw error
    return data
  }

  static async getOrdersByStatus(establishment_id: string, status: Order["status"]) {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        table:tables(number),
        waiter:profiles(first_name, last_name),
        items:order_items(*)
      `)
      .eq("establishment_id", establishment_id)
      .eq("status", status)

    if (error) throw error
    return data as OrderWithDetails[]
  }

  static async getRecentOrders(establishment_id: string, limit: number = 10): Promise<OrderWithDetails[]> {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        table:tables(number),
        waiter:profiles(first_name, last_name),
        items:order_items(*)
      `)
      .eq("establishment_id", establishment_id)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) throw error
    return data as OrderWithDetails[]
  }
}
