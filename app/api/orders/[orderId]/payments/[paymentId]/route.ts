import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/database';

type VoidPaymentRequest = {
  reason: string;
};

export async function GET(
  request: Request,
  { params }: { params: { orderId: string; paymentId: string } }
) {
  try {
    const { orderId, paymentId } = params;
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

    // Obtener el pago con los datos relacionados
    const { data: payment, error: paymentError } = await supabase
      .from('order_payments')
      .select(`
        *,
        payment_method:payment_methods(*),
        processed_by:users(email, first_name, last_name),
        voided_by:voided_by_users(email, first_name, last_name)
      `)
      .eq('id', paymentId)
      .eq('order_id', orderId)
      .single();

    if (paymentError) {
      if (paymentError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Pago no encontrado' },
          { status: 404 }
        );
      }
      throw paymentError;
    }

    return NextResponse.json(payment);
  } catch (error) {
    console.error('Error al obtener el pago:', error);
    return NextResponse.json(
      { error: 'Error al cargar el pago' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { orderId: string; paymentId: string } }
) {
  try {
    const { orderId, paymentId } = params;
    const supabase = createRouteHandlerClient<Database>({ cookies });

    // Verificar autenticación
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const userRole = session.user.user_metadata.role;
    const establishmentId = session.user.user_metadata.establishment_id;

    // Solo administradores pueden anular pagos
    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'No tienes permiso para realizar esta acción' },
        { status: 403 }
      );
    }

    const body: VoidPaymentRequest = await request.json();

    // Validar datos de entrada
    if (!body.reason) {
      return NextResponse.json(
        { error: 'La razón de la anulación es requerida' },
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

    // Obtener el pago a anular
    const { data: payment, error: paymentError } = await supabase
      .from('order_payments')
      .select('*')
      .eq('id', paymentId)
      .eq('order_id', orderId)
      .is('voided_at', null)
      .single();

    if (paymentError) {
      if (paymentError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Pago no encontrado o ya ha sido anulado' },
          { status: 404 }
        );
      }
      throw paymentError;
    }

    // Anular el pago
    const { error: voidError } = await supabase
      .from('order_payments')
      .update({
        is_voided: true,
        voided_at: new Date().toISOString(),
        voided_by: userId,
        void_reason: body.reason,
        updated_at: new Date().toISOString()
      })
      .eq('id', paymentId);

    if (voidError) {
      throw voidError;
    }

    // Actualizar el monto pagado en la orden
    const newPaidAmount = (order.paid_amount || 0) - payment.amount;
    const updates: any = {
      paid_amount: Math.max(0, newPaidAmount),
      updated_at: new Date().toISOString()
    };

    // Si la orden estaba marcada como pagada, cambiar su estado
    if (order.status === 'paid' && newPaidAmount < order.total) {
      updates.status = 'pending';
      updates.paid_at = null;
    }

    await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId);

    // Obtener el pago anulado con los datos actualizados
    const { data: voidedPayment, error: fetchError } = await supabase
      .from('order_payments')
      .select(`
        *,
        payment_method:payment_methods(*),
        processed_by:users(email, first_name, last_name),
        voided_by:voided_by_users(email, first_name, last_name)
      `)
      .eq('id', paymentId)
      .single();

    if (fetchError) {
      console.error('Error al obtener los detalles del pago anulado:', fetchError);
      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json(voidedPayment);
  } catch (error) {
    console.error('Error al anular el pago:', error);
    return NextResponse.json(
      { error: 'Error al anular el pago' },
      { status: 500 }
    );
  }
}
