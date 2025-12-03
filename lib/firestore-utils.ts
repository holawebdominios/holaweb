import { adminDb } from './firebase-admin';
import { 
  User, 
  CreateUserData, 
  Domain, 
  CreateDomainData, 
  Order, 
  CreateOrderData,
  OrderStatus 
} from '@/types/firestore';
import { Timestamp } from 'firebase-admin/firestore';

// ============================================
// USERS
// ============================================

/**
 * Crea un usuario en Firestore
 * Se llama después de crear el usuario en Firebase Auth
 */
export async function createUser(uid: string, data: CreateUserData): Promise<void> {
  if (!adminDb) {
    throw new Error('Firestore no está configurado');
  }
  
  const now = Timestamp.now();
  
  const userData: any = {
    uid,
    ...data,
    plan: data.plan || 'basic',
    createdAt: now,
    updatedAt: now,
  };

  await adminDb.collection('users').doc(uid).set(userData);
}

/**
 * Obtiene un usuario por UID
 */
export async function getUserByUid(uid: string): Promise<User | null> {
  if (!adminDb) {
    throw new Error('Firestore no está configurado');
  }
  
  const doc = await adminDb.collection('users').doc(uid).get();
  
  if (!doc.exists) {
    return null;
  }
  
  return doc.data() as User;
}

/**
 * Actualiza datos de un usuario
 */
export async function updateUser(uid: string, data: Partial<User>): Promise<void> {
  if (!adminDb) {
    throw new Error('Firestore no está configurado');
  }
  
  await adminDb.collection('users').doc(uid).update({
    ...data,
    updatedAt: Timestamp.now(),
  });
}

// ============================================
// ORDERS
// ============================================

/**
 * Genera un número de orden único
 */
function generateOrderNumber(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp}-${random}`;
}

/**
 * Crea una orden en Firestore
 * IMPORTANTE: Los precios ya deben venir calculados desde el backend
 */
export async function createOrder(data: CreateOrderData): Promise<{ id: string; orderNumber: string }> {
  const now = Timestamp.now();
  const orderNumber = generateOrderNumber();
  
  // Construir orderData sin campos undefined (Firestore no los acepta)
  const orderData: any = {
    orderNumber,
    status: 'pending',
    domain: data.domain,
    period: data.period,
    amount: data.amount,
    discount: data.discount,
    total: data.total,
    paymentMethod: data.paymentMethod,
    createdAt: now,
  };
  
  // Solo agregar userId si existe (checkout invitado puede no tenerlo)
  if (data.userId) {
    orderData.userId = data.userId;
  }
  
  // Solo agregar campos opcionales si existen
  if (data.preferenceId) orderData.preferenceId = data.preferenceId;
  if (data.paymentId) orderData.paymentId = data.paymentId;
  if (data.metadata) orderData.metadata = data.metadata;

  const docRef = await adminDb!.collection('orders').add(orderData);
  
  return {
    id: docRef.id,
    orderNumber,
  };
}

/**
 * Obtiene una orden por ID
 * Verifica que pertenezca al usuario si se proporciona uid
 */
export async function getOrderById(orderId: string, uid?: string): Promise<Order | null> {
  if (!adminDb) {
    throw new Error('Firestore no está configurado');
  }
  
  const doc = await adminDb.collection('orders').doc(orderId).get();
  
  if (!doc.exists) {
    return null;
  }
  
  const order = { id: doc.id, ...doc.data() } as Order;
  
  // Verificar autorización si se proporciona uid
  if (uid && order.userId !== uid) {
    throw new Error('No autorizado para ver esta orden');
  }
  
  return order;
}

/**
 * Actualiza el estado de una orden
 */
export async function updateOrderStatus(
  orderId: string, 
  status: OrderStatus, 
  updates?: Partial<Order>
): Promise<void> {
  if (!adminDb) {
    throw new Error('Firestore no está configurado');
  }
  
  await adminDb.collection('orders').doc(orderId).update({
    status,
    ...updates,
  });
}

/**
 * Marca una orden como pagada
 */
export async function markOrderAsPaid(orderId: string, paymentId: string): Promise<void> {
  if (!adminDb) {
    throw new Error('Firestore no está configurado');
  }
  
  await adminDb.collection('orders').doc(orderId).update({
    status: 'paid',
    paymentId,
    paidAt: Timestamp.now(),
  });
}

/**
 * Obtiene todas las órdenes de un usuario
 */
export async function getUserOrders(uid: string): Promise<Order[]> {
  if (!adminDb) {
    console.error('[Firestore] Admin DB no configurado');
    return []; // Devolver array vacío en lugar de error
  }
  
  try {
    const snapshot = await adminDb
      .collection('orders')
      .where('userId', '==', uid)
      .get();
    
    // Ordenar en el cliente en lugar de la query
    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Order[];
    
    // Ordenar por createdAt descendente
    return orders.sort((a, b) => {
      const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
      const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
      return bTime - aTime;
    });
  } catch (error) {
    console.error('[Firestore] Error obteniendo órdenes:', error);
    return []; // Devolver array vacío en caso de error
  }
}

// ============================================
// DOMAINS
// ============================================

/**
 * Crea un dominio asociado a un usuario
 */
export async function createDomain(data: CreateDomainData): Promise<string> {
  if (!adminDb) {
    throw new Error('Firestore no está configurado');
  }
  
  const now = Timestamp.now();
  
  const domainData: any = {
    ...data,
    status: data.status || 'pending',
    autoRenew: data.autoRenew ?? false,
    alertsEnabled: data.alertsEnabled ?? true,
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await adminDb.collection('domains').add(domainData);
  return docRef.id;
}

/**
 * Obtiene todos los dominios de un usuario
 */
export async function getUserDomains(uid: string): Promise<Domain[]> {
  if (!adminDb) {
    console.error('[Firestore] Admin DB no configurado');
    return []; // Devolver array vacío en lugar de error
  }
  
  try {
    const snapshot = await adminDb
      .collection('domains')
      .where('userId', '==', uid)
      .get();
    
    // Ordenar en el cliente en lugar de la query
    const domains = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Domain[];
    
    // Ordenar por createdAt descendente
    return domains.sort((a, b) => {
      const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
      const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
      return bTime - aTime;
    });
  } catch (error) {
    console.error('[Firestore] Error obteniendo dominios:', error);
    return []; // Devolver array vacío en caso de error
  }
}

/**
 * Actualiza el estado de un dominio
 */
export async function updateDomainStatus(domainId: string, status: string): Promise<void> {
  if (!adminDb) {
    throw new Error('Firestore no está configurado');
  }
  
  await adminDb.collection('domains').doc(domainId).update({
    status,
    updatedAt: Timestamp.now(),
  });
}

/**
 * Activa un dominio después de un pago exitoso
 */
export async function activateDomain(
  userId: string, 
  domain: string, 
  tld: string, 
  years: number
): Promise<string> {
  const now = Timestamp.now();
  const expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + years);

  const domainData: any = {
    userId,
    domain,
    tld,
    status: 'active',
    registrationDate: now,
    expirationDate: Timestamp.fromDate(expirationDate),
    autoRenew: false,
    alertsEnabled: true,
  };

  return await createDomain(domainData);
}

