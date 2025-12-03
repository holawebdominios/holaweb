import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/firebase-admin';
import { createUser, getUserByUid, updateUser } from '@/lib/firestore-utils';
import { linkPurchasedDomains } from '@/lib/domain-linking';
import { z } from 'zod';

const syncUserSchema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  isNewUser: z.boolean().optional(),
});

/**
 * POST /api/auth/sync-user
 * Sincroniza el usuario de Firebase Auth con Firestore
 * Se llama después de login/registro exitoso
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const authUser = await requireAuth(request);
    
    // Validar body
    const body = await request.json();
    const { name, isNewUser } = syncUserSchema.parse(body);
    
    // Verificar si el usuario ya existe en Firestore
    const existingUser = await getUserByUid(authUser.uid);
    
    let linkedDomains = 0;
    
    if (existingUser) {
      // Usuario ya existe, actualizar si es necesario
      await updateUser(authUser.uid, {
        email: authUser.email || existingUser.email,
        emailVerified: authUser.emailVerified || false,
      });
      
      return NextResponse.json({
        success: true,
        action: 'updated',
        linkedDomains,
      });
    } else {
      // Crear nuevo usuario en Firestore
      await createUser(authUser.uid, {
        email: authUser.email || '',
        name,
        plan: 'basic',
        emailVerified: authUser.emailVerified || false,
      });
      
      // Si es un nuevo usuario, intentar vincular dominios comprados previamente
      if (isNewUser && authUser.email) {
        try {
          linkedDomains = await linkPurchasedDomains(authUser.uid, authUser.email);
          
          if (linkedDomains > 0) {
            console.log(`[Sync User] Vinculados ${linkedDomains} elementos al nuevo usuario`);
          }
        } catch (linkError) {
          console.error('[Sync User] Error vinculando dominios:', linkError);
          // No fallar el registro por esto
        }
      }
      
      return NextResponse.json({
        success: true,
        action: 'created',
        linkedDomains,
      });
    }
    
  } catch (error) {
    console.error('Error sincronizando usuario:', error);
    
    if (error instanceof Error && error.message === 'Autenticación requerida') {
      return NextResponse.json(
        { success: false, error: 'No autenticado' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Error al sincronizar usuario' },
      { status: 500 }
    );
  }
}

