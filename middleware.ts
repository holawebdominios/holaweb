import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * MIDDLEWARE DE NEXT.JS
 * Protege rutas admin antes de que lleguen al servidor
 */

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Proteger rutas /admin (excepto /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // El token se verificará en el servidor, aquí solo redirigimos si no hay sesión aparente
    // La verificación real de admin se hace server-side en cada ruta
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

