import { 
  signInWithPopup, 
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './firebase-client';

// Verificar configuración
function checkFirebase() {
  if (!isFirebaseConfigured || !auth) {
    throw new Error('Firebase no está configurado. Ver docs/SETUP_FIREBASE_MP.md');
  }
}

/**
 * SERVICIO DE AUTENTICACIÓN (CLIENTE)
 * Funciones para login, registro y logout
 */

// ============================================
// GOOGLE AUTH
// ============================================

/**
 * Login con Google usando popup
 */
export async function signInWithGoogle(): Promise<FirebaseUser> {
  checkFirebase();
  
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account',
  });
  
  try {
    const result = await signInWithPopup(auth!, provider);
    
    // Después del login, crear/actualizar usuario en Firestore
    await syncUserToFirestore(result.user);
    
    return result.user;
  } catch (error: any) {
    console.error('Error en login con Google:', error);
    throw new Error(error.message || 'Error al iniciar sesión con Google');
  }
}

// ============================================
// EMAIL + PASSWORD AUTH
// ============================================

/**
 * Registro con email y contraseña
 */
export async function registerWithEmail(
  email: string, 
  password: string, 
  name: string
): Promise<FirebaseUser> {
  checkFirebase();
  
  try {
    const result = await createUserWithEmailAndPassword(auth!, email, password);
    
    // Crear usuario en Firestore y vincular dominios si los hay
    await syncUserToFirestore(result.user, { name, isNewUser: true });
    
    return result.user;
  } catch (error: any) {
    console.error('Error en registro:', error);
    
    // Mensajes de error más amigables
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('Este email ya está registrado');
    }
    if (error.code === 'auth/weak-password') {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }
    
    throw new Error(error.message || 'Error al registrar usuario');
  }
}

/**
 * Login con email y contraseña
 */
export async function loginWithEmail(email: string, password: string): Promise<FirebaseUser> {
  checkFirebase();
  
  try {
    const result = await signInWithEmailAndPassword(auth!, email, password);
    return result.user;
  } catch (error: any) {
    console.error('Error en login:', error);
    
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      throw new Error('Email o contraseña incorrectos');
    }
    
    throw new Error(error.message || 'Error al iniciar sesión');
  }
}

// ============================================
// LOGOUT
// ============================================

/**
 * Cierra la sesión del usuario
 */
export async function signOut(): Promise<void> {
  checkFirebase();
  
  try {
    await firebaseSignOut(auth!);
  } catch (error: any) {
    console.error('Error en logout:', error);
    throw new Error(error.message || 'Error al cerrar sesión');
  }
}

// ============================================
// OBTENER ID TOKEN
// ============================================

/**
 * Obtiene el ID token del usuario actual
 * Este token se usa para autenticar requests al backend
 */
export async function getIdToken(): Promise<string | null> {
  if (!auth) return null;
  
  const user = auth.currentUser;
  
  if (!user) {
    return null;
  }
  
  try {
    const token = await user.getIdToken();
    return token;
  } catch (error) {
    console.error('Error obteniendo ID token:', error);
    return null;
  }
}

/**
 * Obtiene el usuario actual
 */
export function getCurrentUser(): FirebaseUser | null {
  return auth?.currentUser || null;
}

/**
 * Observador de cambios en el estado de autenticación
 */
export function onAuthChange(callback: (user: FirebaseUser | null) => void) {
  if (!auth) {
    // Si Firebase no está configurado, llamar callback con null
    callback(null);
    return () => {}; // Retornar función vacía para unsubscribe
  }
  
  return onAuthStateChanged(auth!, callback);
}

// ============================================
// HELPERS
// ============================================

/**
 * Sincroniza el usuario de Firebase Auth con Firestore
 * Se llama después de login/registro para crear/actualizar el documento
 * También vincula dominios comprados con el email del usuario
 */
async function syncUserToFirestore(
  user: FirebaseUser, 
  additionalData?: { name?: string; isNewUser?: boolean }
): Promise<void> {
  try {
    const token = await user.getIdToken();
    
    // Llamar al backend para crear/actualizar el usuario en Firestore
    const response = await fetch('/api/auth/sync-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: additionalData?.name || user.displayName || user.email?.split('@')[0] || 'Usuario',
        isNewUser: additionalData?.isNewUser || false,
      }),
    });
    
    const data = await response.json();
    
    // Si se vincularon dominios, mostrar notificación
    if (data.linkedDomains && data.linkedDomains > 0) {
      console.log(`Se vincularon ${data.linkedDomains} dominios a tu cuenta`);
    }
  } catch (error) {
    console.error('Error sincronizando usuario:', error);
    // No lanzar error aquí, el login ya fue exitoso
  }
}

