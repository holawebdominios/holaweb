import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, activateDomain } from '@/lib/firestore-utils';

/**
 * POST /api/admin/activate-domain
 * Activa manualmente un dominio para una orden pagada
 * SOLO DESARROLLO
 */
export async function POST(request: NextRequest) {
  // Solo permitir en desarrollo
  const isDevelopment = process.env.NODE_ENV === 'development' || 
                       request.headers.get('host')?.includes('localhost');
  
  if (!isDevelopment) {
    return NextResponse.json(
      { success: false, error: 'Solo disponible en desarrollo' },
      { status: 403 }
    );
  }
  
  try {
    const { orderId } = await request.json();
    
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'orderId requerido' },
        { status: 400 }
      );
    }
    
    // Obtener orden
    const order = await getOrderById(orderId);
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Orden no encontrada' },
        { status: 404 }
      );
    }
    
    if (order.status !== 'paid') {
      return NextResponse.json(
        { success: false, error: 'La orden debe estar pagada' },
        { status: 400 }
      );
    }
    
    if (!order.userId) {
      return NextResponse.json(
        { success: false, error: 'La orden no tiene userId' },
        { status: 400 }
      );
    }
    
    // Activar dominio
    const domainParts = order.domain.split('.');
    const tld = '.' + domainParts.slice(1).join('.');
    const years = Math.ceil(order.period / 12);
    
    const domainId = await activateDomain(
      order.userId,
      order.domain,
      tld,
      years
    );
    
    console.log('[Admin] Dominio activado:', order.domain, 'ID:', domainId);
    
    return NextResponse.json({
      success: true,
      message: 'Dominio activado exitosamente',
      domainId,
      domain: order.domain,
    });
    
  } catch (error) {
    console.error('[Admin] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al activar dominio' },
      { status: 500 }
    );
  }
}

