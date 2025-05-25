import { supabase } from "./client"
import type { Order, OrderWithDetails, OrderItem } from "@/types/order"

export class OrderService {
  static async getOrders(establishmentId: string): Promise<OrderWithDetails[]> {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        table:tables(number),
        waiter:users(firstName, lastName),
        items:order_items(*)
      `)
      .eq("establishmentId", establishmentId)
      .order("createdAt", { ascending: false })

    if (error) throw error
    return data as OrderWithDetails[]
  }

  static async getOrder(id: string): Promise<OrderWithDetails> {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        table:tables(number),
        waiter:users(firstName, lastName),
        items:order_items(*)
      `)
      .eq("id", id)
      .single()

    if (error) throw error
    return data as OrderWithDetails
  }

  static async createOrder(order: Omit<Order, "id" | "createdAt" | "updatedAt">, items: Omit<OrderItem, "id">[]) {
    const { data: orderData, error: orderError } = await supabase.from("orders").insert(order).select().single()

    if (orderError) throw orderError

    // Insert order items
    const orderItems = items.map((item) => ({
      ...item,
      orderId: orderData.id,
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
      updates.completedAt = new Date().toISOString()
    }

    return this.updateOrder(id, updates)
  }

  static async deleteOrder(id: string) {
    // Delete order items first
    await supabase.from("order_items").delete().eq("orderId", id)

    // Delete order
    const { error } = await supabase.from("orders").delete().eq("id", id)

    if (error) throw error
  }

  static async getOrdersByTable(tableId: string) {
    const { data, error } = await supabase.from("orders").select("*").eq("tableId", tableId).neq("status", "paid")

    if (error) throw error
    return data
  }

  static async getOrdersByStatus(establishmentId: string, status: Order["status"]) {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        table:tables(number),
        waiter:users(firstName, lastName),
        items:order_items(*)
      `)
      .eq("establishmentId", establishmentId)
      .eq("status", status)

    if (error) throw error
    return data as OrderWithDetails[]
  }
}
