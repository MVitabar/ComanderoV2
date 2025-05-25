import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/database';

type PushSubscriptionData = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  device_info?: {
    user_agent?: string;
    platform?: string;
    app_version?: string;
  };
};

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const subscriptionData: PushSubscriptionData = await request.json();

    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const establishmentId = session.user.user_metadata.establishment_id;

    // Validate subscription data
    if (!subscriptionData.endpoint || !subscriptionData.keys?.p256dh || !subscriptionData.keys?.auth) {
      return NextResponse.json(
        { error: 'Invalid subscription data' },
        { status: 400 }
      );
    }

    // Check if subscription already exists
    const { data: existingSubscription, error: fetchError } = await supabase
      .from('push_subscriptions')
      .select('id')
      .eq('endpoint', subscriptionData.endpoint)
      .eq('user_id', userId)
      .maybeSingle();

    const subscription = {
      user_id: userId,
      establishment_id: establishmentId,
      endpoint: subscriptionData.endpoint,
      p256dh: subscriptionData.keys.p256dh,
      auth: subscriptionData.keys.auth,
      user_agent: subscriptionData.device_info?.user_agent,
      platform: subscriptionData.device_info?.platform,
      app_version: subscriptionData.device_info?.app_version,
      last_active: new Date().toISOString(),
      is_active: true,
    };

    // Update or insert the subscription
    let result;
    if (existingSubscription) {
      const { data, error } = await supabase
        .from('push_subscriptions')
        .update(subscription)
        .eq('id', existingSubscription.id)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await supabase
        .from('push_subscriptions')
        .insert([subscription])
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    }

    return NextResponse.json({
      success: true,
      id: result.id,
      endpoint: result.endpoint,
    });
  } catch (error) {
    console.error('Error registering push subscription:', error);
    return NextResponse.json(
      { error: 'Failed to register push subscription' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const { endpoint } = await request.json();

    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint is required' },
        { status: 400 }
      );
    }

    // Delete the subscription
    const { error } = await supabase
      .from('push_subscriptions')
      .delete()
      .eq('endpoint', endpoint)
      .eq('user_id', userId);

    if (error) throw error;

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error unregistering push subscription:', error);
    return NextResponse.json(
      { error: 'Failed to unregister push subscription' },
      { status: 500 }
    );
  }
}
