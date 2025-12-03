'use client';

import { useEffect, useState } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building,
  FileText,
  Calendar,
  ShoppingCart,
  Globe,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface UserDetail {
  id: string;
  uid: string;
  email: string;
  name: string;
  phone?: string;
  company?: string;
  cuit?: string;
  role?: string;
  plan?: string;
  createdAt: any;
  ordersCount: number;
  domainsCount: number;
  totalSpent: number;
  lastOrderDate?: any;
}

interface Order {
  id: string;
  orderNumber: string;
  domain: string;
  total: number;
  status: string;
  createdAt: any;
}

interface Domain {
  id: string;
  domain: string;
  tld: string;
  status: string;
  registrationDate?: any;
  expirationDate?: any;
}

export default function AdminUserDetailPage({ params }: { params: { uid: string } }) {
  const { user } = useAdminAuth();
  const router = useRouter();
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserDetail();
  }, [params.uid]);

  const loadUserDetail = async () => {
    try {
      setLoading(true);
      const token = await user?.getIdToken();
      
      const response = await fetch(`/api/admin/users/${params.uid}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserDetail(data.user);
        setOrders(data.orders || []);
        setDomains(data.domains || []);
      } else {
        throw new Error('Error al cargar usuario');
      }
    } catch (error) {
      console.error('Error cargando usuario:', error);
      toast.error('Error al cargar usuario');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '-';
    try {
      if (timestamp.toDate) return timestamp.toDate().toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' });
      if (timestamp.seconds) return new Date(timestamp.seconds * 1000).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' });
      return new Date(timestamp).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' });
    } catch {
      return '-';
    }
  };

  const getRoleBadge = (role?: string) => {
    const config: any = {
      admin: { bg: 'bg-red-100', text: 'text-red-700', label: 'Admin' },
      user: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Usuario' },
    };
    
    const { bg, text, label } = config[role || 'user'] || config.user;
    
    return (
      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
        {label}
      </span>
    );
  };

  const getPlanBadge = (plan?: string) => {
    const config: any = {
      basic: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Basic' },
      pro: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Pro' },
      enterprise: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Enterprise' },
    };
    
    const { bg, text, label } = config[plan || 'basic'] || config.basic;
    
    return (
      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
        {label}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const config: any = {
      paid: { bg: 'bg-green-100', text: 'text-green-700', label: 'Pagado', icon: CheckCircle2 },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pendiente', icon: Clock },
      failed: { bg: 'bg-red-100', text: 'text-red-700', label: 'Fallido', icon: XCircle },
      active: { bg: 'bg-green-100', text: 'text-green-700', label: 'Activo', icon: CheckCircle2 },
    };
    
    const statusConfig = config[status] || config.pending;
    const Icon = statusConfig.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
        <Icon className="h-3 w-3" />
        {statusConfig.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#0066CC]" />
      </div>
    );
  }

  if (!userDetail) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Usuario no encontrado</p>
        <Link
          href="/admin/users"
          className="mt-4 inline-block text-[#0066CC] hover:text-[#ff8800]"
        >
          ← Volver a usuarios
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/users"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-6 w-6 text-gray-600" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Detalle de Usuario</h1>
          <p className="text-gray-600 mt-1">{userDetail.email}</p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Órdenes</p>
              <p className="text-3xl font-bold text-gray-900">{userDetail.ordersCount}</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-purple-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Dominios</p>
              <p className="text-3xl font-bold text-gray-900">{userDetail.domainsCount}</p>
            </div>
            <Globe className="h-8 w-8 text-orange-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Gastado</p>
              <p className="text-2xl font-bold text-gray-900">
                ${userDetail.totalSpent.toLocaleString()}
              </p>
            </div>
            <FileText className="h-8 w-8 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Miembro desde</p>
              <p className="text-sm font-semibold text-gray-900">
                {formatDate(userDetail.createdAt)}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </motion.div>
      </div>

      {/* User Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-[#0066CC]" />
            Información Personal
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Email</p>
              <p className="text-sm font-semibold text-gray-900">{userDetail.email}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Nombre</p>
              <p className="text-sm font-semibold text-gray-900">{userDetail.name}</p>
            </div>

            {userDetail.phone && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Teléfono</p>
                <p className="text-sm font-semibold text-gray-900">{userDetail.phone}</p>
              </div>
            )}

            {userDetail.company && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Empresa</p>
                <p className="text-sm font-semibold text-gray-900">{userDetail.company}</p>
              </div>
            )}

            {userDetail.cuit && (
              <div>
                <p className="text-xs text-gray-500 mb-1">CUIT</p>
                <p className="text-sm font-semibold text-gray-900">{userDetail.cuit}</p>
              </div>
            )}

            <div>
              <p className="text-xs text-gray-500 mb-1">Plan</p>
              {getPlanBadge(userDetail.plan)}
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Rol</p>
              {getRoleBadge(userDetail.role)}
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">UID</p>
              <p className="text-xs font-mono text-gray-600 break-all">{userDetail.uid}</p>
            </div>
          </div>
        </motion.div>

        {/* Orders & Domains */}
        <div className="lg:col-span-2 space-y-6">
          {/* Órdenes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-[#0066CC]" />
              Órdenes ({orders.length})
            </h2>

            {orders.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No tiene órdenes</p>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:border-[#0066CC] hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{order.domain}</p>
                        <p className="text-sm text-gray-500">#{order.orderNumber}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold text-gray-900">${order.total.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>

          {/* Dominios */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5 text-[#0066CC]" />
              Dominios ({domains.length})
            </h2>

            {domains.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No tiene dominios</p>
            ) : (
              <div className="space-y-3">
                {domains.map((domain) => (
                  <div
                    key={domain.id}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{domain.domain}</p>
                        <p className="text-sm text-gray-500">TLD: {domain.tld}</p>
                      </div>
                      {getStatusBadge(domain.status)}
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500">Registro</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatDate(domain.registrationDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Vencimiento</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatDate(domain.expirationDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

