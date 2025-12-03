import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

// Verificar si Firebase Admin está configurado
const isAdminConfigured = 
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY;

// Singleton pattern para Firebase Admin
let adminApp: App | undefined;
let adminAuth: Auth | undefined;
let adminDb: Firestore | undefined;

/**
 * Inicializa Firebase Admin (solo se ejecuta una vez)
 */
function initAdmin() {
  if (!isAdminConfigured) {
    return; // No inicializar si no está configurado
  }
  
  try {
    if (getApps().length > 0) {
      adminApp = getApps()[0];
    } else {
      // Inicializar con service account
      const privateKey = process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n');

      adminApp = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID!,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
          privateKey: privateKey,
        }),
      });
    }

    adminAuth = getAuth(adminApp);
    adminDb = getFirestore(adminApp);
  } catch (error) {
    console.error('Error inicializando Firebase Admin:', error);
  }
}

// Inicializar al cargar el módulo
initAdmin();

/**
 * Verifica un ID token de Firebase Auth y devuelve el usuario
 * ESTA ES LA FUNCIÓN PRINCIPAL PARA AUTENTICACIÓN EN EL BACKEND
 */
export async function verifyIdToken(idToken: string) {
  if (!adminAuth) {
    throw new Error('Firebase Admin no está configurado');
  }
  
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
    };
  } catch (error) {
    console.error('Error verificando ID token:', error);
    throw new Error('Token inválido o expirado');
  }
}

/**
 * Obtiene el usuario autenticado desde el request
 * Busca el token en el header Authorization
 */
export async function getAuthUserFromRequest(request: Request) {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No autenticado');
  }
  
  const token = authHeader.substring(7);
  return await verifyIdToken(token);
}

/**
 * Middleware para verificar autenticación en Route Handlers
 * Uso: const user = await requireAuth(request);
 */
export async function requireAuth(request: Request) {
  try {
    return await getAuthUserFromRequest(request);
  } catch (error) {
    throw new Error('Autenticación requerida');
  }
}

/**
 * Middleware opcional: permite usuario autenticado o invitado
 */
export async function optionalAuth(request: Request) {
  try {
    return await getAuthUserFromRequest(request);
  } catch (error) {
    return null; // Usuario no autenticado
  }
}

export { adminAuth, adminDb, isAdminConfigured };

