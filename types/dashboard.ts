import { OrderStatus } from './order'

export interface DashboardStats {
  title: string
  value: string
  change: string
  icon: React.ComponentType<{ className?: string }>
  trend: 'up' | 'down' | 'neutral'
}

export interface RecentOrder {
  id: string
  table: string
  items: number
  total: string
  status: OrderStatus
  time: string
}

export interface LowStockItem {
  name: string
  current: number
  minimum: number
  unit: string
}

export interface DashboardData {
  stats: DashboardStats[]
  recentOrders: RecentOrder[]
  lowStockItems: LowStockItem[]
  topSellingItems: TopSellingItem[]
  revenueData: RevenueData[]
}

export interface TopSellingItem {
  name: string
  sales: number
  revenue: number
}

export interface RevenueData {
  date: string
  revenue: number
  orders: number
  averageOrderValue: number
}

export interface DashboardFilters {
  dateRange: 'today' | 'yesterday' | 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth' | 'custom'
  startDate?: string
  endDate?: string
  establishmentId?: string
}
