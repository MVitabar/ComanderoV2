import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/database';

type UpdateOrderItemRequest = {
  quantity?: number;
  notes?: string | null;
  modifications?: string[] | null;
  status?: 'pending' | 'in_progress' | 'ready' | 'delivered' | 'cancelled';
};

export async function PATCH(
  request: Request,
  { params }: { params: { orderId: string; itemId: string } }
) {
  try {
    const { orderId, itemId } = params;
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
    const body: UpdateOrderItemRequest = await request.json();

    // Verificar que la orden existe y pertenece al establecimiento
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, status')
      .eq('id', orderId)
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

    // No permitir modificar ítems en órdenes ya pagadas o canceladas
    if (order.status === 'paid' || order.status === 'cancelled') {
      return NextResponse.json(
        { error: `No se pueden modificar ítems en una orden ${order.status === 'paid' ? 'pagada' : 'cancelada'}` },
        { status: 400 }
      );
    }

    // Obtener el ítem actual
    const { data: currentItem, error: itemError } = await supabase
      .from('order_items')
      .select('*')
      .eq('id', itemId)
      .eq('order_id', orderId)
      .single();

    if (itemError) {
      if (itemError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Ítem no encontrado' },
          { status: 404 }
        );
      }
      throw itemError;
    }

    // Si se está actualizando la cantidad, verificar stock
    if (body.quantity !== undefined && body.quantity !== currentItem.quantity) {
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('current_stock')
        .eq('id', currentItem.product_id)
        .eq('establishment_id', establishmentId)
        .single();

      if (productError) {
        throw productError;
      }

      const currentStock = product?.current_stock || 0;
      const quantityDifference = body.quantity - currentItem.quantity;

      if (currentStock < quantityDifference) {
        return NextResponse.json(
          {
            error: 'No hay suficiente stock disponible',
            details: {
              productId: currentItem.product_id,
              available: currentStock,
              requested: quantityDifference
            }
          },
          { status: 400 }
        );
      }
    }

    // Preparar las actualizaciones
    const updates: any = {
      updated_at: new Date().toISOString()
    };

    if (body.quantity !== undefined) updates.quantity = body.quantity;
    if (body.notes !== undefined) updates.notes = body.notes;
    if (body.modifications !== undefined) updates.modifications = body.modifications;
    if (body.status !== undefined) updates.status = body.status;

    // Si se actualiza la cantidad, recalcular el subtotal
    if (body.quantity !== undefined) {
      updates.subtotal = (currentItem.unit_price || 0) * body.quantity;
    }

    // Actualizar el ítem
    const { data: updatedItem, error: updateError } = await supabase
      .from('order_items')
      .update(updates)
      .eq('id', itemId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    // Actualizar el stock si cambió la cantidad
    if (body.quantity !== undefined && body.quantity !== currentItem.quantity) {
      const quantityDifference = currentItem.quantity - (body.quantity || 0);
      
      // Actualizar el stock del producto
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('current_stock')
        .eq('id', currentItem.product_id)
        .single();

      if (productError) {
        throw productError;
      }

      const newStock = (product?.current_stock || 0) + quantityDifference;

      await supabase
        .from('products')
        .update({
          current_stock: newStock,
          status: newStock === 0 
            ? 'out' 
            : newStock <= 5 
              ? 'low' 
              : 'in_stock',
          updated_at: new Date().toISOString()
        })
        .eq('id', currentItem.product_id);
    }

    // Recalcular totales de la orden
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('subtotal')
      .eq('order_id', orderId);

    if (itemsError) {
      throw itemsError;
    }

    const subtotal = orderItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);

    // Obtener la tasa de impuesto del establecimiento
    const { data: establishment, error: establishmentError } = await supabase
      .from('establishments')
      .select('tax_rate')
      .eq('id', establishmentId)
      .single();

    if (establishmentError) {
      throw establishmentError;
    }

    const taxRate = establishment?.tax_rate || 0;
    const tax = subtotal * (taxRate / 100);
    const total = subtotal + tax;

    // Actualizar totales de la orden
    await supabase
      .from('orders')
      .update({
        subtotal,
        tax,
        total,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    // Obtener el ítem actualizado con los datos del producto
    const { data: fullItem, error: fetchError } = await supabase
      .from('order_items')
      .select('*, product:product_id(*)')
      .eq('id', itemId)
      .single();

    if (fetchError) {
      console.error('Error al obtener los detalles del ítem actualizado:', fetchError);
      return NextResponse.json(updatedItem);
    }

    return NextResponse.json(fullItem);
  } catch (error) {
    console.error('Error al actualizar el ítem de la orden:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el ítem de la orden' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { orderId: string; itemId: string } }
) {
  try {
    const { orderId, itemId } = params;
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

    // Verificar que la orden existe y pertenece al establecimiento
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, status')
      .eq('id', orderId)
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

    // No permitir eliminar ítems en órdenes ya pagadas o canceladas
    if (order.status === 'paid' || order.status === 'cancelled') {
      return NextResponse.json(
        { error: `No se pueden eliminar ítems de una orden ${order.status === 'paid' ? 'pagada' : 'cancelada'}` },
        { status: 400 }
      );
    }

    // Obtener el ítem a eliminar
    const { data: itemToDelete, error: itemError } = await supabase
      .from('order_items')
      .select('*')
      .eq('id', itemId)
      .eq('order_id', orderId)
      .single();

    if (itemError) {
      if (itemError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Ítem no encontrado' },
          { status: 404 }
        );
      }
      throw itemError;
    }

    // Eliminar el ítem
    const { error: deleteError } = await supabase
      .from('order_items')
      .delete()
      .eq('id', itemId);

    if (deleteError) {
      throw deleteError;
    }

    // Devolver el stock al inventario
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('current_stock')
      .eq('id', itemToDelete.product_id)
      .single();

    if (productError) {
      throw productError;
    }

    const newStock = (product?.current_stock || 0) + itemToDelete.quantity;

    await supabase
      .from('products')
      .update({
        current_stock: newStock,
        status: newStock === 0 
          ? 'out' 
          : newStock <= 5 
            ? 'low' 
            : 'in_stock',
        updated_at: new Date().toISOString()
      })
      .eq('id', itemToDelete.product_id);

    // Recalcular totales de la orden
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('subtotal')
      .eq('order_id', orderId);

    if (itemsError) {
      throw itemsError;
    }

    const subtotal = orderItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);

    // Obtener la tasa de impuesto del establecimiento
    const { data: establishment, error: establishmentError } = await supabase
      .from('establishments')
      .select('tax_rate')
      .eq('id', establishmentId)
      .single();

    if (establishmentError) {
      throw establishmentError;
    }

    const taxRate = establishment?.tax_rate || 0;
    const tax = subtotal * (taxRate / 100);
    const total = subtotal + tax;

    // Actualizar totales de la orden
    await supabase
      .from('orders')
      .update({
        subtotal,
        tax,
        total,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error al eliminar el ítem de la orden:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el ítem de la orden' },
      { status: 500 }
    );
  }
}
