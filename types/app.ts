export type AppTheme = 'light' | 'dark' | 'system'

export interface AppSettings {
  id: string
  userId: string
  theme: AppTheme
  language: string
  currency: string
  timezone: string
  dateFormat: string
  timeFormat: string
  notifications: {
    email: boolean
    push: boolean
    sound: boolean
  }
  createdAt: string
  updatedAt: string
}

export interface MenuItem {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
  roles?: string[]
  children?: MenuItem[]
}

export interface BreadcrumbItem {
  title: string
  href: string
  isCurrent?: boolean
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  createdAt: string
  url?: string
}
