import type { Order } from "./order" // Assuming Order is defined in another file, e.g., order.ts

export interface Table {
  id: string
  number: number
  capacity: number
  status: TableStatus
  establishmentId: string
  position: TablePosition
  waiterId?: string
  currentOrders: string[]
  createdAt: string
  updatedAt: string
}

export type TableStatus = "available" | "occupied" | "reserved" | "cleaning"

export interface TablePosition {
  x: number
  y: number
}

export interface TableWithDetails extends Table {
  waiter?: {
    id: string
    firstName: string
    lastName: string
  }
  orders: Order[]
}
