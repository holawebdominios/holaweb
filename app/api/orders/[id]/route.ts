import { NextRequest, NextResponse } from 'next/server';
import { optionalAuth } from '@/lib/firebase-admin';
import { getOrderById } from '@/lib/firestore-utils';

/**
 * GET /api/orders/[id]
 * Obtiene una orden específica por ID
 * 
 * SEGURIDAD:
 * - Si hay usuario autenticado, verifica que la orden le pertenezca
 * - Si no hay usuario, permite ver orden (para checkout invitado)
 * - Nunca confía en userId del query/body
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;
    
    // Autenticación opcional
    const authUser = await optionalAuth(request);
    
    // Obtener orden
    // Si hay usuario autenticado, getOrderById verificará que le pertenezca
    const order = await getOrderById(orderId, authUser?.uid);
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Orden no encontrada' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      order,
    });
    
  } catch (error) {
    console.error('Error obteniendo orden:', error);
    
    if (error instanceof Error && error.message === 'No autorizado para ver esta orden') {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Error al obtener orden' },
      { status: 500 }
    );
  }
}

