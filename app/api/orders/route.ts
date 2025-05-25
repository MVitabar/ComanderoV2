import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/database';

type OrderFilters = {
  status?: string;
  tableId?: string;
  waiterId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
};

type CreateOrderRequest = {
  tableId: string;
  waiterId: string;
  items: Array<{
    productId: string;
    quantity: number;
    notes?: string;
    modifications?: string[];
  }>;
  notes?: string;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const tableId = searchParams.get('tableId');
    const waiterId = searchParams.get('waiterId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

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

    // Construir la consulta base
    let query = supabase
      .from('orders')
      .select(`
        *,
        table:table_id(number, name),
        waiter:waiter_id(id, first_name, last_name, email),
        items:order_items(count),
        customer:customers(name, email, phone)
      `, { count: 'exact' })
      .eq('establishment_id', establishmentId);

    // Aplicar filtros
    if (status) {
      query = query.in('status', status.split(','));
    }

    if (tableId) {
      query = query.eq('table_id', tableId);
    }

    if (waiterId) {
      query = query.eq('waiter_id', waiterId);
    }

    if (startDate) {
      query = query.gte('created_at', new Date(startDate).toISOString());
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setDate(end.getDate() + 1);
      query = query.lt('created_at', end.toISOString());
    }

    if (search) {
      query = query.or(`
        id.ilike.%${search}%,
        notes.ilike.%${search}%,
        customers.name.ilike.%${search}%,
        customers.email.ilike.%${search}%,
        customers.phone.ilike.%${search}%
      `);
    }

    // Contar el total de registros sin paginación
    const countQuery = query;
    const { count } = await countQuery;

    // Aplicar ordenación
    if (sortBy) {
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // Aplicar paginación
    const { data: orders, error } = await query.range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    // Formatear la respuesta
    const formattedOrders = orders.map(order => ({
      id: order.id,
      table: order.table ? {
        id: order.table_id,
        number: order.table.number,
        name: order.table.name
      } : null,
      waiter: order.waiter ? {
        id: order.waiter.id,
        name: `${order.waiter.first_name} ${order.waiter.last_name}`.trim() || order.waiter.email
      } : null,
      customer: order.customer,
      status: order.status,
      subtotal: order.subtotal,
      tax: order.tax,
      total: order.total,
      notes: order.notes,
      itemsCount: order.items?.[0]?.count || 0,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      completedAt: order.completed_at
    }));

    return NextResponse.json({
      orders: formattedOrders,
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    });
  } catch (error) {
    console.error('Error al obtener las órdenes:', error);
    return NextResponse.json(
      { error: 'Error al cargar las órdenes' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
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
    const body: CreateOrderRequest = await request.json();

    // Validar datos de entrada
    if (!body.tableId || !body.waiterId || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Verificar que la mesa existe y está disponible
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

    if (table.status === 'occupied') {
      return NextResponse.json(
        { error: 'La mesa ya está ocupada' },
        { status: 400 }
      );
    }

    // Verificar que el mesero existe
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

    // Verificar que los productos existen y tienen suficiente stock
    const productIds = body.items.map(item => item.productId);
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

    // Calcular totales
    const subtotal = body.items.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);

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

    // Iniciar una transacción
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          table_id: body.tableId,
          establishment_id: establishmentId,
          waiter_id: body.waiterId,
          status: 'pending',
          subtotal,
          tax,
          total,
          notes: body.notes,
          created_by: session.user.id
        }
      ])
      .select()
      .single();

    if (orderError) {
      throw orderError;
    }

    // Crear los ítems de la orden
    const orderItems = body.items.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        order_id: order.id,
        product_id: item.productId,
        name: product?.name || 'Producto desconocido',
        quantity: item.quantity,
        unit_price: product?.price || 0,
        subtotal: (product?.price || 0) * item.quantity,
        notes: item.notes,
        modifications: item.modifications
      };
    });

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      throw itemsError;
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

    // Actualizar el estado de la mesa
    const { error: tableUpdateError } = await supabase
      .from('tables')
      .update({ 
        status: 'occupied',
        updated_at: new Date().toISOString()
      })
      .eq('id', body.tableId);

    if (tableUpdateError) {
      console.error('Error al actualizar el estado de la mesa:', tableUpdateError);
    }

    // Obtener la orden con los datos relacionados
    const { data: fullOrder, error: fetchError } = await supabase
      .from('orders')
      .select(`
        *,
        table:table_id(*),
        waiter:waiter_id(*),
        items:order_items(*)
      `)
      .eq('id', order.id)
      .single();

    if (fetchError) {
      console.error('Error al obtener los detalles de la orden:', fetchError);
      return NextResponse.json(order, { status: 201 });
    }

    return NextResponse.json(fullOrder, { status: 201 });
  } catch (error) {
    console.error('Error al crear la orden:', error);
    return NextResponse.json(
      { error: 'Error al crear la orden' },
      { status: 500 }
    );
  }
}
