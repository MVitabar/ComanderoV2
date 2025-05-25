import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/database';

type CreateNotificationRequest = {
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  channel?: string;
  userIds?: string[];
  role?: string;
  isImportant?: boolean;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const supabase = createRouteHandlerClient<Database>({ cookies });

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
    
    // Get query parameters
    const isRead = searchParams.get('isRead');
    const type = searchParams.get('type');
    const channel = searchParams.get('channel');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const offset = (page - 1) * limit;

    // Build the query
    let query = supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('establishment_id', establishmentId)
      .or(`recipient_id.eq.${userId},recipient_id.is.null`)
      .order('created_at', { ascending: false });

    // Apply filters
    if (isRead === 'true' || isRead === 'false') {
      query = query.eq('is_read', isRead === 'true');
    }
    
    if (type) {
      query = query.eq('type', type);
    }
    
    if (channel) {
      query = query.eq('channel', channel);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: notifications, error, count } = await query;

    if (error) {
      throw error;
    }

    // Mark notifications as read if requested
    const markAsRead = searchParams.get('markAsRead') === 'true';
    if (markAsRead && notifications.length > 0) {
      const notificationIds = notifications
        .filter(n => !n.is_read && n.recipient_id === userId)
        .map(n => n.id);

      if (notificationIds.length > 0) {
        await supabase
          .from('notifications')
          .update({ 
            is_read: true,
            read_at: new Date().toISOString() 
          })
          .in('id', notificationIds);
      }
    }


    return NextResponse.json({
      data: notifications,
      pagination: {
        total: count || 0,
        page,
        pageSize: limit,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const body: CreateNotificationRequest = await request.json();

    // Validate request body
    if (!body.type || !body.title || !body.message) {
      return NextResponse.json(
        { error: 'Type, title, and message are required' },
        { status: 400 }
      );
    }

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

    // Prepare notification data
    const notificationData = {
      type: body.type,
      title: body.title,
      message: body.message,
      data: body.data || {},
      channel: body.channel || 'general',
      is_important: body.isImportant || false,
      created_by: userId,
      establishment_id: establishmentId
    };

    // If specific user IDs are provided, create a notification for each user
    if (body.userIds && body.userIds.length > 0) {
      const notifications = body.userIds.map(recipientId => ({
        ...notificationData,
        recipient_id: recipientId
      }));

      const { data, error } = await supabase
        .from('notifications')
        .insert(notifications)
        .select();

      if (error) throw error;

      return NextResponse.json(data, { status: 201 });
    }
    // If a role is provided, get users with that role and create notifications
    else if (body.role) {
      // Get users with the specified role in the establishment
      const { data: users, error: usersError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', body.role)
        .eq('establishment_id', establishmentId);

      if (usersError) throw usersError;

      if (!users || users.length === 0) {
        return NextResponse.json(
          { error: 'No users found with the specified role' },
          { status: 404 }
        );
      }

      const notifications = users.map(user => ({
        ...notificationData,
        recipient_id: user.user_id
      }));

      const { data, error } = await supabase
        .from('notifications')
        .insert(notifications)
        .select();

      if (error) throw error;

      return NextResponse.json(data, { status: 201 });
    }
    // If no specific recipients, create a general notification
    else {
      const { data, error } = await supabase
        .from('notifications')
        .insert([notificationData])
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json(data, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}
