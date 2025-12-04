import { NextRequest, NextResponse } from 'next/server';
import { extractToken, requireAdmin } from '@/lib/admin-auth';
import { adminDb } from '@/lib/firebase-admin';
import { AdminUser, AdminOrder, AdminDomain } from '@/types/firestore-admin';

/**
 * GET /api/admin/users/[uid]
 * Obtiene detalle completo de un usuario
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { uid: string } }
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

    const { uid } = params;

    // Obtener usuario
    const userDoc = await adminDb.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const user: AdminUser = { id: userDoc.id, ...userDoc.data() } as AdminUser;

    // Obtener órdenes del usuario
    const ordersSnapshot = await adminDb
      .collection('orders')
      .where('userId', '==', uid)
      .get();

    const orders: AdminOrder[] = ordersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as AdminOrder));

    // Ordenar por fecha
    orders.sort((a, b) => {
      const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
      const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
      return bTime - aTime;
    });

    // Obtener dominios del usuario
    const domainsSnapshot = await adminDb
      .collection('domains')
      .where('userId', '==', uid)
      .get();

    const domains: AdminDomain[] = domainsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as AdminDomain));

    // Ordenar por fecha
    domains.sort((a, b) => {
      const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
      const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
      return bTime - aTime;
    });

    // Calcular stats
    const totalSpent = orders
      .filter(o => o.status === 'paid')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    const lastOrder = orders[0];

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        ordersCount: orders.length,
        domainsCount: domains.length,
        totalSpent,
        lastOrderDate: lastOrder?.createdAt,
      },
      orders: orders.slice(0, 10), // Últimas 10 órdenes
      domains: domains.slice(0, 10), // Últimos 10 dominios
    });

  } catch (error) {
    console.error('[Admin User Detail] Error:', error);
    
    if (error instanceof Error && error.message.includes('permisos de administrador')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Error al obtener usuario' },
      { status: 500 }
    );
  }
}

