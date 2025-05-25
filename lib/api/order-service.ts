import { Order, OrderItem, OrderStatus, OrderWithDetails } from '@/types/order'
import { apiClient } from './api-client'

type OrderFilters = {
  status?: OrderStatus
  tableId?: string
  waiterId?: string
  startDate?: string
  endDate?: string
  search?: string
  sortBy?: 'createdAt' | 'updatedAt' | 'total' | 'status'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

type OrderItemRequest = {
  productId: string
  quantity: number
  notes?: string
  modifications?: string[]
}

type CreateOrderRequest = {
  tableId: string
  waiterId: string
  items: OrderItemRequest[]
  notes?: string
}

type UpdateOrderRequest = {
  status?: OrderStatus
  items?: OrderItemRequest[]
  notes?: string
  estimatedTime?: number
}

export class OrderService {
  private static instance: OrderService
  private basePath = '/orders'

  private constructor() {}

  public static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService()
    }
    return OrderService.instance
  }

  async getOrders(filters: OrderFilters = {}): Promise<{ orders: OrderWithDetails[]; total: number }> {
    const { data, error } = await apiClient.get<{ orders: OrderWithDetails[]; total: number }>(
      this.basePath,
      filters as Record<string, string>
    )

    if (error || !data) {
      throw error || new Error('Failed to fetch orders')
    }

    return data
  }

  async getOrderById(id: string): Promise<OrderWithDetails> {
    const { data, error } = await apiClient.get<OrderWithDetails>(`${this.basePath}/${id}`)

    if (error || !data) {
      throw error || new Error(`Failed to fetch order with id: ${id}`)
    }

    return data
  }

  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    const { data, error } = await apiClient.post<Order>(this.basePath, orderData)

    if (error || !data) {
      throw error || new Error('Failed to create order')
    }

    return data
  }

  async updateOrder(id: string, updates: UpdateOrderRequest): Promise<Order> {
    const { data, error } = await apiClient.put<Order>(`${this.basePath}/${id}`, updates)

    if (error || !data) {
      throw error || new Error(`Failed to update order with id: ${id}`)
    }

    return data
  }

  async deleteOrder(id: string): Promise<void> {
    const { error } = await apiClient.delete(`${this.basePath}/${id}`)

    if (error) {
      throw error
    }
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    const { data, error } = await apiClient.patch<Order>(
      `${this.basePath}/${id}/status`,
      { status }
    )

    if (error || !data) {
      throw error || new Error(`Failed to update order status for order: ${id}`)
    }

    return data
  }

  async addOrderItem(orderId: string, item: OrderItemRequest): Promise<OrderItem> {
    const { data, error } = await apiClient.post<OrderItem>(
      `${this.basePath}/${orderId}/items`,
      item
    )

    if (error || !data) {
      throw error || new Error(`Failed to add item to order: ${orderId}`)
    }

    return data
  }

  async updateOrderItem(orderId: string, itemId: string, updates: Partial<OrderItemRequest>): Promise<OrderItem> {
    const { data, error } = await apiClient.put<OrderItem>(
      `${this.basePath}/${orderId}/items/${itemId}`,
      updates
    )

    if (error || !data) {
      throw error || new Error(`Failed to update item ${itemId} in order ${orderId}`)
    }

    return data
  }

  async removeOrderItem(orderId: string, itemId: string): Promise<void> {
    const { error } = await apiClient.delete(`${this.basePath}/${orderId}/items/${itemId}`)


    if (error) {
      throw error
    }
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    const { data, error } = await apiClient.get<{ items: OrderItem[] }>(
      `${this.basePath}/${orderId}/items`
    )

    if (error || !data) {
      throw error || new Error(`Failed to fetch items for order: ${orderId}`)
    }

    return data.items
  }

  async getOrderItem(orderId: string, itemId: string): Promise<OrderItem> {
    const { data, error } = await apiClient.get<OrderItem>(
      `${this.basePath}/${orderId}/items/${itemId}`
    )

    if (error || !data) {
      throw error || new Error(`Failed to fetch item ${itemId} from order ${orderId}`)
    }

    return data
  }
}

export const orderService = OrderService.getInstance()
