import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/database';

type CreatePaymentRequest = {
  paymentMethodId: string;
  amount: number;
  reference?: string;
  notes?: string;
};

export async function GET(
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

    // Verificar que la orden existe y pertenece al establecimiento
    const { error: orderError } = await supabase
      .from('orders')
      .select('id')
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

    // Obtener los pagos de la orden
    const { data: payments, error: paymentsError } = await supabase
      .from('order_payments')
      .select(`
        *,
        payment_method:payment_methods(*)
      `)
      .eq('order_id', orderId)
      .order('created_at', { ascending: false });

    if (paymentsError) {
      throw paymentsError;
    }

    return NextResponse.json(payments);
  } catch (error) {
    console.error('Error al obtener los pagos de la orden:', error);
    return NextResponse.json(
      { error: 'Error al cargar los pagos de la orden' },
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

    // Verificar autenticación
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const establishmentId = session.user.user_metadata.establishment_id;
    const body: CreatePaymentRequest = await request.json();

    // Validar datos de entrada
    if (!body.paymentMethodId || !body.amount || body.amount <= 0) {
      return NextResponse.json(
        { error: 'Método de pago y monto son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que la orden existe y pertenece al establecimiento
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, status, total, paid_amount')
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

    // No permitir pagos en órdenes canceladas
    if (order.status === 'cancelled') {
      return NextResponse.json(
        { error: 'No se pueden realizar pagos en una orden cancelada' },
        { status: 400 }
      );
    }

    // Verificar que el método de pago existe y pertenece al establecimiento
    const { error: paymentMethodError } = await supabase
      .from('payment_methods')
      .select('id')
      .eq('id', body.paymentMethodId)
      .eq('establishment_id', establishmentId)
      .single();

    if (paymentMethodError) {
      if (paymentMethodError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Método de pago no encontrado' },
          { status: 404 }
        );
      }
      throw paymentMethodError;
    }

    // Calcular el monto pendiente de pago
    const paidAmount = order.paid_amount || 0;
    const remainingAmount = order.total - paidAmount;

    // Verificar que el monto del pago no exceda el saldo pendiente
    if (body.amount > remainingAmount) {
      return NextResponse.json(
        { 
          error: 'El monto del pago excede el saldo pendiente',
          details: {
            total: order.total,
            paid: paidAmount,
            remaining: remainingAmount,
            attempted: body.amount
          }
        },
        { status: 400 }
      );
    }

    // Crear el pago
    const { data: payment, error: paymentError } = await supabase
      .from('order_payments')
      .insert([
        {
          order_id: orderId,
          payment_method_id: body.paymentMethodId,
          amount: body.amount,
          reference: body.reference,
          notes: body.notes,
          processed_by: session.user.id
        }
      ])
      .select()
      .single();

    if (paymentError) {
      throw paymentError;
    }

    // Actualizar el monto pagado en la orden
    const newPaidAmount = paidAmount + body.amount;
    const isFullyPaid = newPaidAmount >= order.total;

    const updates: any = {
      paid_amount: newPaidAmount,
      updated_at: new Date().toISOString()
    };

    // Si el pago completa el total, marcar como pagada
    if (isFullyPaid) {
      updates.status = 'paid';
      updates.paid_at = new Date().toISOString();

      // Liberar la mesa si está asignada
      const { data: tableData } = await supabase
        .from('tables')
        .select('id')
        .eq('current_order_id', orderId)
        .single();

      if (tableData) {
        await supabase
          .from('tables')
          .update({ 
            status: 'available',
            current_order_id: null,
            updated_at: new Date().toISOString() 
          })
          .eq('id', tableData.id);
      }
    }

    // Actualizar la orden
    await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId);

    // Obtener el pago con los datos del método de pago
    const { data: fullPayment, error: fetchError } = await supabase
      .from('order_payments')
      .select('*, payment_method:payment_methods(*), processed_by:users(email, first_name, last_name)')
      .eq('id', payment.id)
      .single();

    if (fetchError) {
      console.error('Error al obtener los detalles del pago:', fetchError);
      return NextResponse.json(payment, { status: 201 });
    }

    return NextResponse.json(fullPayment, { status: 201 });
  } catch (error) {
    console.error('Error al procesar el pago:', error);
    return NextResponse.json(
      { error: 'Error al procesar el pago' },
      { status: 500 }
    );
  }
}
