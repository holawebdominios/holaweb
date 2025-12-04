import { NextRequest, NextResponse } from 'next/server';
import { extractToken, requireAdmin } from '@/lib/admin-auth';
import { adminDb } from '@/lib/firebase-admin';
import { AdminUser } from '@/types/firestore-admin';

/**
 * GET /api/admin/users
 * Obtiene lista de usuarios con filtros
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
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '25');

    console.log('[Admin Users] Query params:', { search, sortBy, sortOrder, page, pageSize });

    // Obtener usuarios con límite
    let usersQuery = adminDb!.collection('users');
    
    // Si hay búsqueda, obtener todos y filtrar (Firestore no soporta búsqueda full-text)
    // En producción, considera usar Algolia o similar para búsqueda avanzada
    const snapshot = await usersQuery.get();

    let users: AdminUser[] = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data
      } as AdminUser;
    });

    // Filtrar por búsqueda (email o nombre)
    if (search) {
      const searchLower = search.toLowerCase();
      users = users.filter(user => 
        user.email?.toLowerCase().includes(searchLower) ||
        user.name?.toLowerCase().includes(searchLower)
      );
    }

    // Ordenar
    users.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Para timestamps
      if (aValue?.toMillis) aValue = aValue.toMillis();
      if (bValue?.toMillis) bValue = bValue.toMillis();

      // Para strings
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Calcular paginación
    const totalUsers = users.length;
    const totalPages = Math.ceil(totalUsers / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedUsers = users.slice(startIndex, endIndex);

    console.log('[Admin Users] Resultados:', {
      total: totalUsers,
      page,
      pageSize,
      returning: paginatedUsers.length
    });

    // Obtener conteos SOLO para usuarios de la página actual (optimización)
    interface UserWithCounts extends AdminUser {
      ordersCount: number;
      domainsCount: number;
      totalSpent: number;
    }

    const usersWithCounts: UserWithCounts[] = await Promise.all(
      paginatedUsers.map(async (user) => {
        if (!adminDb) {
          return {
            ...user,
            ordersCount: 0,
            domainsCount: 0,
            totalSpent: 0,
          };
        }

        const [ordersSnap, domainsSnap] = await Promise.all([
          adminDb.collection('orders').where('userId', '==', user.uid).get(),
          adminDb.collection('domains').where('userId', '==', user.uid).get(),
        ]);

        const orders = ordersSnap.docs.map(d => d.data());
        const totalSpent = orders
          .filter((o: any) => o.status === 'paid')
          .reduce((sum: number, o: any) => sum + (o.total || 0), 0);

        return {
          ...user,
          ordersCount: ordersSnap.size,
          domainsCount: domainsSnap.size,
          totalSpent,
        };
      })
    );

    return NextResponse.json({
      success: true,
      users: usersWithCounts,
      total: totalUsers,
      page,
      pageSize,
      totalPages,
    });

  } catch (error) {
    console.error('[Admin Users] Error:', error);
    
    if (error instanceof Error && error.message.includes('permisos de administrador')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Error al obtener usuarios' },
      { status: 500 }
    );
  }
}

