import { adminDb } from './firebase-admin';

/**
 * VINCULACIÓN DE DOMINIOS
 * Permite vincular dominios comprados sin cuenta a un usuario que se registra después
 */

/**
 * Vincula dominios comprados con un email a un usuario registrado
 * Se llama cuando un usuario se registra con un email que tiene compras previas
 * 
 * @param userId - UID del usuario recién registrado
 * @param email - Email del usuario
 */
export async function linkPurchasedDomains(userId: string, email: string): Promise<number> {
  if (!adminDb) {
    throw new Error('Firestore no está configurado');
  }
  
  try {
    let linkedCount = 0;
    
    // 1. Buscar órdenes pagadas sin userId pero con el email del usuario
    const ordersSnapshot = await adminDb
      .collection('orders')
      .where('status', '==', 'paid')
      .where('metadata.customerEmail', '==', email)
      .get();
    
    if (ordersSnapshot.empty) {
      return 0; // No hay órdenes para vincular
    }
    
    // 2. Actualizar cada orden para vincularla al usuario
    const batch = adminDb.batch();
    
    ordersSnapshot.docs.forEach(doc => {
      const order = doc.data();
      
      // Solo vincular si no tiene userId o si el userId es diferente
      if (!order.userId) {
        batch.update(doc.ref, { userId });
        linkedCount++;
      }
    });
    
    await batch.commit();
    
    console.log(`[Domain Linking] Vinculadas ${linkedCount} órdenes al usuario ${userId}`);
    
    // 3. Buscar dominios sin userId con el mismo email en metadata
    const domainsSnapshot = await adminDb
      .collection('domains')
      .where('status', '==', 'active')
      .get();
    
    const domainBatch = adminDb.batch();
    let domainsLinked = 0;
    
    // Filtrar dominios que no tienen userId
    domainsSnapshot.docs.forEach(doc => {
      const domain = doc.data();
      
      if (!domain.userId) {
        // Buscar si hay una orden con este dominio y el email del usuario
        const matchingOrder = ordersSnapshot.docs.find(
          orderDoc => orderDoc.data().domain === domain.domain
        );
        
        if (matchingOrder) {
          domainBatch.update(doc.ref, { userId });
          domainsLinked++;
        }
      }
    });
    
    if (domainsLinked > 0) {
      await domainBatch.commit();
      console.log(`[Domain Linking] Vinculados ${domainsLinked} dominios al usuario ${userId}`);
    }
    
    return linkedCount + domainsLinked;
    
  } catch (error) {
    console.error('[Domain Linking] Error vinculando dominios:', error);
    throw error;
  }
}

/**
 * Verifica si un email tiene compras pendientes de vincular
 */
export async function hasPendingPurchases(email: string): Promise<boolean> {
  if (!adminDb) {
    return false;
  }
  
  try {
    const snapshot = await adminDb
      .collection('orders')
      .where('status', '==', 'paid')
      .where('metadata.customerEmail', '==', email)
      .limit(1)
      .get();
    
    return !snapshot.empty && snapshot.docs[0].data().userId === undefined;
  } catch (error) {
    console.error('[Domain Linking] Error verificando compras:', error);
    return false;
  }
}

