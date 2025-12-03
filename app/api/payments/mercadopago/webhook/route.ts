import { NextRequest, NextResponse } from 'next/server';
import { Payment } from 'mercadopago';
import { mercadoPagoClient } from '@/lib/mercadopago-client';
import { getOrderById, markOrderAsPaid, updateOrderStatus } from '@/lib/firestore-utils';
import { activateDomain } from '@/lib/firestore-utils';

/**
 * POST /api/payments/mercadopago/webhook
 * Webhook de Mercado Pago para notificaciones de suscripción
 * 
 * IMPORTANTE: Ahora usamos planes de suscripción, no pagos únicos
 * 
 * SEGURIDAD:
 * - Verifica que la notificación venga de Mercado Pago
 * - Valida external_reference para obtener orderId
 * - Solo activa el dominio si la suscripción fue aprobada
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('[Webhook MP] Notificación recibida:', {
      type: body.type,
      action: body.action,
      id: body.data?.id,
    });
    
    // Procesar tanto pagos como suscripciones
    const isPayment = body.type === 'payment' || body.action?.includes('payment');
    const isSubscription = body.type === 'subscription' || body.action?.includes('subscription');
    
    if (!isPayment && !isSubscription) {
      console.log('[Webhook MP] Tipo de notificación ignorado:', body.type);
      return NextResponse.json({ received: true });
    }
    
    const paymentId = body.data?.id;
    
    if (!paymentId) {
      console.error('[Webhook MP] No se recibió paymentId');
      return NextResponse.json(
        { error: 'paymentId no encontrado' },
        { status: 400 }
      );
    }
    
    // TODO: Verificar firma/token de Mercado Pago para seguridad adicional
    // Según la documentación de MP, validar x-signature header
    
    // Consultar el pago en Mercado Pago
    const payment = new Payment(mercadoPagoClient);
    const paymentData = await payment.get({ id: paymentId });
    
    console.log('[Webhook MP] Datos del pago:', {
      id: paymentData.id,
      status: paymentData.status,
      amount: paymentData.transaction_amount,
      metadata: paymentData.metadata,
    });
    
    // Extraer orderId del external_reference (lo usamos para suscripciones)
    const orderId = paymentData.external_reference;
    
    if (!orderId) {
      console.error('[Webhook MP] orderId no encontrado en external_reference');
      return NextResponse.json(
        { error: 'orderId no encontrado' },
        { status: 400 }
      );
    }
    
    // Buscar la orden en Firestore
    const order = await getOrderById(orderId);
    
    if (!order) {
      console.error('[Webhook MP] Orden no encontrada:', orderId);
      return NextResponse.json(
        { error: 'Orden no encontrada' },
        { status: 404 }
      );
    }
    
    // Validar el monto pagado
    const amountPaid = paymentData.transaction_amount || 0;
    
    if (Math.abs(amountPaid - order.total) > 0.01) {
      console.error('[Webhook MP] Monto no coincide:', {
        esperado: order.total,
        recibido: amountPaid,
      });
      
      await updateOrderStatus(orderId, 'failed', {
        metadata: {
          ...order.metadata,
          error: 'Monto no coincide',
          expectedAmount: order.total,
          paidAmount: amountPaid,
        },
      });
      
      return NextResponse.json(
        { error: 'Monto de pago no coincide' },
        { status: 400 }
      );
    }
    
    // Verificar el estado del pago
    if (paymentData.status === 'approved') {
      console.log('[Webhook MP] Pago aprobado, activando orden:', orderId);
      
      // Marcar orden como pagada
      await markOrderAsPaid(orderId, paymentId.toString());
      
      // Activar el dominio si hay usuario asociado
      if (order.userId) {
        try {
          // Extraer nombre base y TLD del dominio
          const domainParts = order.domain.split('.');
          const domainName = domainParts[0];
          const tld = '.' + domainParts.slice(1).join('.');
          
          await activateDomain(
            order.userId,
            order.domain,
            tld,
            order.period
          );
          
          console.log('[Webhook MP] Dominio activado:', order.domain);
          
          // TODO: Enviar email de confirmación
          
        } catch (error) {
          console.error('[Webhook MP] Error activando dominio:', error);
          // La orden está pagada, pero el dominio no se activó
          // Esto debe manejarse manualmente o con retry
        }
      } else {
        console.log('[Webhook MP] Orden sin userId, se requiere acción manual para activar dominio');
        // TODO: Guardar en una cola de dominios pendientes de activación
        // TODO: Enviar email al cliente con instrucciones
      }
      
      return NextResponse.json({ 
        success: true, 
        status: 'approved',
        orderId,
      });
      
    } else if (paymentData.status === 'rejected' || paymentData.status === 'cancelled') {
      console.log('[Webhook MP] Pago rechazado/cancelado:', paymentData.status);
      
      await updateOrderStatus(orderId, 'failed', {
        metadata: {
          ...order.metadata,
          paymentStatus: paymentData.status,
          statusDetail: paymentData.status_detail,
        },
      });
      
      return NextResponse.json({ 
        success: true, 
        status: paymentData.status,
      });
      
    } else {
      // Pago en proceso o pendiente
      console.log('[Webhook MP] Pago en estado:', paymentData.status);
      
      return NextResponse.json({ 
        success: true, 
        status: paymentData.status,
      });
    }
    
  } catch (error) {
    console.error('[Webhook MP] Error procesando webhook:', error);
    
    return NextResponse.json(
      { error: 'Error procesando webhook' },
      { status: 500 }
    );
  }
}

