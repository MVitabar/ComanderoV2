'use client';

import { useEffect } from 'react';
import { toast, Toaster } from 'sonner';
import { supabase } from '@/lib/supabase/client';

type ToastNotification = {
  id: string;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
};

type RealtimePayload<T = any> = {
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  schema: string;
  table: string;
  commit_timestamp: string;
  errors: string[] | null;
  new: T;
  old: T | null;
};

export function SimpleToast() {
  // Verificar que las variables de entorno estén disponibles
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    return null;
  }

  useEffect(() => {
    // Suscribirse a cambios en la base de datos en tiempo real
    const channel = supabase
      .channel('realtime_notifications')
      .on<RealtimePayload<ToastNotification>>(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
        },
        (payload: { new: any; }) => {
          const notification = payload.new;
          
          // Usar el método de toast correspondiente según el tipo
          const toastOptions = {
            description: notification.message,
            duration: 5000,
          };
          
          switch(notification.type) {
            case 'success':
              toast.success(notification.title, toastOptions);
              break;
            case 'error':
              toast.error(notification.title, toastOptions);
              break;
            case 'warning':
              toast.warning(notification.title, toastOptions);
              break;
            case 'info':
            default:
              toast(notification.title, toastOptions);
          }
        }
      )
      .subscribe();

    return () => {
      // Limpiar la suscripción al desmontar el componente
      channel.unsubscribe();
    };
  }, []);

  return <Toaster position="top-right" richColors />;
}

export default SimpleToast;
