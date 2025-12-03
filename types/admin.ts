import { Timestamp } from 'firebase/firestore';
import { User, Order, Domain } from './firestore';

/**
 * TIPOS ESPECÍFICOS PARA EL PANEL ADMIN
 */

// ============================================
// ROLES Y PERMISOS
// ============================================

export type UserRole = 'user' | 'admin' | 'superadmin';

export interface AdminUser extends User {
  role: UserRole;
  isAdmin: boolean;
}

// ============================================
// STATS DEL DASHBOARD
// ============================================

export interface AdminStats {
  totalUsers: number;
  totalOrders: number;
  paidOrders: number;
  pendingOrders: number;
  failedOrders: number;
  totalRevenue: number;
  activeDomains: number;
  expiringDomains: number;
}

// ============================================
// FILTROS
// ============================================

export interface UserFilters {
  search?: string;
  plan?: string;
  role?: UserRole;
  sortBy?: 'createdAt' | 'email' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface OrderFilters {
  status?: string;
  search?: string; // busca en orderNumber, domain, email
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: 'createdAt' | 'total' | 'paidAt';
  sortOrder?: 'asc' | 'desc';
}

// ============================================
// USER DETAIL (ADMIN VIEW)
// ============================================

export interface UserDetail extends User {
  ordersCount: number;
  domainsCount: number;
  totalSpent: number;
  lastOrderDate?: Timestamp;
  recentOrders: Order[];
  recentDomains: Domain[];
}

// ============================================
// ORDER DETAIL (ADMIN VIEW)
// ============================================

export interface OrderDetail extends Order {
  userEmail?: string;
  userName?: string;
}

