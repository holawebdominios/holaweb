'use client';

import { useEffect, useState } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  ShoppingCart,
  User,
  Mail,
  Phone,
  Building,
  FileText,
  Calendar,
  CreditCard,
  Globe,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface OrderDetail {
  id: string;
  orderNumber: string;
  domain: string;
  period: number;
  amount: number;
  discount: number;
  total: number;
  status: string;
  paymentMethod: string;
  paymentId?: string;
  createdAt: any;
  paidAt?: any;
  userEmail?: string;
  userName?: string;
  metadata?: any;
}

interface UserData {
  email: string;
  name: string;
  phone?: string;
  company?: string;
  cuit?: string;
}

interface DomainData {
  domain: string;
  tld: string;
  status: string;
  registrationDate?: any;
  expirationDate?: any;
}

export default function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAdminAuth();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [domainData, setDomainData] = useState<DomainData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrderDetail();
  }, [params.id]);

  const loadOrderDetail = async () => {
    try {
      setLoading(true);
      const token = await user?.getIdToken();
      
      const response = await fetch(`/api/admin/orders/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
        setUserData(data.user);
        setDomainData(data.domain);
      } else {
        throw new Error('Error al cargar orden');
      }
    } catch (error) {
      console.error('Error cargando orden:', error);
      toast.error('Error al cargar orden');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '-';
    try {
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleDateString('es-AR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      }
      if (timestamp.seconds) {
        return new Date(timestamp.seconds * 1000).toLocaleDateString('es-AR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      }
      return new Date(timestamp).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '-';
    }
  };

  const getStatusBadge = (status: string) => {
    const config: any = {
      paid: { bg: 'bg-green-100', text: 'text-green-700', label: 'Pagado', icon: CheckCircle2 },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pendiente', icon: Clock },
      failed: { bg: 'bg-red-100', text: 'text-red-700', label: 'Fallido', icon: XCircle },
      cancelled: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Cancelado', icon: XCircle },
    };
    
    const statusConfig = config[status] || config.pending;
    const Icon = statusConfig.icon;
    
    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${statusConfig.bg} ${statusConfig.text}`}>
        <Icon className="h-4 w-4" />
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

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Orden no encontrada</p>
        <Link
          href="/admin/orders"
          className="mt-4 inline-block text-[#0066CC] hover:text-[#ff8800]"
        >
          ← Volver a órdenes
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/orders"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-6 w-6 text-gray-600" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Detalle de Orden</h1>
          <p className="text-gray-600 mt-1">#{order.orderNumber}</p>
        </div>
        {getStatusBadge(order.status)}
      </div>

      {/* Main Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información de la Orden */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-[#0066CC]" />
            Información de la Orden
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Número de Orden</p>
              <p className="font-semibold text-gray-900">{order.orderNumber}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">ID de Orden</p>
              <p className="font-mono text-sm text-gray-600">{order.id}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Dominio</p>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-[#0066CC]" />
                <p className="font-semibold text-gray-900">{order.domain}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Período</p>
              <p className="font-semibold text-gray-900">{order.period} meses</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Fecha de Creación</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <p className="text-sm text-gray-900">{formatDate(order.createdAt)}</p>
              </div>
            </div>

            {order.paidAt && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Fecha de Pago</p>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <p className="text-sm text-gray-900">{formatDate(order.paidAt)}</p>
                </div>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-500 mb-1">Método de Pago</p>
              <p className="text-sm text-gray-900 capitalize">{order.paymentMethod}</p>
            </div>

            {order.paymentId && (
              <div>
                <p className="text-sm text-gray-500 mb-1">ID de Pago</p>
                <p className="font-mono text-xs text-gray-600 break-all">{order.paymentId}</p>
              </div>
            )}
          </div>

          {/* Pricing Breakdown */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Desglose de Precio</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${order.amount.toLocaleString()}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Descuento</span>
                  <span>-${order.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>${order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Información del Cliente */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* Cliente */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-[#0066CC]" />
              Cliente
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Nombre</p>
                <p className="text-sm font-semibold text-gray-900">
                  {order.userName || order.metadata?.customerName || '-'}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Email</p>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <p className="text-sm font-semibold text-gray-900">
                    {order.userEmail || order.metadata?.customerEmail || '-'}
                  </p>
                </div>
              </div>

              {order.metadata?.customerPhone && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Teléfono</p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <p className="text-sm font-semibold text-gray-900">
                      {order.metadata.customerPhone}
                    </p>
                  </div>
                </div>
              )}

              {order.metadata?.customerCompany && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Empresa</p>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-400" />
                    <p className="text-sm font-semibold text-gray-900">
                      {order.metadata.customerCompany}
                    </p>
                  </div>
                </div>
              )}

              {order.metadata?.customerCuit && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">CUIT</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {order.metadata.customerCuit}
                  </p>
                </div>
              )}

              {userData && (
                <div className="pt-4 border-t border-gray-200">
                  <Link
                    href={`/admin/users/${userData.email}`}
                    className="text-sm text-[#0066CC] hover:text-[#ff8800] flex items-center gap-1"
                  >
                    Ver perfil completo <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Dominio Asociado */}
          {domainData && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5 text-[#0066CC]" />
                Dominio
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Dominio</p>
                  <p className="text-sm font-bold text-gray-900">{domainData.domain}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Estado</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    domainData.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {domainData.status === 'active' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                    {domainData.status === 'active' ? 'Activo' : 'Pendiente'}
                  </span>
                </div>

                {domainData.registrationDate && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Registro</p>
                    <p className="text-sm text-gray-900">{formatDate(domainData.registrationDate)}</p>
                  </div>
                )}

                {domainData.expirationDate && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Vencimiento</p>
                    <p className="text-sm text-gray-900">{formatDate(domainData.expirationDate)}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">Timeline</h2>

        <div className="space-y-4">
          {/* Creación */}
          <div className="flex items-start gap-4">
            <div className="mt-1 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <ShoppingCart className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Orden Creada</p>
              <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
            </div>
          </div>

          {/* Pago */}
          {order.status === 'paid' && order.paidAt && (
            <div className="flex items-start gap-4">
              <div className="mt-1 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Pago Confirmado</p>
                <p className="text-sm text-gray-500">{formatDate(order.paidAt)}</p>
                {order.paymentId && (
                  <p className="text-xs text-gray-400 mt-1">ID: {order.paymentId}</p>
                )}
              </div>
            </div>
          )}

          {/* Pendiente */}
          {order.status === 'pending' && (
            <div className="flex items-start gap-4">
              <div className="mt-1 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Esperando Pago</p>
                <p className="text-sm text-gray-500">La orden está pendiente de confirmación</p>
              </div>
            </div>
          )}

          {/* Fallido */}
          {order.status === 'failed' && (
            <div className="flex items-start gap-4">
              <div className="mt-1 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <XCircle className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Pago Fallido</p>
                <p className="text-sm text-gray-500">El pago no pudo ser procesado</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

