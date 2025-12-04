import { NextRequest, NextResponse } from 'next/server';
import { extractToken, requireAdmin } from '@/lib/admin-auth';
import { adminDb } from '@/lib/firebase-admin';
import { AdminDomain, WithUserInfo } from '@/types/firestore-admin';

/**
 * GET /api/admin/domains
 * Obtiene lista de todos los dominios
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

    // Obtener todos los dominios
    const snapshot = await adminDb.collection('domains').get();

    const domains: AdminDomain[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as AdminDomain));

    // Ordenar por fecha de creación
    domains.sort((a, b) => {
      const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
      const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
      return bTime - aTime;
    });

    // Agregar información de usuario para cada dominio
    const domainsWithUsers: (AdminDomain & WithUserInfo)[] = await Promise.all(
      domains.map(async (domain) => {
        let userEmail: string | null = null;
        let userName: string | null = null;

        if (domain.userId) {
          try {
            const userDoc = await adminDb.collection('users').doc(domain.userId).get();
            if (userDoc.exists) {
              const userData = userDoc.data();
              userEmail = userData?.email;
              userName = userData?.name;
            }
          } catch (err) {
            console.error('Error obteniendo usuario:', err);
          }
        }

        return {
          ...domain,
          userEmail,
          userName,
        };
      })
    );

    return NextResponse.json({
      success: true,
      domains: domainsWithUsers,
      total: domainsWithUsers.length,
    });

  } catch (error) {
    console.error('[Admin Domains] Error:', error);
    
    if (error instanceof Error && error.message.includes('permisos de administrador')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Error al obtener dominios' },
      { status: 500 }
    );
  }
}

