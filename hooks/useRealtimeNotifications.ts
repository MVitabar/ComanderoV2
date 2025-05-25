import { useState, useEffect, useCallback, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'sonner';
import { Notification } from '@/types/notifications';
import { useRouter } from 'next/navigation';

interface UseRealtimeNotificationsOptions {
  autoConnect?: boolean;
}

export function useRealtimeNotifications(options: UseRealtimeNotificationsOptions = {}) {
  const { autoConnect = true } = options;
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const channel = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const reconnectAttempts = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_INTERVAL = 5000; // 5 segundos

  // Cargar notificaciones iniciales
  const fetchInitialNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error: fetchError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (fetchError) throw fetchError;

      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.read).length || 0);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err instanceof Error ? err : new Error('Error al cargar notificaciones'));
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  // Configurar el canal de tiempo real
  const setupRealtime = useCallback(() => {
    const setupChannel = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Cancelar suscripción anterior si existe
        if (channel.current) {
          await supabase.removeChannel(channel.current);
        }

        // Crear nuevo canal
        const newChannel = supabase
          .channel('notifications')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'notifications',
              filter: `user_id=eq.${user.id}`,
            },
            (payload) => {
              const newNotification = payload.new as Notification;
              setNotifications(prev => [newNotification, ...prev]);
              if (!newNotification.read) {
                setUnreadCount(prev => prev + 1);
              }
            }
          )
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'notifications',
              filter: `user_id=eq.${user.id}`,
            },
            (payload) => {
              const updatedNotification = payload.new as Notification;
              setNotifications(prev =>
                prev.map(n =>
                  n.id === updatedNotification.id ? updatedNotification : n
                )
              );
              
              // Actualizar contador de no leídas
              if (payload.old.read !== updatedNotification.read) {
                setUnreadCount(prev => 
                  updatedNotification.read ? Math.max(0, prev - 1) : prev + 1
                );
              }
            }
          )
          .on('system' as any, { event: 'disconnect' }, () => {
            console.log('WebSocket desconectado, intentando reconectar...');
            setIsConnected(false);
            attemptReconnect();
          })
          .on('system' as any, { event: 'connected' }, () => {
            console.log('WebSocket conectado');
            setIsConnected(true);
            reconnectAttempts.current = 0; // Resetear contador de reconexión
          });

        // Suscribirse al canal
        const subscription = newChannel.subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('Suscrito a notificaciones en tiempo real');
            setIsConnected(true);
          }
        });

        channel.current = newChannel;
        return () => {
          if (channel.current) {
            supabase.removeChannel(channel.current).catch(console.error);
          }
        };
      } catch (err) {
        console.error('Error setting up realtime:', err);
        setError(err instanceof Error ? err : new Error('Error al configurar notificaciones en tiempo real'));
        attemptReconnect();
      }
    };

    if (autoConnect) {
      setupChannel();
    }
  }, [supabase, autoConnect]);

  // Intentar reconexión
  const attemptReconnect = useCallback(() => {
    if (reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) {
      console.error('Máximo número de intentos de reconexión alcanzado');
      return;
    }

    reconnectAttempts.current += 1;
    const delay = Math.min(RECONNECT_INTERVAL * reconnectAttempts.current, 30000); // Máximo 30 segundos
    
    console.log(`Intentando reconectar en ${delay}ms... (Intento ${reconnectAttempts.current}/${MAX_RECONNECT_ATTEMPTS})`);
    
    const timer = setTimeout(() => {
      setupRealtime();
    }, delay);

    return () => clearTimeout(timer);
  }, [setupRealtime]);

  // Inicializar
  useEffect(() => {
    fetchInitialNotifications();
    setupRealtime();

    // Limpiar al desmontar
    return () => {
      if (channel.current) {
        supabase.removeChannel(channel.current).catch(console.error);
      }
    };
  }, [fetchInitialNotifications, setupRealtime, supabase]);

  // Marcar notificación como leída
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId);

      if (error) throw error;

      // Actualización optimista
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read: true, read_at: new Date().toISOString() } : n
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      return true;
    } catch (err) {
      console.error('Error marking notification as read:', err);
      toast.error('No se pudo marcar la notificación como leída');
      return false;
    }
  }, [supabase, toast]);

  // Marcar todas como leídas
  const markAllAsRead = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;

      // Actualización optimista
      setNotifications(prev =>
        prev.map(n => ({
          ...n,
          read: true,
          readAt: n.readAt || new Date().toISOString(),
        }))
      );
      
      setUnreadCount(0);
      return true;
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      toast.error('No se pudieron marcar todas las notificaciones como leídas');
      return false;
    }
  }, [supabase, toast]);

  // Eliminar notificación
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      // Actualización optimista
      setNotifications(prev => {
        const notification = prev.find(n => n.id === notificationId);
        if (notification && !notification.read) {
          setUnreadCount(prevCount => Math.max(0, prevCount - 1));
        }
        return prev.filter(n => n.id !== notificationId);
      });

      return true;
    } catch (err) {
      console.error('Error deleting notification:', err);
      toast.error('No se pudo eliminar la notificación');
      return false;
    }
  }, [supabase, toast]);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    isLoading,
    error,
    isConnected,
  };
}

export default useRealtimeNotifications;
