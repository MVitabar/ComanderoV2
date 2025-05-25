import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/database';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const supabase = createRouteHandlerClient<Database>({ cookies });

    // Verificar autenticación
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Obtener el artículo
    const { data: item, error } = await supabase
      .from('inventory_items')
      .select('*, category:inventory_categories(*), supplier:suppliers(*)')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Artículo no encontrado' },
          { status: 404 }
        );
      }
      throw error;
    }

    // Verificar que el artículo pertenezca al establecimiento del usuario
    if (item.establishment_id !== session.user.user_metadata.establishment_id) {
      return NextResponse.json(
        { error: 'No autorizado para acceder a este recurso' },
        { status: 403 }
      );
    }

    // Formatear la respuesta
    const response = {
      id: item.id,
      name: item.name,
      category: item.category || null,
      currentStock: item.current_stock,
      minimumStock: item.minimum_stock,
      unit: item.unit,
      cost: item.cost,
      supplier: item.supplier || null,
      status: item.current_stock === 0 
        ? 'out' 
        : item.current_stock <= 5 
          ? 'low' 
          : item.current_stock <= 15 
            ? 'medium' 
            : 'good',
      lastUpdated: item.updated_at,
      createdAt: item.created_at
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error al obtener el artículo de inventario:', error);
    return NextResponse.json(
      { error: 'Error al cargar el artículo de inventario' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
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
    const body = await request.json();

    // Verificar que el artículo existe y pertenece al establecimiento
    const { data: existingItem, error: fetchError } = await supabase
      .from('inventory_items')
      .select('id, current_stock')
      .eq('id', id)
      .eq('establishment_id', establishmentId)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Artículo no encontrado' },
          { status: 404 }
        );
      }
      throw fetchError;
    }

    // Actualizar el artículo
    const updates: any = {
      name: body.name,
      category_id: body.category_id,
      minimum_stock: body.minimum_stock,
      unit: body.unit,
      cost: body.cost,
      supplier_id: body.supplier_id,
      updated_at: new Date().toISOString()
    };

    // Si se está actualizando el stock, manejarlo como un ajuste
    if (body.current_stock !== undefined && body.current_stock !== existingItem.current_stock) {
      const quantity = body.current_stock - existingItem.current_stock;
      const type = quantity > 0 ? 'in' : 'out';
      
      // Actualizar el stock
      updates.current_stock = body.current_stock;
      
      // Determinar el estado basado en el nuevo stock
      updates.status = body.current_stock === 0 
        ? 'out' 
        : body.current_stock <= 5 
          ? 'low' 
          : body.current_stock <= 15 
            ? 'medium' 
            : 'good';

      // Registrar el movimiento de stock
      await supabase
        .from('stock_movements')
        .insert([
          {
            item_id: id,
            type,
            quantity: Math.abs(quantity),
            reason: body.reason || 'Ajuste manual de inventario',
            user_id: session.user.id,
            establishment_id: establishmentId
          }
        ]);
    }

    // Realizar la actualización
    const { data: updatedItem, error: updateError } = await supabase
      .from('inventory_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error al actualizar el artículo de inventario:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el artículo de inventario' },
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

    // Verificar autenticación
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const establishmentId = session.user.user_metadata.establishment_id;

    // Verificar que el artículo existe y pertenece al establecimiento
    const { error: checkError } = await supabase
      .from('inventory_items')
      .select('id')
      .eq('id', id)
      .eq('establishment_id', establishmentId)
      .single();

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Artículo no encontrado' },
          { status: 404 }
        );
      }
      throw checkError;
    }

    // Eliminar movimientos de stock asociados
    await supabase
      .from('stock_movements')
      .delete()
      .eq('item_id', id);

    // Eliminar el artículo
    const { error: deleteError } = await supabase
      .from('inventory_items')
      .delete()
      .eq('id', id);

    if (deleteError) {
      throw deleteError;
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error al eliminar el artículo de inventario:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el artículo de inventario' },
      { status: 500 }
    );
  }
}
