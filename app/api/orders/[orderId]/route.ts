import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/database';

type UpdateOrderRequest = {
  status?: 'pending' | 'in_progress' | 'ready' | 'delivered' | 'cancelled' | 'paid';
  tableId?: string;
  waiterId?: string;
  notes?: string;
  customerId?: string | null;
};

type AddOrderItemsRequest = {
  items: Array<{
    productId: string;
    quantity: number;
    notes?: string;
    modifications?: string[];
  }>;
};

export async function GET(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId: id } = params;
    const supabase = createRouteHandlerClient<Database>({ cookies });

    // Verificar autenticación
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const establishmentId = session.user.user_metadata.establishment_id;

    // Obtener la orden con los datos relacionados
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        table:table_id(*),
        waiter:waiter_id(*),
        customer:customers(*),
        items:order_items(*, product:product_id(id, name, description, price, image_url)),
        payments:order_payments(*, payment_method:payment_methods(*))
      `)
      .eq('id', id)
      .eq('establishment_id', establishmentId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Orden no encontrada' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error al obtener la orden:', error);
    return NextResponse.json(
      { error: 'Error al cargar la orden' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId: id } = params;
    const supabase = createRouteHandlerClient<Database>({ cookies });

    // Verificar autenticación
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const establishmentId = session.user.user_metadata.establishment_id;
    const body: UpdateOrderRequest = await request.json();

    // Verificar que la orden existe y pertenece al establecimiento
    const { data: existingOrder, error: orderError } = await supabase
      .from('orders')
      .select('id, status, table_id')
      .eq('id', id)
      .eq('establishment_id', establishmentId)
      .single();

    if (orderError) {
      if (orderError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Orden no encontrada' },
          { status: 404 }
        );
      }
      throw orderError;
    }

    // Si se está actualizando el estado a "cancelled" o "paid", verificar permisos
    if (body.status === 'cancelled' || body.status === 'paid') {
      const userRole = session.user.user_metadata.role;
      if (userRole !== 'admin' && userRole !== 'manager') {
        return NextResponse.json(
          { error: 'No tienes permiso para realizar esta acción' },
          { status: 403 }
        );
      }
    }

    // Si se está cambiando de mesa, verificar que la nueva mesa esté disponible
    if (body.tableId && body.tableId !== existingOrder.table_id) {
      const { data: table, error: tableError } = await supabase
        .from('tables')
        .select('id, status')
        .eq('id', body.tableId)
        .eq('establishment_id', establishmentId)
        .single();

      if (tableError) {
        if (tableError.code === 'PGRST116') {
          return NextResponse.json(
            { error: 'Mesa no encontrada' },
            { status: 404 }
          );
        }
        throw tableError;
      }

      if (table.status === 'occupied' && table.id !== existingOrder.table_id) {
        return NextResponse.json(
          { error: 'La mesa ya está ocupada' },
          { status: 400 }
        );
      }

      // Actualizar el estado de la mesa anterior
      await supabase
        .from('tables')
        .update({ 
          status: 'available',
          updated_at: new Date().toISOString() 
        })
        .eq('id', existingOrder.table_id);

      // Actualizar el estado de la nueva mesa
      await supabase
        .from('tables')
        .update({ 
          status: 'occupied',
          updated_at: new Date().toISOString() 
        })
        .eq('id', body.tableId);
    }

    // Si se está actualizando el mesero, verificar que existe
    if (body.waiterId) {
      const { error: waiterError } = await supabase
        .from('users')
        .select('id')
        .eq('id', body.waiterId)
        .eq('establishment_id', establishmentId)
        .single();

      if (waiterError) {
        if (waiterError.code === 'PGRST116') {
          return NextResponse.json(
            { error: 'Mesero no encontrado' },
            { status: 404 }
          );
        }
        throw waiterError;
      }
    }

    // Preparar las actualizaciones
    const updates: any = {
      updated_at: new Date().toISOString()
    };

    if (body.status) updates.status = body.status;
    if (body.tableId) updates.table_id = body.tableId;
    if (body.waiterId) updates.waiter_id = body.waiterId;
    if (body.notes !== undefined) updates.notes = body.notes;
    if (body.customerId !== undefined) updates.customer_id = body.customerId;

    // Si se está marcando como pagado, registrar la fecha
    if (body.status === 'paid') {
      updates.paid_at = new Date().toISOString();
    }

    // Si se está marcando como entregado, registrar la fecha
    if (body.status === 'delivered') {
      updates.delivered_at = new Date().toISOString();
    }

    // Actualizar la orden
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    // Si se está cancelando la orden, liberar la mesa
    if (body.status === 'cancelled' || body.status === 'paid') {
      await supabase
        .from('tables')
        .update({ 
          status: 'available',
          updated_at: new Date().toISOString() 
        })
        .eq('id', updatedOrder.table_id);
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error al actualizar la orden:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la orden' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId: id } = params;
    const supabase = createRouteHandlerClient<Database>({ cookies });

    // Verificar autenticación
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const userRole = session.user.user_metadata.role;
    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'No tienes permiso para realizar esta acción' },
        { status: 403 }
      );
    }

    const establishmentId = session.user.user_metadata.establishment_id;

    // Verificar que la orden existe y pertenece al establecimiento
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, table_id')
      .eq('id', id)
      .eq('establishment_id', establishmentId)
      .single();

    if (orderError) {
      if (orderError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Orden no encontrada' },
          { status: 404 }
        );
      }
      throw orderError;
    }

    // Iniciar una transacción
    const { error: deleteError } = await supabase.rpc('delete_order', {
      order_id: id
    });

    if (deleteError) {
      throw deleteError;
    }

    // Liberar la mesa si está ocupada
    if (order.table_id) {
      await supabase
        .from('tables')
        .update({ 
          status: 'available',
          updated_at: new Date().toISOString() 
        })
        .eq('id', order.table_id);
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error al eliminar la orden:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la orden' },
      { status: 500 }
    );
  }
}
