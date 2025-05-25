import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/database';

type PrintOrderRequest = {
  orderId: string;
  printLocation: 'kitchen' | 'bar';
  copies?: number;
};

type PrintOrderResponse = {
  success: boolean;
  message: string;
  printJobId?: string;
};

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const body: PrintOrderRequest = await request.json();

    // Validate request body
    if (!body.orderId || !body.printLocation) {
      return NextResponse.json(
        { error: 'orderId and printLocation are required' },
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
    const copies = Math.min(Math.max(body.copies || 1, 1), 5); // Limit copies to 1-5

    // Verify order exists and belongs to the establishment
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, order_number, status, created_at, notes')
      .eq('id', body.orderId)
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

    // Get order items for the specified print location
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        *,
        product:product_id(
          id,
          name,
          description,
          price,
          category_id,
          preparation_time,
          is_alcoholic,
          print_location
        )
      `)
      .eq('order_id', body.orderId)
      .eq('products.print_location', body.printLocation);

    if (itemsError) {
      throw itemsError;
    }

    // If no items to print for this location, return early
    if (!orderItems || orderItems.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No items to print for this location' },
        { status: 200 }
      );
    }

    // Get establishment info for the ticket header
    const { data: establishment, error: establishmentError } = await supabase
      .from('establishments')
      .select('name, address, phone, logo_url')
      .eq('id', establishmentId)
      .single();

    if (establishmentError) {
      throw establishmentError;
    }

    // Get table info if available
    const { data: tableData } = await supabase
      .from('tables')
      .select('name, number')
      .eq('current_order_id', body.orderId)
      .single();

    // Get waiter info if available
    const { data: waiterData } = await supabase
      .from('users')
      .select('first_name, last_name')
      .eq('id', session.user.id)
      .single();

    // Prepare print job data
    const printJob = {
      order_id: body.orderId,
      order_number: order.order_number,
      print_location: body.printLocation,
      copies,
      status: 'pending',
      requested_by: session.user.id,
      establishment_id: establishmentId,
      ticket_data: {
        header: {
          establishment: {
            name: establishment.name,
            address: establishment.address,
            phone: establishment.phone,
            logo_url: establishment.logo_url
          },
          order: {
            number: order.order_number,
            date: order.created_at,
            status: order.status,
            notes: order.notes
          },
          table: tableData ? {
            name: tableData.name || `Mesa ${tableData.number}`,
            number: tableData.number
          } : null,
          waiter: waiterData ? {
            name: `${waiterData.first_name} ${waiterData.last_name}`.trim()
          } : null,
          print_time: new Date().toISOString()
        },
        items: orderItems.map(item => ({
          id: item.id,
          name: item.product.name,
          quantity: item.quantity,
          notes: item.notes,
          modifications: item.modifications,
          status: item.status,
          product: {
            id: item.product.id,
            name: item.product.name,
            description: item.product.description,
            preparation_time: item.product.preparation_time,
            is_alcoholic: item.product.is_alcoholic
          }
        })),
        footer: {
          total_items: orderItems.reduce((sum, item) => sum + item.quantity, 0),
          print_time: new Date().toISOString(),
          message: '¡Gracias por su preferencia!'
        }
      }
    };

    // Save print job to database
    const { data: savedPrintJob, error: saveError } = await supabase
      .from('print_jobs')
      .insert([printJob])
      .select()
      .single();

    if (saveError) {
      throw saveError;
    }

    // In a real implementation, you would send the print job to a printer here
    // For example, using a printer service or WebSocket connection
    // This is where you'd integrate with your actual printing solution

    // Simulate print job processing
    setTimeout(async () => {
      await supabase
        .from('print_jobs')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString() 
        })
        .eq('id', savedPrintJob.id);
    }, 2000);

    return NextResponse.json({
      success: true,
      message: 'Print job queued successfully',
      printJobId: savedPrintJob.id
    });

  } catch (error) {
    console.error('Error processing print job:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to process print job' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const printJobId = searchParams.get('id');
    const orderId = searchParams.get('orderId');
    const status = searchParams.get('status');
    const location = searchParams.get('location') as 'kitchen' | 'bar' | null;
    
    const supabase = createRouteHandlerClient<Database>({ cookies });

    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const establishmentId = session.user.user_metadata.establishment_id;
    let query = supabase
      .from('print_jobs')
      .select('*')
      .eq('establishment_id', establishmentId);

    if (printJobId) {
      query = query.eq('id', printJobId);
    }
    
    if (orderId) {
      query = query.eq('order_id', orderId);
    }
    
    if (status) {
      query = query.in('status', status.split(','));
    }
    
    if (location) {
      query = query.eq('print_location', location);
    }
    
    query = query.order('created_at', { ascending: false })
                 .limit(50);

    const { data: printJobs, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json(printJobs);
  } catch (error) {
    console.error('Error fetching print jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch print jobs' },
      { status: 500 }
    );
  }
}
