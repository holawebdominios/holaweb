import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, markOrderAsPaid } from '@/lib/firestore-utils';
import { activateDomain } from '@/lib/firestore-utils';
import { z } from 'zod';

const simulatePaymentSchema = z.object({
  orderId: z.string().min(1, 'orderId requerido'),
});

/**
 * POST /api/checkout/simulate-payment
 * Simula un pago exitoso para testing/desarrollo
 * 
 * SOLO FUNCIONA EN DESARROLLO (localhost)
 * 
 * Simula el proceso del webhook de Mercado Pago:
 * 1. Marca la orden como pagada
 * 2. Activa el dominio
 * 3. Devuelve éxito
 */
export async function POST(request: NextRequest) {
  // Solo permitir en desarrollo
  const isDevelopment = process.env.NODE_ENV === 'development' || 
                       request.headers.get('host')?.includes('localhost');
  
  if (!isDevelopment) {
    return NextResponse.json(
      { success: false, error: 'Simulación solo disponible en desarrollo' },
      { status: 403 }
    );
  }
  
  try {
    const body = await request.json();
    const { orderId } = simulatePaymentSchema.parse(body);
    
    console.log('[Simulate Payment] Simulando pago para orden:', orderId);
    
    // Obtener orden
    const order = await getOrderById(orderId);
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Orden no encontrada' },
        { status: 404 }
      );
    }
    
    if (order.status === 'paid') {
      return NextResponse.json(
        { success: false, error: 'La orden ya está pagada' },
        { status: 400 }
      );
    }
    
    // Simular pago
    const simulatedPaymentId = `SIMULATED-${Date.now()}`;
    await markOrderAsPaid(orderId, simulatedPaymentId);
    
    console.log('[Simulate Payment] Orden marcada como pagada');
    
    // Activar dominio si hay userId
    if (order.userId) {
      const domainParts = order.domain.split('.');
      const domainName = domainParts[0];
      const tld = '.' + domainParts.slice(1).join('.');
      
      // Convertir meses a años (order.period está en meses)
      const years = Math.ceil(order.period / 12);
      
      await activateDomain(
        order.userId,
        order.domain,
        tld,
        years
      );
      
      console.log('[Simulate Payment] Dominio activado:', order.domain, `(${years} años)`);
    } else {
      console.log('[Simulate Payment] Orden sin userId, dominio requiere vinculación manual');
    }
    
    return NextResponse.json({
      success: true,
      message: 'Pago simulado exitosamente',
      orderId,
      paymentId: simulatedPaymentId,
    });
    
  } catch (error) {
    console.error('[Simulate Payment] Error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Datos inválidos' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Error al simular pago' },
      { status: 500 }
    );
  }
}

