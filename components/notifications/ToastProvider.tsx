'use client';

import { Toaster } from 'sonner';
import { useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

// Cargar SimpleToast dinámicamente sin SSR
const SimpleToast = () => {
  useEffect(() => {
    // Suscribirse a cambios en la base de datos en tiempo real
    const channel = supabase
      .channel('realtime_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
        },
        (payload: { new: { id: string; title: string; message: string; type?: "success" | "error" | "info" | "warning"; }; }) => {
          const notification = payload.new as {
            id: string;
            title: string;
            message: string;
            type?: 'success' | 'error' | 'info' | 'warning';
          };
          
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
      supabase.removeChannel(channel);
    };
  }, []);

  return null;
};

interface ToastProviderProps {
  children: ReactNode;
}

export default function ToastProvider({ children }: ToastProviderProps) {
  return (
    <>
      <Toaster position="top-right" richColors />
      <SimpleToast />
      {children}
    </>
  );
}
