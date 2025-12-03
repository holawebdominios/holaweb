import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/auth/logout
 * Endpoint simple para cerrar sesión
 * El logout real se hace client-side con Firebase
 */
export async function POST(request: NextRequest) {
  // Este endpoint existe solo para que el código no falle
  // El logout real se maneja en el cliente con signOut()
  return NextResponse.json({ success: true });
}

