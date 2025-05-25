export interface Order {
  id: string
  tableId: string
  establishmentId: string
  waiterId: string
  status: OrderStatus
  items: OrderItem[]
  subtotal: number
  tax: number
  total: number
  notes?: string
  estimatedTime?: number
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export type OrderStatus = "pending" | "preparing" | "ready" | "served" | "paid" | "cancelled"

export interface OrderItem {
  id: string
  productId: string
  name: string
  quantity: number
  price: number
  notes?: string
  modifications?: string[]
}

export interface OrderWithDetails extends Order {
  table: {
    number: number
  }
  waiter: {
    firstName: string
    lastName: string
  }
}
