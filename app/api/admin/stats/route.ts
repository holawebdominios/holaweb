import { NextRequest, NextResponse } from 'next/server';
import { extractToken, requireAdmin } from '@/lib/admin-auth';
import { adminDb } from '@/lib/firebase-admin';
import { AdminOrder, AdminDomain } from '@/types/firestore-admin';

/**
 * GET /api/admin/stats
 * Obtiene estadísticas generales para el dashboard admin
 */
export async function GET(request: NextRequest) {
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

    // Obtener stats en paralelo
    const [usersSnapshot, ordersSnapshot, domainsSnapshot] = await Promise.all([
      adminDb!.collection('users').get(),
      adminDb!.collection('orders').get(),
      adminDb!.collection('domains').get(),
    ]);

    // Calcular stats de usuarios
    const totalUsers = usersSnapshot.size;

    // Calcular stats de órdenes
    const orders: AdminOrder[] = ordersSnapshot.docs.map(doc => {
      const data = doc.data();
      return data as unknown as AdminOrder;
    });
    const totalOrders = orders.length;
    const paidOrders = orders.filter(o => o.status === 'paid').length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const failedOrders = orders.filter(o => o.status === 'failed').length;
    const totalRevenue = orders
      .filter(o => o.status === 'paid')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    // Calcular stats de dominios
    const domains: AdminDomain[] = domainsSnapshot.docs.map(doc => {
      const data = doc.data();
      return data as unknown as AdminDomain;
    });
    const activeDomains = domains.filter(d => d.status === 'active').length;
    const expiringDomains = domains.filter(d => {
      if (!d.expirationDate || d.status !== 'active') return false;
      const expirationDate = d.expirationDate.toDate();
      const now = new Date();
      const daysUntilExpiration = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiration <= 30 && daysUntilExpiration > 0;
    }).length;

    // Órdenes recientes (últimas 5) con sus IDs
    const ordersWithIds = ordersSnapshot.docs.map(doc => ({
      id: doc.id,
      data: doc.data() as unknown as AdminOrder
    }));

    const recentOrders = ordersWithIds
      .sort((a, b) => {
        const aTime = a.data.createdAt?.toMillis ? a.data.createdAt.toMillis() : 0;
        const bTime = b.data.createdAt?.toMillis ? b.data.createdAt.toMillis() : 0;
        return bTime - aTime;
      })
      .slice(0, 5)
      .map(({ id, data }) => ({
        id,
        orderNumber: data.orderNumber,
        domain: data.domain,
        total: data.total,
        status: data.status,
        createdAt: data.createdAt,
      }));

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalOrders,
        paidOrders,
        pendingOrders,
        failedOrders,
        totalRevenue,
        activeDomains,
        expiringDomains,
      },
      recentOrders,
    });

  } catch (error) {
    console.error('[Admin Stats] Error:', error);
    
    if (error instanceof Error && error.message.includes('permisos de administrador')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    );
  }
}

