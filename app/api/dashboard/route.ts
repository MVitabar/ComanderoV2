import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/database';

// Definir tipos para las respuestas de Supabase
interface DashboardStats {
  total_orders: number;
  total_revenue: number;
  average_order_value: number;
  total_customers: number;
  revenue_change: number;
  orders_change: number;
  customers_change: number;
  low_stock_items: number;
}

interface Order {
  id: string;
  table: { number: number } | null;
  total: number;
  status: string;
  created_at: string;
  items: { count: number }[];
}

interface StockItem {
  id: string;
  name: string;
  stock_quantity: number;
  min_stock: number;
}

interface TopSellingItem {
  id: string;
  name: string;
  total_sold: number;
  revenue: number;
}

interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get('dateRange') || 'today';
    const establishmentId = searchParams.get('establishmentId');

    const supabase = createRouteHandlerClient<Database>({ cookies });

    // Verificar autenticación
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('Error de autenticación:', authError);
      return NextResponse.json(
        { error: 'Error de autenticación' },
        { status: 500 }
      );
    }

    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Obtener datos del dashboard
    const [
      stats,
      recentOrders,
      lowStockItems,
      topSellingItems,
      revenueData
    ] = await Promise.all([
      // Obtener estadísticas
      supabase
        .rpc('get_dashboard_stats', {
          p_establishment_id: establishmentId || null,
          p_date_range: dateRange
        })
        .then(({ data, error }) => {
          if (error) throw error;
          return data as DashboardStats;
        }),
      
      // Obtener órdenes recientes
      supabase
        .from('orders')
        .select(`
          id,
          table:table_id(number),
          total,
          status,
          created_at,
          items:order_items(count)
        `)
        .eq('establishment_id', establishmentId || session.user.user_metadata.establishment_id)
        .order('created_at', { ascending: false })
        .limit(5)
        .then(({ data, error }) => {
          if (error) throw error;
          
          // Definir el tipo para la respuesta de la base de datos
          type OrderResponse = {
            id: string;
            table: Array<{ number: number }> | null;
            total: number;
            status: string;
            created_at: string;
            items: Array<{ count: number }>;
          };

          // Mapear la respuesta al formato esperado
          return (data as OrderResponse[]).map(order => ({
            id: order.id,
            tableNumber: order.table?.[0]?.number || 'Sin mesa',
            total: order.total,
            status: order.status,
            created_at: order.created_at,
            items: order.items,
            time: new Date(order.created_at).toLocaleTimeString()
          }));
        }),

      // Obtener productos con bajo stock
      supabase
        .from('products')
        .select('id, name, stock_quantity, min_stock')
        .lte('stock_quantity', 5) // Ajusta según tu lógica de bajo stock
        .eq('establishment_id', establishmentId || session.user.user_metadata.establishment_id)
        .order('stock_quantity', { ascending: true })
        .limit(5)
        .then(({ data, error }) => {
          if (error) throw error;
          return data.map(item => ({
            id: item.id,
            name: item.name,
            current: item.stock_quantity,
            minimum: item.min_stock,
            unit: 'unidad'
          }));
        }),

      // Obtener productos más vendidos
      supabase
        .rpc('get_top_selling_items', {
          p_establishment_id: establishmentId || null,
          p_date_range: dateRange,
          p_limit: 5
        })
        .then(({ data, error }) => {
          if (error) throw error;
          return data as TopSellingItem[];
        }),

      // Obtener datos de ingresos
      supabase
        .rpc('get_revenue_data', {
          p_establishment_id: establishmentId || null,
          p_date_range: dateRange
        })
        .then(({ data, error }) => {
          if (error) throw error;
          return data as RevenueData[];
        })
    ]);

    return NextResponse.json({
      stats: [
        {
          title: 'Ingresos Totales',
          value: `$${stats.total_revenue?.toFixed(2) || '0.00'}`,
          change: `${stats.revenue_change || 0}%`,
          trend: (stats.revenue_change || 0) >= 0 ? 'up' : 'down',
          icon: 'DollarSign'
        },
        {
          title: 'Órdenes',
          value: stats.total_orders?.toString() || '0',
          change: `${stats.orders_change || 0}%`,
          trend: (stats.orders_change || 0) >= 0 ? 'up' : 'down',
          icon: 'ShoppingBag'
        },
        {
          title: 'Clientes',
          value: stats.total_customers?.toString() || '0',
          change: `${stats.customers_change || 0}%`,
          trend: (stats.customers_change || 0) >= 0 ? 'up' : 'down',
          icon: 'Users'
        },
        {
          title: 'Art. Bajo Stock',
          value: stats.low_stock_items?.toString() || '0',
          change: '0%',
          trend: 'neutral',
          icon: 'AlertTriangle'
        }
      ],
      recentOrders,
      lowStockItems,
      topSellingItems,
      revenueData
    });

  } catch (error) {
    console.error('Error en la API del dashboard:', error);
    return NextResponse.json(
      { error: 'Error al obtener los datos del dashboard' },
      { status: 500 }
    );
  }
}
