import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/database';

type UpdateStatusRequest = {
  status: 'pending' | 'in_preparation' | 'ready' | 'delivered' | 'cancelled';
  notes?: string;
};

export async function PATCH(
  request: Request,
  { params }: { params: { orderId: string; itemId: string } }
) {
  try {
    const { orderId, itemId } = params;
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const body: UpdateStatusRequest = await request.json();

    // Validate request body
    if (!body.status) {
      return NextResponse.json(
        { error: 'Status is required' },
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

    const establishmentId = session.user.user_metadata.establishment_id;
    const userId = session.user.id;

    // Verify order exists and belongs to the establishment
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, status, table_id')
      .eq('id', orderId)
      .eq('establishment_id', establishmentId)
      .single();

    if (orderError) {
      if (orderError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }
      throw orderError;
    }

    // Don't allow status updates for cancelled or paid orders
    if (order.status === 'cancelled' || order.status === 'paid') {
      return NextResponse.json(
        { error: `Cannot update items in a ${order.status} order` },
        { status: 400 }
      );
    }

    // Get the current item
    const { data: currentItem, error: itemError } = await supabase
      .from('order_items')
      .select('*')
      .eq('id', itemId)
      .eq('order_id', orderId)
      .single();

    if (itemError) {
      if (itemError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Item not found' },
          { status: 404 }
        );
      }
      throw itemError;
    }

    // Don't allow updating status of cancelled items
    if (currentItem.status === 'cancelled') {
      return NextResponse.json(
        { error: 'Cannot update status of a cancelled item' },
        { status: 400 }
      );
    }

    // Prepare the update
    const updates: any = {
      status: body.status,
      updated_at: new Date().toISOString()
    };

    // Set timestamps based on status
    const now = new Date().toISOString();
    
    if (body.status === 'in_preparation' && !currentItem.started_at) {
      updates.started_at = now;
    } else if (body.status === 'ready' && !currentItem.completed_at) {
      updates.completed_at = now;
      // If not already started, set started_at to now as well
      if (!currentItem.started_at) {
        updates.started_at = now;
      }
    } else if (body.status === 'delivered' && !currentItem.delivered_at) {
      updates.delivered_at = now;
      // If not already started/completed, set those timestamps as well
      if (!currentItem.started_at) updates.started_at = now;
      if (!currentItem.completed_at) updates.completed_at = now;
    } else if (body.status === 'cancelled') {
      updates.cancelled_at = now;
      updates.cancelled_by = userId;
      updates.cancellation_reason = body.notes || 'No reason provided';
    }

    // Update the item status
    const { data: updatedItem, error: updateError } = await supabase
      .from('order_items')
      .update(updates)
      .eq('id', itemId)
      .select('*, product:product_id(*)')
      .single();

    if (updateError) {
      throw updateError;
    }

    // Log the status change
    await supabase
      .from('order_item_status_logs')
      .insert([
        {
          order_item_id: itemId,
          order_id: orderId,
          previous_status: currentItem.status,
          new_status: body.status,
          changed_by: userId,
          notes: body.notes
        }
      ]);

    // Check if all items are ready or delivered to update order status
    if (body.status === 'ready' || body.status === 'delivered') {
      await checkAndUpdateOrderStatus(supabase, orderId, body.status);
    }

    // If item is ready, send notification to waitstaff
    if (body.status === 'ready') {
      await notifyItemReady(supabase, orderId, updatedItem, order.table_id);
    }

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating item status:', error);
    return NextResponse.json(
      { error: 'Failed to update item status' },
      { status: 500 }
    );
  }
}

async function checkAndUpdateOrderStatus(
  supabase: ReturnType<typeof createRouteHandlerClient<Database>>,
  orderId: string,
  newItemStatus: 'ready' | 'delivered'
) {
  // Get all items for the order
  const { data: items, error } = await supabase
    .from('order_items')
    .select('status')
    .eq('order_id', orderId)
    .neq('status', 'cancelled');

  if (error) throw error;

  // Check if all items are in the specified status or delivered
  const allItemsInStatus = items.every(item => 
    item.status === newItemStatus || item.status === 'delivered'
  );

  if (allItemsInStatus) {
    // Update order status based on the item status
    const orderStatus = newItemStatus === 'ready' ? 'ready_for_serving' : 'served';
    
    await supabase
      .from('orders')
      .update({
        status: orderStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);
  }
}

async function notifyItemReady(
  supabase: ReturnType<typeof createRouteHandlerClient<Database>>,
  orderId: string,
  item: any,
  tableId: string | null
) {
  try {
    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('order_number, table_id')
      .eq('id', orderId)
      .single();

    if (orderError) throw orderError;

    // Get table details if applicable
    let tableInfo = null;
    if (tableId) {
      const { data: table, error: tableError } = await supabase
        .from('tables')
        .select('name, number')
        .eq('id', tableId)
        .single();
      
      if (!tableError && table) {
        tableInfo = {
          name: table.name || `Mesa ${table.number}`,
          number: table.number
        };
      }
    }


    // Create a notification for the waitstaff
    await supabase
      .from('notifications')
      .insert([
        {
          type: 'item_ready',
          title: '¡Ítem listo para servir!',
          message: `${item.quantity}x ${item.product?.name || 'Ítem'} ${tableInfo ? `para ${tableInfo.name}` : ''}`,
          data: {
            order_id: orderId,
            order_number: order.order_number,
            item_id: item.id,
            item_name: item.product?.name || 'Ítem',
            quantity: item.quantity,
            table: tableInfo,
            product_id: item.product_id
          },
          channel: 'kitchen',
          is_read: false
        }
      ]);

    // Here you could also implement WebSocket notifications or push notifications
    // to alert waitstaff in real-time about the ready item

  } catch (error) {
    console.error('Error creating notification:', error);
    // Don't fail the whole request if notification fails
  }
}
