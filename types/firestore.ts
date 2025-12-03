import { Timestamp } from 'firebase/firestore';

/**
 * TIPOS PARA FIRESTORE
 * Estos tipos representan los documentos en las colecciones
 */

// ============================================
// USERS
// ============================================

export interface User {
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

export type CreateUserData = Omit<User, 'uid' | 'createdAt' | 'updatedAt'>;

// ============================================
// DOMAINS
// ============================================

export type DomainStatus = 'active' | 'expiring' | 'expired' | 'pending';

export interface Domain {
  id: string;
  userId: string;
  domain: string;            // "ejemplo.com.ar"
  tld: string;               // ".com.ar"
  status: DomainStatus;
  registrationDate?: Timestamp;
  expirationDate?: Timestamp;
  autoRenew: boolean;
  alertsEnabled: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type CreateDomainData = Omit<Domain, 'id' | 'createdAt' | 'updatedAt'>;

// ============================================
// ORDERS
// ============================================

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'cancelled';

export type PaymentMethod = 'mercadopago';

export interface Order {
  id: string;
  orderNumber: string;       // "ORD-12345"
  userId?: string;           // Opcional para checkout invitado
  domain: string;
  period: number;            // Años
  amount: number;            // Precio base
  discount: number;          // Descuento aplicado
  total: number;             // Total a pagar
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentId?: string;        // ID de Mercado Pago
  preferenceId?: string;     // Preference ID de Mercado Pago
  createdAt: Timestamp;
  paidAt?: Timestamp;
  metadata?: {
    customerEmail?: string;
    customerName?: string;
    customerPhone?: string;
    [key: string]: any;
  };
}

export type CreateOrderData = Omit<Order, 'id' | 'orderNumber' | 'status' | 'createdAt'>;

// ============================================
// ALERTS
// ============================================

export type AlertType = 'email' | 'whatsapp' | 'sms';

export interface Alert {
  id: string;
  domainId: string;
  userId: string;
  type: AlertType;
  daysBefore: number;        // 90, 60, 30, 7
  sent: boolean;
  sentAt?: Timestamp;
  createdAt: Timestamp;
}

export type CreateAlertData = Omit<Alert, 'id' | 'sent' | 'createdAt'>;

// ============================================
// REQUEST/RESPONSE TYPES
// ============================================

/**
 * Request para crear orden (desde frontend)
 * NUNCA incluir precio/total aquí - se calcula en backend
 */
export interface CreateOrderRequest {
  domain: string;
  periodId: 'PERIOD_1_YEAR' | 'PERIOD_2_YEARS' | 'PERIOD_3_YEARS';
  customerData?: {
    name: string;
    email: string;
    phone: string;
    company?: string;
    cuit?: string;
  };
}

/**
 * Response de crear orden
 */
export interface CreateOrderResponse {
  success: boolean;
  orderId: string;
  orderNumber: string;
  total: number;
  // Datos de Mercado Pago para redirección
  mercadopago: {
    init_point: string;      // URL de pago
    preferenceId: string;
  };
}

/**
 * Authenticated user info (desde token verificado)
 */
export interface AuthUser {
  uid: string;
  email?: string;
  emailVerified?: boolean;
}

