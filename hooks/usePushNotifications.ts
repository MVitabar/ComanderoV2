import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';

type PushPermissionStatus = 'default' | 'granted' | 'denied' | 'unsupported';

interface UsePushNotificationsReturn {
  isSupported: boolean;
  permission: PushPermissionStatus;
  isSubscribed: boolean;
  isLoading: boolean;
  error: Error | null;
  requestPermission: () => Promise<boolean>;
  subscribe: () => Promise<boolean>;
  unsubscribe: () => Promise<boolean>;
  getSubscription: () => Promise<PushSubscription | null>;
}

/**
 * Custom hook to handle push notifications in the browser
 */
export function usePushNotifications(): UsePushNotificationsReturn {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [permission, setPermission] = useState<PushPermissionStatus>('default');
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [publicKey, setPublicKey] = useState<string>('');

  // Check if push notifications are supported
  useEffect(() => {
    const isPushSupported = 'serviceWorker' in navigator && 'PushManager' in window;
    setIsSupported(isPushSupported);

    if (!isPushSupported) {
      setError(new Error('Push notifications are not supported in this browser'));
      return;
    }

    // Get the VAPID public key from environment variables
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidPublicKey) {
      setError(new Error('VAPID public key is not configured'));
      return;
    }
    setPublicKey(vapidPublicKey);

    // Check current permission status
    const checkPermission = () => {
      if (!navigator.permissions) {
        setPermission('unsupported');
        return;
      }

      navigator.permissions.query({ name: 'notifications' as PermissionName }).then((permissionStatus) => {
        updatePermissionStatus(permissionStatus.state as PushPermissionStatus);
        
        permissionStatus.onchange = () => {
          updatePermissionStatus(permissionStatus.state as PushPermissionStatus);
        };
      });
    };

    const updatePermissionStatus = (status: PushPermissionStatus) => {
      setPermission(status);
      
      // If permission is granted, check subscription status
      if (status === 'granted') {
        checkSubscription();
      } else {
        setIsSubscribed(false);
      }
    };

    // Register service worker
    const registerServiceWorker = async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js');
        setRegistration(reg);
        checkPermission();
      } catch (err) {
        console.error('Service Worker registration failed:', err);
        setError(err instanceof Error ? err : new Error('Failed to register service worker'));
      }
    };

    // Check if service workers are supported and register
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg);
        checkPermission();
      }).catch((err) => {
        console.error('Service Worker ready check failed:', err);
        registerServiceWorker();
      });
    }

    // Cleanup
    return () => {
      // Cleanup any event listeners if needed
    };
  }, []);

  // Check if user is already subscribed
  const checkSubscription = useCallback(async (): Promise<boolean> => {
    if (!registration) return false;
    
    try {
      const subscription = await registration.pushManager.getSubscription();
      const isSub = !!subscription;
      setIsSubscribed(isSub);
      return isSub;
    } catch (err) {
      console.error('Error checking subscription:', err);
      setError(err instanceof Error ? err : new Error('Failed to check subscription status'));
      return false;
    }
  }, [registration]);

  // Request permission for notifications
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (permission === 'granted') return true;
    if (permission === 'denied') return false;
    
    try {
      setIsLoading(true);
      const permissionResult = await Notification.requestPermission();
      const isGranted = permissionResult === 'granted';
      setPermission(isGranted ? 'granted' : 'denied');
      return isGranted;
    } catch (err) {
      console.error('Error requesting notification permission:', err);
      setError(err instanceof Error ? err : new Error('Failed to request notification permission'));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [permission]);

  // Subscribe to push notifications
  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!isSupported || !registration || !publicKey) {
      setError(new Error('Push notifications are not supported or not properly configured'));
      return false;
    }

    try {
      setIsLoading(true);
      
      // Check if already subscribed
      let subscription = await registration.pushManager.getSubscription();
      
      if (!subscription) {
        // Request permission if not granted
        if (permission !== 'granted') {
          const permissionGranted = await requestPermission();
          if (!permissionGranted) return false;
        }
        
        // Subscribe to push notifications
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey)
        });
      }
      
      // Send subscription to server
      const { error } = await supabase
        .from('push_subscriptions')
        .upsert({
          endpoint: subscription.endpoint,
          p256dh: arrayBufferToBase64(subscription.getKey('p256dh')!),
          auth: arrayBufferToBase64(subscription.getKey('auth')!),
          user_agent: navigator.userAgent,
          device_info: {
            platform: navigator.platform,
            user_agent: navigator.userAgent,
          },
          is_active: true,
          last_active: new Date().toISOString(),
        });
      
      if (error) throw error;
      
      setIsSubscribed(true);
      return true;
    } catch (err) {
      console.error('Error subscribing to push notifications:', err);
      setError(err instanceof Error ? err : new Error('Failed to subscribe to push notifications'));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, permission, publicKey, registration, requestPermission, supabase]);

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!registration) return false;
    
    try {
      setIsLoading(true);
      
      const subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        setIsSubscribed(false);
        return true;
      }
      
      // Unsubscribe from push notifications
      const success = await subscription.unsubscribe();
      if (!success) {
        throw new Error('Failed to unsubscribe from push notifications');
      }
      
      // Remove subscription from server
      const { error } = await supabase
        .from('push_subscriptions')
        .delete()
        .eq('endpoint', subscription.endpoint);
      
      if (error) throw error;
      
      setIsSubscribed(false);
      return true;
    } catch (err) {
      console.error('Error unsubscribing from push notifications:', err);
      setError(err instanceof Error ? err : new Error('Failed to unsubscribe from push notifications'));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [registration, supabase]);

  // Get current subscription
  const getSubscription = useCallback(async (): Promise<PushSubscription | null> => {
    if (!registration) return null;
    return registration.pushManager.getSubscription();
  }, [registration]);

  return {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    error,
    requestPermission,
    subscribe,
    unsubscribe,
    getSubscription,
  };
}

// Helper function to convert base64 to Uint8Array
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
}

// Helper function to convert ArrayBuffer to base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  
  return btoa(binary);
}
