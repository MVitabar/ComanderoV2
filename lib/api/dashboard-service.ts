import { DashboardData, DashboardFilters } from '@/types/dashboard'
import { apiClient } from './api-client'

export class DashboardService {
  private static instance: DashboardService
  private basePath = '/dashboard'

  private constructor() {}

  public static getInstance(): DashboardService {
    if (!DashboardService.instance) {
      DashboardService.instance = new DashboardService()
    }
    return DashboardService.instance
  }

  async getDashboardData(filters: Partial<DashboardFilters> = {}): Promise<DashboardData> {
    const { data, error } = await apiClient.get<DashboardData>(
      `${this.basePath}/data`,
      filters as Record<string, string>
    )

    if (error || !data) {
      throw error || new Error('Failed to fetch dashboard data')
    }

    return data
  }

  async getStats(filters: Partial<DashboardFilters> = {}): Promise<DashboardData['stats']> {
    const { data, error } = await apiClient.get<{ stats: DashboardData['stats'] }>(
      `${this.basePath}/stats`,
      filters as Record<string, string>
    )

    if (error || !data) {
      throw error || new Error('Failed to fetch dashboard stats')
    }

    return data.stats
  }

  async getRecentOrders(limit: number = 5): Promise<DashboardData['recentOrders']> {
    const { data, error } = await apiClient.get<{ orders: DashboardData['recentOrders'] }>(
      `${this.basePath}/recent-orders`,
      { limit: limit.toString() }
    )

    if (error || !data) {
      throw error || new Error('Failed to fetch recent orders')
    }

    return data.orders
  }

  async getLowStockItems(threshold: number = 10): Promise<DashboardData['lowStockItems']> {
    const { data, error } = await apiClient.get<{ items: DashboardData['lowStockItems'] }>(
      `${this.basePath}/low-stock-items`,
      { threshold: threshold.toString() }
    )

    if (error || !data) {
      throw error || new Error('Failed to fetch low stock items')
    }

    return data.items
  }

  async getTopSellingItems(limit: number = 5): Promise<DashboardData['topSellingItems']> {
    const { data, error } = await apiClient.get<{ items: DashboardData['topSellingItems'] }>(
      `${this.basePath}/top-selling-items`,
      { limit: limit.toString() }
    )

    if (error || !data) {
      throw error || new Error('Failed to fetch top selling items')
    }

    return data.items
  }

  async getRevenueData(filters: Partial<DashboardFilters> = {}): Promise<DashboardData['revenueData']> {
    const { data, error } = await apiClient.get<{ data: DashboardData['revenueData'] }>(
      `${this.basePath}/revenue`,
      filters as Record<string, string>
    )

    if (error || !data) {
      throw error || new Error('Failed to fetch revenue data')
    }

    return data.data
  }
}

export const dashboardService = DashboardService.getInstance()
