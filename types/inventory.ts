export interface InventoryItem {
  id: string
  name: string
  category: string
  currentStock: number
  minimumStock: number
  unit: string
  cost: number
  supplier: string
  establishmentId: string
  status: InventoryStatus
  lastUpdated: string
  createdAt: string
}

export type InventoryStatus = "good" | "medium" | "low" | "out"

export interface InventoryCategory {
  id: string
  name: string
  description?: string
  establishmentId: string
}

export interface Supplier {
  id: string
  name: string
  contact: string
  email?: string
  phone?: string
  address?: string
  establishmentId: string
}

export interface StockMovement {
  id: string
  itemId: string
  type: "in" | "out" | "adjustment"
  quantity: number
  reason: string
  userId: string
  createdAt: string
}
