export interface SalesReport {
  period: string
  revenue: number
  orders: number
  avgOrderValue: number
  growth: number
  hourlyData: HourlySales[]
  topItems: TopSellingItem[]
  paymentMethods: PaymentMethodData[]
}

export interface HourlySales {
  hour: string
  orders: number
  revenue: number
}

export interface TopSellingItem {
  id: string
  name: string
  quantity: number
  revenue: number
  percentage: number
}

export interface PaymentMethodData {
  method: string
  amount: number
  percentage: number
}

export interface StaffPerformance {
  userId: string
  name: string
  orders: number
  revenue: number
  avgServiceTime: number
  rating: number
}

export interface TableUtilization {
  tableId: string
  tableNumber: number
  occupancyRate: number
  revenue: number
  turns: number
}
