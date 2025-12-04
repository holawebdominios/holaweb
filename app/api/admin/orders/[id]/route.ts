import { NextRequest, NextResponse } from 'next/server';
import { extractToken, requireAdmin } from '@/lib/admin-auth';
import { adminDb } from '@/lib/firebase-admin';
import { AdminUser, AdminOrder, AdminDomain } from '@/types/firestore-admin';

/**
 * GET /api/admin/orders/[id]
 * Obtiene detalle completo de una orden
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractToken(authHeader);

    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Verificar que sea admin
    await requireAdmin(token);

    if (!adminDb) {
      return NextResponse.json({ error: 'Firestore no configurado' }, { status: 500 });
    }

    const { id } = params;

    // Obtener orden
    const orderDoc = await adminDb!.collection('orders').doc(id).get();

    if (!orderDoc.exists) {
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
    }

    const orderData = orderDoc.data();
    const order: AdminOrder = { id: orderDoc.id, ...orderData } as AdminOrder;

    // Obtener información del usuario si existe
    let user: AdminUser | null = null;
    if (order.userId && adminDb) {
      try {
        const userDoc = await adminDb.collection('users').doc(order.userId).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          user = { id: userDoc.id, ...userData } as AdminUser;
        }
      } catch (err) {
        console.error('Error obteniendo usuario:', err);
      }
    }

    // Obtener dominio asociado si existe
    let domain: AdminDomain | null = null;
    if (order.userId && order.domain && adminDb) {
      try {
        const domainSnapshot = await adminDb
          .collection('domains')
          .where('userId', '==', order.userId)
          .where('domain', '==', order.domain)
          .limit(1)
          .get();

        if (!domainSnapshot.empty) {
          const domainDoc = domainSnapshot.docs[0];
          const domainData = domainDoc.data();
          domain = { id: domainDoc.id, ...domainData } as AdminDomain;
        }
      } catch (err) {
        console.error('Error obteniendo dominio:', err);
      }
    }

    return NextResponse.json({
      success: true,
      order: {
        ...order,
        userEmail: user?.email || order.metadata?.customerEmail,
        userName: user?.name || order.metadata?.customerName,
      },
      user,
      domain,
    });

  } catch (error) {
    console.error('[Admin Order Detail] Error:', error);
    
    if (error instanceof Error && error.message.includes('permisos de administrador')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Error al obtener orden' },
      { status: 500 }
    );
  }
}

