import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/database';

type GenerateReceiptRequest = {
  includeItems?: boolean;
  includePayments?: boolean;
  includeCustomerInfo?: boolean;
};

export async function GET(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;
    const { searchParams } = new URL(request.url);
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
    
    // Obtener parámetros de la URL
    const includeItems = searchParams.get('includeItems') !== 'false';
    const includePayments = searchParams.get('includePayments') !== 'false';
    const includeCustomerInfo = searchParams.get('includeCustomerInfo') !== 'false';

    // Consultar la orden con los datos necesarios
    const orderQuery = supabase
      .from('orders')
      .select(`
        *,
        waiter:waiter_id(*),
        table:tables(*),
        customer:customers(*)
      `)
      .eq('id', orderId)
      .eq('establishment_id', establishmentId)
      .single();

    const { data: order, error: orderError } = await orderQuery;

    if (orderError) {
      if (orderError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Orden no encontrada' },
          { status: 404 }
        );
      }
      throw orderError;
    }

    // Inicializar el objeto de respuesta
    const receipt: any = {
      id: order.id,
      order_number: order.order_number,
      status: order.status,
      created_at: order.created_at,
      updated_at: order.updated_at,
      subtotal: order.subtotal,
      tax: order.tax,
      discount: order.discount || 0,
      total: order.total,
      paid_amount: order.paid_amount || 0,
      balance: (order.total - (order.paid_amount || 0)),
      waiter: order.waiter,
      table: order.table,
      customer: includeCustomerInfo ? order.customer : undefined,
      notes: order.notes
    };

    // Incluir ítems de la orden si se solicita
    if (includeItems) {
      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          *,
          product:product_id(*)
        `)
        .eq('order_id', orderId)
        .order('created_at', { ascending: true });

      if (itemsError) {
        throw itemsError;
      }

      receipt.items = items;
    }


    // Incluir pagos si se solicita
    if (includePayments) {
      const { data: payments, error: paymentsError } = await supabase
        .from('order_payments')
        .select(`
          *,
          payment_method:payment_methods(*),
          processed_by:users(email, first_name, last_name),
          voided_by:voided_by_users(email, first_name, last_name)
        `)
        .eq('order_id', orderId)
        .order('created_at', { ascending: false });

      if (paymentsError) {
        throw paymentsError;
      }

      receipt.payments = payments;
    }

    // Obtener información del establecimiento
    const { data: establishment, error: establishmentError } = await supabase
      .from('establishments')
      .select('*')
      .eq('id', establishmentId)
      .single();

    if (establishmentError) {
      throw establishmentError;
    }

    receipt.establishment = {
      name: establishment.name,
      address: establishment.address,
      phone: establishment.phone,
      email: establishment.email,
      tax_id: establishment.tax_id,
      logo_url: establishment.logo_url
    };

    return NextResponse.json(receipt);
  } catch (error) {
    console.error('Error al generar el recibo:', error);
    return NextResponse.json(
      { error: 'Error al generar el recibo' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const body: GenerateReceiptRequest = await request.json();

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

    // Obtener el contenido del recibo
    const receiptResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/orders/${orderId}/receipt?${new URLSearchParams({
        includeItems: String(body.includeItems ?? true),
        includePayments: String(body.includePayments ?? true),
        includeCustomerInfo: String(body.includeCustomerInfo ?? true)
      })}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Cookie: request.headers.get('Cookie') || ''
        }
      }
    );

    if (!receiptResponse.ok) {
      const error = await receiptResponse.json();
      throw new Error(error.message || 'Error al generar el recibo');
    }

    const receipt = await receiptResponse.json();

    // Aquí podrías implementar la generación de un PDF o cualquier otro formato
    // Por ahora, simplemente devolvemos el JSON
    
    // Registrar la generación del recibo en la base de datos
    const { data: receiptRecord, error: receiptError } = await supabase
      .from('order_receipts')
      .insert([
        {
          order_id: orderId,
          generated_by: session.user.id,
          receipt_data: receipt,
          is_voided: false
        }
      ])
      .select()
      .single();

    if (receiptError) {
      throw receiptError;
    }

    return NextResponse.json({
      id: receiptRecord.id,
      order_id: orderId,
      generated_at: receiptRecord.created_at,
      receipt_number: `R-${orderId}-${receiptRecord.id}`,
      receipt_data: receipt
    }, { status: 201 });
  } catch (error) {
    console.error('Error al generar el recibo:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al generar el recibo' },
      { status: 500 }
    );
  }
}
