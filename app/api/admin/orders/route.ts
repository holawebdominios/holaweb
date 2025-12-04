import { NextRequest, NextResponse } from 'next/server';
import { extractToken, requireAdmin } from '@/lib/admin-auth';
import { adminDb } from '@/lib/firebase-admin';
import { AdminOrder, WithUserInfo } from '@/types/firestore-admin';

/**
 * GET /api/admin/orders
 * Obtiene lista de órdenes con filtros
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

    // Obtener parámetros de búsqueda y paginación
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '25');

    console.log('[Admin Orders] Query params:', { status, search, sortBy, sortOrder, page, pageSize });

    // Obtener órdenes (optimizar con filtro de estado si se proporciona)
    let ordersQuery = adminDb!.collection('orders');
    
    // Filtrar por estado en la query si es posible (optimización)
    if (status && status !== 'all') {
      ordersQuery = ordersQuery.where('status', '==', status) as any;
    }
    
    const snapshot = await ordersQuery.get();

    let orders: AdminOrder[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as AdminOrder));

    // Filtrar por búsqueda (orderNumber, domain, email)
    if (search) {
      const searchLower = search.toLowerCase();
      orders = orders.filter(order =>
        order.orderNumber?.toLowerCase().includes(searchLower) ||
        order.domain?.toLowerCase().includes(searchLower) ||
        order.metadata?.customerEmail?.toLowerCase().includes(searchLower)
      );
    }

    // Ordenar ANTES de paginar (más eficiente)
    orders.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Para timestamps
      if (aValue?.toMillis) aValue = aValue.toMillis();
      if (bValue?.toMillis) bValue = bValue.toMillis();

      // Para strings
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      // Para números
      if (typeof aValue !== 'number') aValue = 0;
      if (typeof bValue !== 'number') bValue = 0;

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Calcular paginación
    const totalOrders = orders.length;
    const totalPages = Math.ceil(totalOrders / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedOrders = orders.slice(startIndex, endIndex);

    console.log('[Admin Orders] Resultados:', {
      total: totalOrders,
      page,
      pageSize,
      returning: paginatedOrders.length
    });

    // Obtener emails de usuarios SOLO para órdenes de la página actual (optimización)
    const ordersWithUsers: (AdminOrder & WithUserInfo)[] = await Promise.all(
      paginatedOrders.map(async (order) => {
        let userEmail: string | null = order.metadata?.customerEmail || null;
        let userName: string | null = order.metadata?.customerName || null;

        if (order.userId && adminDb) {
          try {
            const userDoc = await adminDb.collection('users').doc(order.userId).get();
            if (userDoc.exists) {
              const userData = userDoc.data();
              userEmail = userData?.email || userEmail;
              userName = userData?.name || userName;
            }
          } catch (err) {
            // Si no se puede obtener el usuario, usar metadata
          }
        }

        return {
          ...order,
          userEmail,
          userName,
        };
      })
    );

    return NextResponse.json({
      success: true,
      orders: ordersWithUsers,
      total: totalOrders,
      page,
      pageSize,
      totalPages,
    });

  } catch (error) {
    console.error('[Admin Orders] Error:', error);
    
    if (error instanceof Error && error.message.includes('permisos de administrador')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Error al obtener órdenes' },
      { status: 500 }
    );
  }
}

