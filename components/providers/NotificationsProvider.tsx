'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useToast } from '@/components/ui/use-toast';
import { Notification, NotificationFilterOptions } from '@/types/notifications';

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  isUpdating: boolean;
  error: Error | null;
  fetchNotifications: (filters?: Partial<NotificationFilterOptions>) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClientComponentClient();
  const [session, setSession] = useState<any>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Obtener la sesión al montar el componente
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };
    getSession();
  }, [supabase.auth]);

  const fetchNotifications = useCallback(async (filters: Partial<NotificationFilterOptions> = {}) => {
    if (!session?.user?.id) return;
    
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', session.user.id);

      // Aplicar filtros
      if (filters.read !== undefined) {
        query = query.eq('read', filters.read);
      }
      if (filters.type) {
        if (Array.isArray(filters.type)) {
          query = query.in('type', filters.type);
        } else {
          query = query.eq('type', filters.type);
        }
      }

      const { data, error: fetchError } = await query.order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setNotifications(data || []);
      setUnreadCount(data?.filter((n: Notification) => !n.read).length || 0);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err instanceof Error ? err : new Error('Error al cargar notificaciones'));
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las notificaciones',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [session, supabase, toast]);

  const markAsRead = useCallback(async (id: string) => {
    if (!session?.user?.id) return;
    
    setIsUpdating(true);
    
    try {
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('id', id);

      if (updateError) throw updateError;

      setNotifications(prev =>
        prev.map(n =>
          n.id === id ? { ...n, read: true, read_at: new Date().toISOString() } : n
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
      toast({
        title: 'Error',
        description: 'No se pudo marcar la notificación como leída',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  }, [session, supabase, toast]);

  const markAllAsRead = useCallback(async () => {
    if (!session?.user?.id) return;
    
    setIsUpdating(true);
    
    try {
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('user_id', session.user.id)
        .eq('read', false);

      if (updateError) throw updateError;

      setNotifications(prev =>
        prev.map(n => ({
          ...n,
          read: true,
          readAt: n.readAt || new Date().toISOString(),
        }))
      );
      
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      toast({
        title: 'Error',
        description: 'No se pudieron marcar todas las notificaciones como leídas',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  }, [session, supabase, toast]);

  const deleteNotification = useCallback(async (id: string) => {
    if (!session?.user?.id) return;
    
    setIsUpdating(true);
    
    try {
      const { error: deleteError } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setNotifications(prev => prev.filter(n => n.id !== id));
      setUnreadCount(prev => {
        const notification = notifications.find(n => n.id === id);
        return notification && !notification.read ? Math.max(0, prev - 1) : prev;
      });
      
      // No retornamos nada (void)
    } catch (err) {
      console.error('Error deleting notification:', err);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la notificación',
        variant: 'destructive',
      });
      // No relanzamos el error, solo lo manejamos con el toast
    } finally {
      setIsUpdating(false);
    }
  }, [session, supabase, toast, notifications]);

  const refreshNotifications = useCallback(async () => {
    await fetchNotifications();
  }, [fetchNotifications]);

  // Cargar notificaciones al montar o cuando cambia la sesión
  useEffect(() => {
    if (session?.user?.id) {
      fetchNotifications();
    }
  }, [session, fetchNotifications]);

  const value = {
    notifications,
    unreadCount,
    isLoading,
    isUpdating,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications debe usarse dentro de un NotificationsProvider');
  }
  return context;
}
