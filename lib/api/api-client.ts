import { Database } from '@/types/database'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

interface ApiResponse<T> {
  data: T | null
  error: Error | null
  status: number
}

export class ApiClient {
  private supabase = createClientComponentClient<Database>()
  private baseUrl: string

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    method: HttpMethod = 'GET',
    body?: any,
    customHeaders: Record<string, string> = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...customHeaders,
    }

    try {
      const { data: { session } } = await this.supabase.auth.getSession()
      
      const response = await fetch(url, {
        method,
        headers: {
          ...headers,
          ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
      })

      let responseData: T | null = null
      const contentType = response.headers.get('content-type')
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json()
      } else if (response.status !== 204) {
        responseData = (await response.text()) as any
      }

      if (!response.ok) {
        throw new Error(
          responseData && typeof responseData === 'object' && 'message' in responseData
            ? (responseData as any).message
            : `HTTP error! status: ${response.status}`
        )
      }

      return {
        data: responseData,
        error: null,
        status: response.status,
      }
    } catch (error) {
      console.error(`API Error [${method} ${endpoint}]:`, error)
      return {
        data: null,
        error: error instanceof Error ? error : new Error('An unknown error occurred'),
        status: 500,
      }
    }
  }

  public async get<T>(endpoint: string, params?: Record<string, string | number>) {
    const query = params ? `?${new URLSearchParams(params as Record<string, string>)}` : ''
    return this.request<T>(`${endpoint}${query}`, 'GET')
  }

  public async post<T>(endpoint: string, data: any) {
    return this.request<T>(endpoint, 'POST', data)
  }

  public async put<T>(endpoint: string, data: any) {
    return this.request<T>(endpoint, 'PUT', data)
  }

  public async delete<T>(endpoint: string) {
    return this.request<T>(endpoint, 'DELETE')
  }

  public async patch<T>(endpoint: string, data: any) {
    return this.request<T>(endpoint, 'PATCH', data)
  }
}

export const apiClient = new ApiClient()
