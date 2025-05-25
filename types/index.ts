// Auth
export * from './auth';

// App
export * from './app';

// Database
export * from './database';

// Models
export * from './establishment';
export * from './inventory';
export * from './order';
// Exportar tipos específicos de reports
export type { 
  SalesReport, 
  HourlySales, 
  TopSellingItem, 
  PaymentMethodData,
  TableUtilization
} from './reports';
export * from './table';

// Features
export * from './dashboard';
export * from './integration';

// Notifications - Exportar tipos específicos para evitar conflictos
export type {
  Notification as AppNotification,
  NotificationType as NotificationKind,
  NotificationSettings as NotificationPreferences,
  NotificationData,
  NotificationChannel,
  NotificationPreference,
  NotificationsResponse,
  MarkAsReadResponse,
  DeleteNotificationResponse,
  NotificationCounts,
  WebSocketMessage,
  NotificationFilterOptions,
  NotificationStats
} from './notifications';

// Tipos compartidos - Creamos el archivo shared.ts si no existe
// export * from './shared'; // Comentado hasta que se cree el archivo
