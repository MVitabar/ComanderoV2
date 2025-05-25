export type NotificationType = 
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'order'
  | 'reservation'
  | 'payment'
  | 'promotion';

export type NotificationChannel = 'email' | 'push' | 'in_app';

export interface NotificationData {
  [key: string]: any;
  orderId?: string;
  reservationId?: string;
  paymentId?: string;
  promotionId?: string;
  redirectUrl?: string;
  imageUrl?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  readAt?: string | null;
  createdAt: string;
  updatedAt?: string;
  data?: NotificationData;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  expiresAt?: string | null;
  actions?: {
    label: string;
    url: string;
    method?: string;
    dismiss?: boolean;
  }[];
}

export interface NotificationPreference {
  email: boolean;
  push: boolean;
  inApp: boolean;
  enabled: boolean;
}

export interface NotificationSettings {
  [key: string]: {
    label: string;
    description: string;
    enabled: boolean;
    preferences: {
      email: boolean;
      push: boolean;
      inApp: boolean;
    };
  };
}

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
  hasMore: boolean;
  nextCursor?: string | null;
}

export interface MarkAsReadResponse {
  success: boolean;
  notification: Notification;
}

export interface DeleteNotificationResponse {
  success: boolean;
  message: string;
}

export interface NotificationCounts {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
  byCategory: Record<string, number>;
}

export interface WebSocketMessage {
  type: 'NEW_NOTIFICATION' | 'NOTIFICATION_READ' | 'NOTIFICATION_DELETED' | 'PING' | 'PONG';
  data: any;
  timestamp: string;
}

export interface NotificationFilterOptions {
  // Filtros básicos
  read?: boolean;
  type?: NotificationType | NotificationType[];
  category?: string | string[];
  priority?: 'low' | 'medium' | 'high';
  
  // Filtros por fecha
  startDate?: string;
  endDate?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  
  // Búsqueda
  search?: string;
  
  // Ordenación
  sortBy?: 'createdAt' | 'readAt' | 'priority' | 'type' | 'category';
  sortOrder?: 'asc' | 'desc';
  
  // Paginación
  page?: number;
  limit?: number;
  
  // Filtros adicionales
  userId?: string;
  channel?: NotificationChannel | NotificationChannel[];
  
  // Filtros personalizados
  customFilters?: Record<string, any>;
}

export interface NotificationStats {
  total: number;
  read: number;
  unread: number;
  types: Record<NotificationType, number>;
  categories: Record<string, number>;
  lastUpdated: string;
}
