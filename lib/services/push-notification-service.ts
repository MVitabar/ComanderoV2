import { supabase } from '@/lib/supabase/client';
import { Database } from '@/types/database';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

if (!VAPID_PUBLIC_KEY) {
  throw new Error('Missing NEXT_PUBLIC_VAPID_PUBLIC_KEY environment variable');
}

type SendPushNotificationOptions = {
  title: string;
  body: string;
  data?: Record<string, any>;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  renotify?: boolean;
  requireInteraction?: boolean;
  silent?: boolean;
  timestamp?: number;
  vibrate?: number[];
  actions?: {
    action: string;
    title: string;
    icon?: string;
  }[];
};

type PushSubscription = {
  id: string;
  user_id: string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  expiration_time: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

class PushNotificationService {
  private supabase = supabase;

  /**
   * Send a push notification to a specific user
   */
  async sendToUser(userId: string, options: SendPushNotificationOptions) {
    const { data: subscriptions, error } = await this.supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching push subscriptions:', error);
      return [];
    }

    return this.sendToSubscriptions(subscriptions as PushSubscription[], options);
  }

  /**
   * Send a push notification to users with a specific role
   */
  async sendToRole(role: string, options: SendPushNotificationOptions) {
    const { data: users, error: usersError } = await this.supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', role);

    if (usersError || !users?.length) {
      console.error('Error fetching users by role:', usersError);
      return [];
    }

    const userIds = users.map((u: { user_id: string }) => u.user_id);
    return this.sendToUsers(userIds, options);
  }

  /**
   * Send a push notification to multiple users
   */
  async sendToUsers(userIds: string[], options: SendPushNotificationOptions) {
    const { data: subscriptions, error } = await this.supabase
      .from('push_subscriptions')
      .select('*')
      .in('user_id', userIds)
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching push subscriptions:', error);
      return [];
    }

    return this.sendToSubscriptions(subscriptions as PushSubscription[], options);
  }

  /**
   * Send a push notification to all active subscriptions
   */
  async broadcast(options: SendPushNotificationOptions) {
    const { data: subscriptions, error } = await this.supabase
      .from('push_subscriptions')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching push subscriptions:', error);
      return [];
    }

    return this.sendToSubscriptions(subscriptions as PushSubscription[], options);
  }

  /**
   * Send a push notification to specific subscriptions
   */
  private async sendToSubscriptions(
    subscriptions: PushSubscription[],
    options: SendPushNotificationOptions
  ) {
    if (!subscriptions.length) return [];

    const results = await Promise.allSettled(
      subscriptions.map(subscription => 
        this.sendPushNotification(subscription, options)
      )
    );

    return results.map((result, index) => ({
      subscription: subscriptions[index],
      success: result.status === 'fulfilled',
      error: result.status === 'rejected' ? result.reason : undefined
    }));
  }

  /**
   * Send a single push notification
   */
  private async sendPushNotification(
    subscription: PushSubscription,
    { title, body, data, ...options }: SendPushNotificationOptions
  ) {
    try {
      const response = await fetch('/api/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription,
          payload: {
            title,
            body,
            data,
            ...options,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending push notification:', error);
      throw error;
    }
  }
}

export const pushNotificationService = new PushNotificationService();
