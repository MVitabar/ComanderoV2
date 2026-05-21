import { supabase } from "./client"
import type { SalesReport, StaffPerformance, TableUtilization } from "@/types/reports"
import { DollarSign, ChefHat, MapPin, Clock } from "lucide-react"

export class ReportsService {
  static async getDashboardStats(establishment_id: string) {
    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString()

    // Get today's revenue
    const { data: todayOrders, error: todayError } = await supabase
      .from("orders")
      .select("total")
      .eq("establishment_id", establishment_id)
      .eq("status", "paid")
      .gte("created_at", startOfDay)

    if (todayError) throw todayError

    const todayRevenue = todayOrders?.reduce((sum, order) => sum + order.total, 0) || 0
    const todayOrdersCount = todayOrders?.length || 0

    // Get tables count
    const { count: tablesCount } = await supabase
      .from("tables")
      .select("*", { count: "exact", head: true })
      .eq("establishment_id", establishment_id)

    // Get active orders
    const { count: activeOrdersCount } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("establishment_id", establishment_id)
      .in("status", ["pending", "preparing", "ready"])

    return [
      {
        title: "Revenue Today",
        value: `$${todayRevenue.toFixed(2)}`,
        change: "+12.5%",
        icon: DollarSign,
        trend: "up" as const,
      },
      {
        title: "Orders Today",
        value: todayOrdersCount.toString(),
        change: "+8.3%",
        icon: ChefHat,
        trend: "up" as const,
      },
      {
        title: "Active Tables",
        value: tablesCount?.toString() || "0",
        change: "+5.2%",
        icon: MapPin,
        trend: "up" as const,
      },
      {
        title: "Active Orders",
        value: activeOrdersCount?.toString() || "0",
        change: "-2.1%",
        icon: Clock,
        trend: "down" as const,
      },
    ]
  }

  static async getSalesReport(establishment_id: string, period: "today" | "week" | "month"): Promise<SalesReport> {
    const dateFilter = this.getDateFilter(period)

    // Get orders for the period
    const { data: orders, error } = await supabase
      .from("orders")
      .select(`
        *,
        items:order_items(*)
      `)
      .eq("establishment_id", establishment_id)
      .eq("status", "paid")
      .gte("created_at", dateFilter)

    if (error) throw error

    const revenue = orders.reduce((sum, order) => sum + order.total, 0)
    const orderCount = orders.length
    const avgOrderValue = orderCount > 0 ? revenue / orderCount : 0

    // Calculate hourly data
    const hourlyData = this.calculateHourlyData(orders)

    // Calculate top items
    const topItems = this.calculateTopItems(orders)

    // Calculate payment methods (simplified)
    const paymentMethods = [
      { method: "Credit Card", amount: revenue * 0.6, percentage: 60 },
      { method: "Cash", amount: revenue * 0.3, percentage: 30 },
      { method: "Debit Card", amount: revenue * 0.1, percentage: 10 },
    ]

    return {
      period,
      revenue,
      orders: orderCount,
      avgOrderValue,
      growth: 0, // Would need historical data to calculate
      hourlyData,
      topItems,
      paymentMethods,
    }
  }

  static async getStaffPerformance(establishment_id: string): Promise<StaffPerformance[]> {
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select(`
        *,
        orders:orders(total, created_at, completed_at)
      `)
      .eq("establishment_id", establishment_id)
      .eq("role", "waiter")

    if (error) throw error

    return profiles.map((user) => {
      const orders = user.orders || []
      const revenue = orders.reduce((sum: number, order: any) => sum + order.total, 0)
      const avgServiceTime = this.calculateAvgServiceTime(orders)

      return {
        userId: user.id,
        name: `${user.first_name} ${user.last_name}`,
        orders: orders.length,
        revenue,
        avgServiceTime,
        rating: 4.5, // Would come from customer feedback system
      }
    })
  }

  static async getTableUtilization(establishment_id: string): Promise<TableUtilization[]> {
    const { data: tables, error } = await supabase
      .from("tables")
      .select(`
        *,
        orders:orders(total, created_at, completed_at)
      `)
      .eq("establishment_id", establishment_id)

    if (error) throw error

    return tables.map((table) => {
      const orders = table.orders || []
      const revenue = orders.reduce((sum: number, order: any) => sum + order.total, 0)
      const turns = orders.length
      const occupancyRate = Math.min(95, turns * 10) // Simplified calculation

      return {
        tableId: table.id,
        tableNumber: table.number,
        occupancyRate,
        revenue,
        turns,
      }
    })
  }

  private static getDateFilter(period: "today" | "week" | "month"): string {
    const now = new Date()

    switch (period) {
      case "today":
        return new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
      case "week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return weekAgo.toISOString()
      case "month":
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        return monthAgo.toISOString()
      default:
        return now.toISOString()
    }
  }

  private static calculateHourlyData(orders: any[]) {
    const hourlyMap = new Map()

    orders.forEach((order) => {
      const hour = new Date(order.created_at).getHours()
      const hourKey = `${hour.toString().padStart(2, "0")}:00`

      if (!hourlyMap.has(hourKey)) {
        hourlyMap.set(hourKey, { hour: hourKey, orders: 0, revenue: 0 })
      }

      const hourData = hourlyMap.get(hourKey)
      hourData.orders += 1
      hourData.revenue += order.total
    })

    return Array.from(hourlyMap.values()).sort((a, b) => a.hour.localeCompare(b.hour))
  }

  private static calculateTopItems(orders: any[]) {
    const itemMap = new Map()

    orders.forEach((order) => {
      order.items?.forEach((item: any) => {
        if (!itemMap.has(item.productId)) {
          itemMap.set(item.productId, {
            id: item.productId,
            name: item.name,
            quantity: 0,
            revenue: 0,
          })
        }

        const itemData = itemMap.get(item.productId)
        itemData.quantity += item.quantity
        itemData.revenue += item.quantity * item.price
      })
    })

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)

    return Array.from(itemMap.values())
      .map((item) => ({
        ...item,
        percentage: totalRevenue > 0 ? (item.revenue / totalRevenue) * 100 : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
  }

  private static calculateAvgServiceTime(orders: any[]): number {
    const completedOrders = orders.filter((order: any) => order.completed_at)

    if (completedOrders.length === 0) return 0

    const totalTime = completedOrders.reduce((sum: number, order: any) => {
      const start = new Date(order.created_at).getTime()
      const end = new Date(order.completed_at).getTime()
      return sum + (end - start)
    }, 0)

    return Math.round(totalTime / completedOrders.length / (1000 * 60)) // Convert to minutes
  }
}
