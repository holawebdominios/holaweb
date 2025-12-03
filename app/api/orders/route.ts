import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/firebase-admin';
import { getUserOrders } from '@/lib/firestore-utils';

/**
 * GET /api/orders
 * Obtiene todas las órdenes del usuario autenticado
 * 
 * SEGURIDAD:
 * - Requiere autenticación
 * - Solo devuelve órdenes del usuario autenticado
 * - El userId viene del token, NUNCA de parámetros
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const authUser = await requireAuth(request);
    
    console.log('[API Orders] Obteniendo órdenes para usuario:', authUser.uid);
    
    // Obtener órdenes del usuario
    const orders = await getUserOrders(authUser.uid);
    
    console.log('[API Orders] Órdenes encontradas:', orders.length);
    
    return NextResponse.json({
      success: true,
      orders,
    });
    
  } catch (error) {
    console.error('[API Orders] Error:', error);
    
    if (error instanceof Error && error.message === 'Autenticación requerida') {
      return NextResponse.json(
        { success: false, error: 'No autenticado', orders: [] },
        { status: 401 }
      );
    }
    
    // Devolver array vacío en lugar de error 500
    return NextResponse.json({
      success: true,
      orders: [],
      warning: 'Error al cargar órdenes, mostrando datos vacíos'
    });
  }
}

