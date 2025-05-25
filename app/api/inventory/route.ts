import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status') as 'good' | 'medium' | 'low' | 'out' | null;
    const search = searchParams.get('search');
    const minStock = searchParams.get('minStock');
    const maxStock = searchParams.get('maxStock');
    const supplierId = searchParams.get('supplierId');
    const sortBy = searchParams.get('sortBy') as 'name' | 'currentStock' | 'lastUpdated' | null;
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' | null;
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
      .from('inventory_items')
      .select('*, category:inventory_categories(*), supplier:suppliers(*)', { count: 'exact' })
      .eq('establishment_id', establishmentId);

    // Aplicar filtros
    if (category) {
      query = query.eq('category_id', category);
    }

    if (status) {
      if (status === 'out') {
        query = query.eq('current_stock', 0);
      } else if (status === 'low') {
        query = query.lte('current_stock', 5);
      } else if (status === 'medium') {
        query = query.gt('current_stock', 5).lte('current_stock', 15);
      } else if (status === 'good') {
        query = query.gt('current_stock', 15);
      }
    }

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    if (minStock) {
      query = query.gte('current_stock', parseInt(minStock));
    }

    if (maxStock) {
      query = query.lte('current_stock', parseInt(maxStock));
    }

    if (supplierId) {
      query = query.eq('supplier_id', supplierId);
    }

    // Contar el total de registros sin paginación
    const countQuery = query;
    const { count } = await countQuery;

    // Aplicar ordenación
    if (sortBy) {
      // Mapear los nombres de las columnas del frontend a los nombres reales en la base de datos
      const columnMap: Record<string, string> = {
        'name': 'name',
        'currentStock': 'current_stock',
        'lastUpdated': 'updated_at'
      };
      
      const dbColumn = columnMap[sortBy] || 'name';
      query = query.order(dbColumn, { ascending: sortOrder === 'asc' });
    } else {
      query = query.order('name', { ascending: true });
    }

    // Aplicar paginación
    const { data, error } = await query.range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    // Formatear la respuesta
    const items = data.map(item => ({
      id: item.id,
      name: item.name,
      category: item.category?.name || 'Sin categoría',
      currentStock: item.current_stock,
      minimumStock: item.minimum_stock,
      unit: item.unit,
      cost: item.cost,
      supplier: item.supplier?.name || 'Sin proveedor',
      status: item.current_stock === 0 
        ? 'out' 
        : item.current_stock <= 5 
          ? 'low' 
          : item.current_stock <= 15 
            ? 'medium' 
            : 'good',
      lastUpdated: item.updated_at,
      createdAt: item.created_at
    }));

    return NextResponse.json({
      items,
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    });
  } catch (error) {
    console.error('Error en la API de inventario:', error);
    return NextResponse.json(
      { error: 'Error al cargar los artículos del inventario' },
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
    const body = await request.json();

    // Validar datos de entrada
    if (!body.name || !body.category_id || body.current_stock === undefined || body.minimum_stock === undefined) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Crear el artículo
    const { data, error } = await supabase
      .from('inventory_items')
      .insert([
        {
          name: body.name,
          category_id: body.category_id,
          current_stock: body.current_stock || 0,
          minimum_stock: body.minimum_stock || 0,
          unit: body.unit || 'unidad',
          cost: body.cost || 0,
          supplier_id: body.supplier_id || null,
          establishment_id: establishmentId,
          status: body.current_stock === 0 
            ? 'out' 
            : body.current_stock <= 5 
              ? 'low' 
              : body.current_stock <= 15 
                ? 'medium' 
                : 'good'
        }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Crear un movimiento de stock inicial
    if (body.current_stock > 0) {
      await supabase
        .from('stock_movements')
        .insert([
          {
            item_id: data.id,
            type: 'in',
            quantity: body.current_stock,
            reason: 'Stock inicial',
            user_id: session.user.id,
            establishment_id: establishmentId
          }
        ]);
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error al crear artículo de inventario:', error);
    return NextResponse.json(
      { error: 'Error al crear el artículo de inventario' },
      { status: 500 }
    );
  }
}
