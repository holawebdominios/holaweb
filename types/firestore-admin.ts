import { Timestamp } from 'firebase-admin/firestore';

/**
 * TIPOS PARA FIREBASE ADMIN SDK
 * Estos tipos son para documentos obtenidos desde el Admin SDK
 * Los Timestamps de Admin SDK tienen método toMillis()
 */

// ============================================
// USERS (Admin SDK)
// ============================================

export interface AdminUser {
  uid: string;
  email: string;
  name: string;
  phone?: string;
  company?: string;
  cuit?: string;
  plan: 'basic' | 'pro' | 'enterprise';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  emailVerified: boolean;
}

// ============================================
// DOMAINS (Admin SDK)
// ============================================

export type AdminDomainStatus = 'active' | 'expiring' | 'expired' | 'pending';

export interface AdminDomain {
  id: string;
  userId: string;
  domain: string;
  tld: string;
  status: AdminDomainStatus;
  registrationDate?: Timestamp;
  expirationDate?: Timestamp;
  autoRenew: boolean;
  alertsEnabled: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================
// ORDERS (Admin SDK)
// ============================================

export type AdminOrderStatus = 'pending' | 'paid' | 'failed' | 'cancelled';

export type AdminPaymentMethod = 'mercadopago';

export interface AdminOrder {
  id: string;
  orderNumber: string;
  userId?: string;
  domain: string;
  period: number;
  amount: number;
  discount: number;
  total: number;
  status: AdminOrderStatus;
  paymentMethod: AdminPaymentMethod;
  paymentId?: string;
  preferenceId?: string;
  createdAt: Timestamp;
  paidAt?: Timestamp;
  metadata?: {
    customerEmail?: string;
    customerName?: string;
    customerPhone?: string;
    [key: string]: any;
  };
}

// ============================================
// HELPER TYPES
// ============================================

/**
 * Tipo helper para documentos de Firestore con id
 */
export type FirestoreDoc<T> = T & { id: string };

/**
 * Tipo helper para documentos con información adicional de usuario
 */
export interface WithUserInfo {
  userEmail?: string | null;
  userName?: string | null;
}

