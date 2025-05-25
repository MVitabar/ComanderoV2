import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/database';

type UpdateNotificationRequest = {
  isRead?: boolean;
  isImportant?: boolean;
  data?: Record<string, any>;
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
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

    // Get the notification
    const { data: notification, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('id', id)
      .eq('establishment_id', establishmentId)
      .or(`recipient_id.eq.${userId},recipient_id.is.null`)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Notification not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    // If notification is not read, mark it as read
    if (!notification.is_read && notification.recipient_id === userId) {
      await supabase
        .from('notifications')
        .update({ 
          is_read: true,
          read_at: new Date().toISOString() 
        })
        .eq('id', id);
      
      notification.is_read = true;
      notification.read_at = new Date().toISOString();
    }

    return NextResponse.json(notification);
  } catch (error) {
    console.error('Error fetching notification:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notification' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const body: UpdateNotificationRequest = await request.json();

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

    // Check if notification exists and user has permission to update it
    const { data: existingNotification, error: fetchError } = await supabase
      .from('notifications')
      .select('id, recipient_id, created_by')
      .eq('id', id)
      .eq('establishment_id', establishmentId)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Notification not found' },
          { status: 404 }
        );
      }
      throw fetchError;
    }

    // Only the recipient or the creator can update the notification
    if (existingNotification.recipient_id && 
        existingNotification.recipient_id !== userId && 
        existingNotification.created_by !== userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Prepare updates
    const updates: any = {
      updated_at: new Date().toISOString()
    };

    if (body.isRead !== undefined) {
      updates.is_read = body.isRead;
      if (body.isRead) {
        updates.read_at = new Date().toISOString();
      } else {
        updates.read_at = null;
      }
    }


    if (body.isImportant !== undefined) {
      updates.is_important = body.isImportant;
    }

    if (body.data) {
      updates.data = body.data;
    }

    // Update the notification
    const { data: updatedNotification, error: updateError } = await supabase
      .from('notifications')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json(updatedNotification);
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
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
    const userRole = session.user.user_metadata.role;
    const establishmentId = session.user.user_metadata.establishment_id;

    // Check if notification exists and user has permission to delete it
    const { data: existingNotification, error: fetchError } = await supabase
      .from('notifications')
      .select('id, recipient_id, created_by')
      .eq('id', id)
      .eq('establishment_id', establishmentId)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Notification not found' },
          { status: 404 }
        );
      }
      throw fetchError;
    }

    // Only admins, the creator, or the recipient can delete the notification
    const isAdmin = userRole === 'admin' || userRole === 'manager';
    const isCreator = existingNotification.created_by === userId;
    const isRecipient = existingNotification.recipient_id === userId;

    if (!isAdmin && !isCreator && !isRecipient) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Delete the notification
    const { error: deleteError } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);

    if (deleteError) {
      throw deleteError;
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json(
      { error: 'Failed to delete notification' },
      { status: 500 }
    );
  }
}
