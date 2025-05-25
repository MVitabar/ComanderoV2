import { InventoryItem, InventoryCategory, Supplier, StockMovement, InventoryStatus } from '@/types/inventory'
import { apiClient } from './api-client'

type InventoryFilters = {
  category?: string
  status?: InventoryStatus
  search?: string
  minStock?: number
  maxStock?: number
  supplierId?: string
  sortBy?: 'name' | 'currentStock' | 'lastUpdated'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

type StockMovementFilters = {
  itemId?: string
  type?: 'in' | 'out' | 'adjustment'
  startDate?: string
  endDate?: string
  userId?: string
  sortBy?: 'createdAt' | 'quantity'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export class InventoryService {
  private static instance: InventoryService
  private basePath = '/inventory'

  private constructor() {}

  public static getInstance(): InventoryService {
    if (!InventoryService.instance) {
      InventoryService.instance = new InventoryService()
    }
    return InventoryService.instance
  }

  // Inventory Items
  async getItems(filters: InventoryFilters = {}): Promise<{ items: InventoryItem[]; total: number }> {
    const { data, error } = await apiClient.get<{ items: InventoryItem[]; total: number }>(
      `${this.basePath}/items`,
      filters as Record<string, string>
    )

    if (error || !data) {
      throw error || new Error('Failed to fetch inventory items')
    }

    return data
  }

  async getItemById(id: string): Promise<InventoryItem> {
    const { data, error } = await apiClient.get<InventoryItem>(`${this.basePath}/items/${id}`)

    if (error || !data) {
      throw error || new Error(`Failed to fetch inventory item with id: ${id}`)
    }

    return data
  }

  async createItem(item: Omit<InventoryItem, 'id' | 'status' | 'createdAt' | 'lastUpdated'>): Promise<InventoryItem> {
    const { data, error } = await apiClient.post<InventoryItem>(`${this.basePath}/items`, item)

    if (error || !data) {
      throw error || new Error('Failed to create inventory item')
    }

    return data
  }

  async updateItem(id: string, updates: Partial<Omit<InventoryItem, 'id' | 'status' | 'createdAt' | 'lastUpdated'>>): Promise<InventoryItem> {
    const { data, error } = await apiClient.put<InventoryItem>(`${this.basePath}/items/${id}`, updates)

    if (error || !data) {
      throw error || new Error(`Failed to update inventory item with id: ${id}`)
    }

    return data
  }

  async deleteItem(id: string): Promise<void> {
    const { error } = await apiClient.delete(`${this.basePath}/items/${id}`)

    if (error) {
      throw error
    }
  }

  async updateStock(itemId: string, quantity: number, reason: string, type: 'in' | 'out' | 'adjustment' = 'adjustment'): Promise<InventoryItem> {
    const { data, error } = await apiClient.post<InventoryItem>(
      `${this.basePath}/items/${itemId}/stock`,
      { quantity, reason, type }
    )

    if (error || !data) {
      throw error || new Error('Failed to update stock')
    }

    return data
  }

  // Categories
  async getCategories(): Promise<InventoryCategory[]> {
    const { data, error } = await apiClient.get<{ categories: InventoryCategory[] }>(
      `${this.basePath}/categories`
    )

    if (error || !data) {
      throw error || new Error('Failed to fetch categories')
    }

    return data.categories
  }

  // Suppliers
  async getSuppliers(): Promise<Supplier[]> {
    const { data, error } = await apiClient.get<{ suppliers: Supplier[] }>(
      `${this.basePath}/suppliers`
    )

    if (error || !data) {
      throw error || new Error('Failed to fetch suppliers')
    }

    return data.suppliers
  }

  // Stock Movements
  async getStockMovements(filters: StockMovementFilters = {}): Promise<{ movements: StockMovement[]; total: number }> {
    const { data, error } = await apiClient.get<{ movements: StockMovement[]; total: number }>(
      `${this.basePath}/movements`,
      filters as Record<string, string>
    )

    if (error || !data) {
      throw error || new Error('Failed to fetch stock movements')
    }

    return data
  }

  // Reports
  async getLowStockReport(threshold: number = 10): Promise<{ items: InventoryItem[] }> {
    const { data, error } = await apiClient.get<{ items: InventoryItem[] }>(
      `${this.basePath}/reports/low-stock`,
      { threshold: threshold.toString() }
    )

    if (error || !data) {
      throw error || new Error('Failed to fetch low stock report')
    }

    return data
  }
}

export const inventoryService = InventoryService.getInstance()
