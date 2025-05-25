import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/database';

type AddOrderItemsRequest = {
  items: Array<{
    productId: string;
    quantity: number;
    notes?: string;
    modifications?: string[];
  }>;
};

type UpdateOrderItemRequest = {
  quantity?: number;
  notes?: string;
  modifications?: string[];
  status?: 'pending' | 'in_progress' | 'ready' | 'delivered' | 'cancelled';
};

export async function POST(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;
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
    const body: AddOrderItemsRequest = await request.json();

    // Validar datos de entrada
    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'No se han proporcionado ítems para agregar' },
        { status: 400 }
      );
    }

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

    // No permitir agregar ítems a órdenes ya pagadas o canceladas
    if (order.status === 'paid' || order.status === 'cancelled') {
      return NextResponse.json(
        { error: `No se pueden agregar ítems a una orden ${order.status === 'paid' ? 'pagada' : 'cancelada'}` },
        { status: 400 }
      );
    }

    // Obtener los IDs de los productos
    const productIds = body.items.map(item => item.productId);
    
    // Verificar que los productos existen y tienen suficiente stock
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, price, current_stock')
      .in('id', productIds)
      .eq('establishment_id', establishmentId);

    if (productsError) {
      throw productsError;
    }

    // Verificar que todos los productos existen
    const missingProducts = body.items.filter(
      item => !products.some(p => p.id === item.productId)
    );

    if (missingProducts.length > 0) {
      return NextResponse.json(
        { 
          error: 'Algunos productos no existen',
          details: missingProducts.map(p => ({
            productId: p.productId,
            message: 'Producto no encontrado'
          }))
        },
        { status: 400 }
      );
    }


    // Verificar stock
    const outOfStock = body.items.filter(item => {
      const product = products.find(p => p.id === item.productId);
      return product && product.current_stock < item.quantity;
    });

    if (outOfStock.length > 0) {
      return NextResponse.json(
        { 
          error: 'No hay suficiente stock para algunos productos',
          details: outOfStock.map(item => ({
            productId: item.productId,
            requested: item.quantity,
            available: products.find(p => p.id === item.productId)?.current_stock || 0
          }))
        },
        { status: 400 }
      );
    }

    // Crear los ítems de la orden
    const orderItems = body.items.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        order_id: orderId,
        product_id: item.productId,
        name: product?.name || 'Producto desconocido',
        quantity: item.quantity,
        unit_price: product?.price || 0,
        subtotal: (product?.price || 0) * item.quantity,
        notes: item.notes,
        modifications: item.modifications,
        status: 'pending'
      };
    });

    // Insertar los ítems en la base de datos
    const { data: insertedItems, error: insertError } = await supabase
      .from('order_items')
      .insert(orderItems)
      .select();

    if (insertError) {
      throw insertError;
    }

    // Actualizar el stock de los productos
    for (const item of body.items) {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        const newStock = (product.current_stock || 0) - item.quantity;
        
        const { error: updateError } = await supabase
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
          .eq('id', item.productId);

        if (updateError) {
          console.error(`Error al actualizar el stock del producto ${item.productId}:`, updateError);
        }
      }
    }

    // Recalcular totales de la orden
    const { data: orderItemsData, error: itemsError } = await supabase
      .from('order_items')
      .select('subtotal')
      .eq('order_id', orderId);

    if (itemsError) {
      throw itemsError;
    }

    const subtotal = orderItemsData.reduce((sum, item) => sum + (item.subtotal || 0), 0);

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
    const { error: updateOrderError } = await supabase
      .from('orders')
      .update({
        subtotal,
        tax,
        total,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (updateOrderError) {
      throw updateOrderError;
    }

    // Obtener los ítems recién insertados con los datos completos
    const insertedItemIds = insertedItems.map(item => item.id);
    const { data: fullItems, error: fetchItemsError } = await supabase
      .from('order_items')
      .select('*, product:product_id(id, name, description, price, image_url)')
      .in('id', insertedItemIds);

    if (fetchItemsError) {
      console.error('Error al obtener los detalles de los ítems:', fetchItemsError);
      return NextResponse.json(insertedItems, { status: 201 });
    }

    return NextResponse.json(fullItems, { status: 201 });
  } catch (error) {
    console.error('Error al agregar ítems a la orden:', error);
    return NextResponse.json(
      { error: 'Error al agregar ítems a la orden' },
      { status: 500 }
    );
  }
}
