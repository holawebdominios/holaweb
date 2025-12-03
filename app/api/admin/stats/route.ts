import { NextRequest, NextResponse } from 'next/server';
import { extractToken, requireAdmin } from '@/lib/admin-auth';
import { adminDb } from '@/lib/firebase-admin';

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
      adminDb.collection('users').get(),
      adminDb.collection('orders').get(),
      adminDb.collection('domains').get(),
    ]);

    // Calcular stats de usuarios
    const totalUsers = usersSnapshot.size;

    // Calcular stats de órdenes
    const orders = ordersSnapshot.docs.map(doc => doc.data());
    const totalOrders = orders.length;
    const paidOrders = orders.filter(o => o.status === 'paid').length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const failedOrders = orders.filter(o => o.status === 'failed').length;
    const totalRevenue = orders
      .filter(o => o.status === 'paid')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    // Calcular stats de dominios
    const domains = domainsSnapshot.docs.map(doc => doc.data());
    const activeDomains = domains.filter(d => d.status === 'active').length;
    const expiringDomains = domains.filter(d => {
      if (!d.expirationDate || d.status !== 'active') return false;
      const expirationDate = d.expirationDate.toDate();
      const now = new Date();
      const daysUntilExpiration = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiration <= 30 && daysUntilExpiration > 0;
    }).length;

    // Órdenes recientes (últimas 5)
    const recentOrders = orders
      .sort((a, b) => {
        const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return bTime - aTime;
      })
      .slice(0, 5)
      .map(order => ({
        id: ordersSnapshot.docs.find(doc => doc.data() === order)?.id,
        orderNumber: order.orderNumber,
        domain: order.domain,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
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

