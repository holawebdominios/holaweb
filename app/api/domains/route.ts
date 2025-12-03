import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/firebase-admin';
import { getUserDomains } from '@/lib/firestore-utils';

/**
 * GET /api/domains
 * Obtiene todos los dominios del usuario autenticado
 * 
 * SEGURIDAD:
 * - Requiere autenticación (token verificado)
 * - Solo devuelve dominios del usuario autenticado
 * - El userId viene del token, NUNCA del query/body
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación (obligatorio)
    const authUser = await requireAuth(request);
    
    console.log('[API Domains] Obteniendo dominios para usuario:', authUser.uid);
    
    // Obtener dominios del usuario
    // El userId se obtiene del token verificado, NO de parámetros
    const domains = await getUserDomains(authUser.uid);
    
    console.log('[API Domains] Dominios encontrados:', domains.length);
    
    return NextResponse.json({
      success: true,
      domains,
    });
    
  } catch (error) {
    console.error('[API Domains] Error:', error);
    
    if (error instanceof Error && error.message === 'Autenticación requerida') {
      return NextResponse.json(
        { success: false, error: 'No autenticado', domains: [] },
        { status: 401 }
      );
    }
    
    // Devolver array vacío en lugar de error 500
    return NextResponse.json({
      success: true,
      domains: [],
      warning: 'Error al cargar dominios, mostrando datos vacíos'
    });
  }
}

