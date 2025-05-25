import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/database';

type MarkAsReadRequest = {
  notificationIds?: string[];
  all?: boolean;
  channel?: string;
  type?: string;
};

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const body: MarkAsReadRequest = await request.json();

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

    // If no specific IDs and not marking all, return error
    if ((!body.notificationIds || body.notificationIds.length === 0) && !body.all) {
      return NextResponse.json(
        { error: 'No notification IDs provided and all flag not set' },
        { status: 400 }
      );
    }

    // Prepare the update
    const updates = {
      is_read: true,
      read_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    let query = supabase
      .from('notifications')
      .update(updates)
      .eq('is_read', false)
      .eq('establishment_id', establishmentId);

    // Filter by recipient
    query = query.or(`recipient_id.eq.${userId},recipient_id.is.null`);

    // Apply filters based on request
    if (body.notificationIds && body.notificationIds.length > 0) {
      query = query.in('id', body.notificationIds);
    }

    if (body.channel) {
      query = query.eq('channel', body.channel);
    }

    if (body.type) {
      query = query.eq('type', body.type);
    }

    // Execute the update
    const { data, error } = await query.select().order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      count: data?.length || 0,
      notifications: data
    });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark notifications as read' },
      { status: 500 }
    );
  }
}
