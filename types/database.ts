import type {
  Establishment,
  User,
  Table,
  Order,
  OrderItem,
  InventoryItem,
  InventoryCategory,
  Supplier,
  StockMovement,
} from "@/types/models"

export interface Database {
  public: {
    Tables: {
      establishments: {
        Row: Establishment
        Insert: Omit<Establishment, "id" | "createdAt" | "updatedAt">
        Update: Partial<Omit<Establishment, "id" | "createdAt" | "updatedAt">>
      }
      users: {
        Row: User
        Insert: Omit<User, "id" | "createdAt" | "updatedAt">
        Update: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>
      }
      tables: {
        Row: Table
        Insert: Omit<Table, "id" | "createdAt" | "updatedAt">
        Update: Partial<Omit<Table, "id" | "createdAt" | "updatedAt">>
      }
      orders: {
        Row: Order
        Insert: Omit<Order, "id" | "createdAt" | "updatedAt">
        Update: Partial<Omit<Order, "id" | "createdAt" | "updatedAt">>
      }
      order_items: {
        Row: OrderItem
        Insert: Omit<OrderItem, "id">
        Update: Partial<Omit<OrderItem, "id">>
      }
      inventory_items: {
        Row: InventoryItem
        Insert: Omit<InventoryItem, "id" | "createdAt" | "lastUpdated">
        Update: Partial<Omit<InventoryItem, "id" | "createdAt" | "lastUpdated">>
      }
      inventory_categories: {
        Row: InventoryCategory
        Insert: Omit<InventoryCategory, "id">
        Update: Partial<Omit<InventoryCategory, "id">>
      }
      suppliers: {
        Row: Supplier
        Insert: Omit<Supplier, "id">
        Update: Partial<Omit<Supplier, "id">>
      }
      stock_movements: {
        Row: StockMovement
        Insert: Omit<StockMovement, "id" | "createdAt">
        Update: Partial<Omit<StockMovement, "id" | "createdAt">>
      }
    }
  }
}
