import { adminAuth, adminDb } from './firebase-admin';
import { DecodedIdToken } from 'firebase-admin/auth';

/**
 * UTILIDADES DE AUTENTICACIÓN PARA ADMIN
 * Verificación de roles y permisos de administrador
 */

/**
 * Verifica si un usuario tiene rol de administrador
 * SOLO verifica custom claims en Firebase Auth
 */
export async function isAdmin(uid: string): Promise<boolean> {
  if (!adminAuth) {
    console.error('[Admin Auth] Firebase no está configurado');
    return false;
  }

  try {
    // Verificar SOLO custom claims
    const user = await adminAuth.getUser(uid);
    const isUserAdmin = user.customClaims?.admin === true;
    
    console.log('[Admin Auth] Verificando admin para UID:', uid);
    console.log('[Admin Auth] Custom claims:', user.customClaims);
    console.log('[Admin Auth] Es admin:', isUserAdmin);
    
    return isUserAdmin;
  } catch (error) {
    console.error('[Admin Auth] Error verificando admin:', error);
    return false;
  }
}

/**
 * Verifica token y que sea admin
 * Lanza error si no cumple
 */
export async function requireAdmin(token: string): Promise<DecodedIdToken> {
  if (!adminAuth) {
    throw new Error('Firebase Admin no está configurado');
  }

  try {
    // Verificar token
    const decodedToken = await adminAuth.verifyIdToken(token);

    // Verificar que sea admin
    const isUserAdmin = await isAdmin(decodedToken.uid);

    if (!isUserAdmin) {
      throw new Error('Acceso denegado: se requieren permisos de administrador');
    }

    return decodedToken;
  } catch (error) {
    if (error instanceof Error && error.message.includes('permisos de administrador')) {
      throw error;
    }
    throw new Error('Token inválido o expirado');
  }
}

/**
 * Extrae token del header Authorization
 */
export function extractToken(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Establece custom claim de admin para un usuario
 * SOLO usar esto para crear el primer admin
 */
export async function setAdminClaim(uid: string, isAdmin: boolean = true): Promise<void> {
  if (!adminAuth) {
    throw new Error('Firebase Admin no está configurado');
  }

  try {
    await adminAuth.setCustomUserClaims(uid, { admin: isAdmin });
    console.log(`[Admin Auth] Custom claim 'admin' establecido para ${uid}`);
  } catch (error) {
    console.error('[Admin Auth] Error estableciendo custom claim:', error);
    throw error;
  }
}

/**
 * Actualiza rol en Firestore (OPCIONAL - ya no se usa para verificación)
 */
export async function setAdminRole(uid: string, role: 'user' | 'admin' | 'superadmin'): Promise<void> {
  if (!adminDb) {
    console.log('[Admin Auth] Firestore no está configurado, omitiendo actualización de rol');
    return;
  }

  try {
    await adminDb.collection('users').doc(uid).set({
      role,
      updatedAt: new Date(),
    }, { merge: true });
    console.log(`[Admin Auth] Rol '${role}' establecido en Firestore para ${uid}`);
  } catch (error) {
    console.error('[Admin Auth] Error estableciendo rol:', error);
    // No lanzar error, ya que esto es opcional
  }
}

