import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/database';

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
    const channel = searchParams.get('channel');
    const type = searchParams.get('type');

    // Build the query
    let query = supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false)
      .eq('establishment_id', establishmentId)
      .or(`recipient_id.eq.${userId},recipient_id.is.null`);

    // Apply filters
    if (channel) {
      query = query.eq('channel', channel);
    }

    if (type) {
      query = query.eq('type', type);
    }

    const { count, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      count: count || 0,
      channel,
      type
    });
  } catch (error) {
    console.error('Error counting unread notifications:', error);
    return NextResponse.json(
      { error: 'Failed to count unread notifications' },
      { status: 500 }
    );
  }
}
