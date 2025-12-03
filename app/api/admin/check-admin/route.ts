import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { extractToken, isAdmin } from '@/lib/admin-auth';

/**
 * GET /api/admin/check-admin
 * Verifica si el usuario autenticado tiene rol de admin
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractToken(authHeader);

    if (!token || !adminAuth) {
      return NextResponse.json({ isAdmin: false }, { status: 401 });
    }

    // Verificar token
    const decodedToken = await adminAuth.verifyIdToken(token);

    // Verificar si es admin
    const userIsAdmin = await isAdmin(decodedToken.uid);

    return NextResponse.json({
      isAdmin: userIsAdmin,
      uid: decodedToken.uid,
    });
  } catch (error) {
    console.error('[Admin Check] Error:', error);
    return NextResponse.json({ isAdmin: false }, { status: 401 });
  }
}

