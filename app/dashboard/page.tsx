'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Calendar, 
  CreditCard, 
  User, 
  Mail, 
  Phone, 
  Building, 
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  Loader2,
  Headphones,
  MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { integralCF } from '@/styles/fonts';
import { Order, Domain } from '@/types/firestore';
import { toast } from 'sonner';

interface Stats {
  totalDomains: number;
  activeDomains: number;
  totalOrders: number;
  totalSpent: number;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalDomains: 0,
    activeDomains: 0,
    totalOrders: 0,
    totalSpent: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      loadDashboardData();
    }
  }, [user, loading, router]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      const token = await user?.getIdToken();
      
      let loadedOrders: Order[] = [];
      let loadedDomains: Domain[] = [];
      
      // Cargar órdenes
      try {
        const ordersResponse = await fetch('/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          loadedOrders = ordersData.orders || [];
          setOrders(loadedOrders);
        }
      } catch (err) {
        console.error('Error cargando órdenes:', err);
      }
      
      // Cargar dominios
      try {
        const domainsResponse = await fetch('/api/domains', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (domainsResponse.ok) {
          const domainsData = await domainsResponse.json();
          loadedDomains = domainsData.domains || [];
          setDomains(loadedDomains);
        }
      } catch (err) {
        console.error('Error cargando dominios:', err);
      }
      
      // Calcular stats
      const totalOrders = loadedOrders.length;
      const totalDomains = loadedDomains.length;
      const activeDomains = loadedDomains.filter((d: Domain) => d.status === 'active').length;
      const totalSpent = loadedOrders
        .filter((o: Order) => o.status === 'paid')
        .reduce((sum: number, o: Order) => sum + o.total, 0);
      
      setStats({
        totalDomains,
        activeDomains,
        totalOrders,
        totalSpent,
      });
      
    } catch (error) {
      console.error('Error cargando dashboard:', error);
      toast.error('Error al cargar datos');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-[#ff9900]" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '-';
    
    try {
      // Si es un Timestamp de Firestore
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleDateString('es-AR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        });
      }
      
      // Si es un objeto con seconds
      if (timestamp.seconds) {
        return new Date(timestamp.seconds * 1000).toLocaleDateString('es-AR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        });
      }
      
      // Si es una fecha ISO string
      if (typeof timestamp === 'string') {
        return new Date(timestamp).toLocaleDateString('es-AR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        });
      }
      
      // Si es un Date
      return new Date(timestamp).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    } catch (error) {
      console.error('Error formateando fecha:', error, timestamp);
      return '-';
    }
  };

  const getOrderStatusBadge = (status: string) => {
    const config = {
      paid: { icon: CheckCircle2, text: 'Pagado', bg: 'bg-green-100', textColor: 'text-green-700' },
      pending: { icon: Clock, text: 'Pendiente', bg: 'bg-yellow-100', textColor: 'text-yellow-700' },
      failed: { icon: XCircle, text: 'Fallido', bg: 'bg-red-100', textColor: 'text-red-700' },
    };
    
    const statusConfig = config[status as keyof typeof config] || config.pending;
    const Icon = statusConfig.icon;
    
    return (
      <span className={cn('inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium', statusConfig.bg, statusConfig.textColor)}>
        <Icon className="h-4 w-4" />
        {statusConfig.text}
      </span>
    );
  };

  const getDomainStatusBadge = (status: string) => {
    const config = {
      active: { icon: CheckCircle2, text: 'Activo', bg: 'bg-green-100', textColor: 'text-green-700' },
      pending: { icon: Clock, text: 'Pendiente', bg: 'bg-yellow-100', textColor: 'text-yellow-700' },
      expired: { icon: XCircle, text: 'Expirado', bg: 'bg-red-100', textColor: 'text-red-700' },
    };
    
    const statusConfig = config[status as keyof typeof config] || config.pending;
    const Icon = statusConfig.icon;
    
    return (
      <span className={cn('inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium', statusConfig.bg, statusConfig.textColor)}>
        <Icon className="h-4 w-4" />
        {statusConfig.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn([integralCF.className, 'text-4xl font-bold text-gray-900 mb-2'])}
          >
            Mi Dashboard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600"
          >
            Bienvenido, {user.displayName || user.email}
          </motion.p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Dominios Totales</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalDomains}</p>
              </div>
              <div className="bg-[#ff9900]/10 p-4 rounded-xl">
                <Globe className="h-8 w-8 text-[#ff9900]" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Dominios Activos</p>
                <p className="text-3xl font-bold text-green-600">{stats.activeDomains}</p>
              </div>
              <div className="bg-green-100 p-4 rounded-xl">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Órdenes</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-xl">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Invertido</p>
                <p className="text-3xl font-bold text-gray-900">${stats.totalSpent.toLocaleString()}</p>
              </div>
              <div className="bg-purple-100 p-4 rounded-xl">
                <CreditCard className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Principal - Dominios y Órdenes */}
          <div className="lg:col-span-2 space-y-8">
            {/* Mis Dominios */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Globe className="h-6 w-6 text-[#ff9900]" />
                  Mis Dominios
                </h2>
              </div>

              {domains.length === 0 ? (
                <div className="text-center py-12">
                  <Globe className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No tenés dominios registrados aún</p>
                  <button
                    onClick={() => router.push('/')}
                    className="px-6 py-3 bg-gradient-to-r from-[#ff9900] to-[#ff6600] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Buscar Dominio
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {domains.map((domain, index) => (
                    <motion.div
                      key={domain.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="border border-gray-200 rounded-xl p-5 hover:border-[#ff9900] hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-[#ff9900]/10 p-3 rounded-lg">
                            <Globe className="h-6 w-6 text-[#ff9900]" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">{domain.domain}</h3>
                            <p className="text-sm text-gray-500">TLD: {domain.tld}</p>
                          </div>
                        </div>
                        {getDomainStatusBadge(domain.status)}
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Fecha de Registro</p>
                          <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(domain.registrationDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Fecha de Vencimiento</p>
                          <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(domain.expirationDate)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Mis Órdenes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="h-6 w-6 text-[#ff9900]" />
                  Mis Órdenes
                </h2>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No tenés órdenes registradas</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="border border-gray-200 rounded-xl p-5 hover:border-[#ff9900] hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{order.domain}</h3>
                          <p className="text-sm text-gray-500">Orden #{order.orderNumber}</p>
                        </div>
                        {getOrderStatusBadge(order.status)}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Fecha</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Período</p>
                          <p className="text-sm font-semibold text-gray-900">{order.period} meses</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Total</p>
                          <p className="text-sm font-bold text-[#ff9900]">${order.total.toLocaleString()}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Columna Lateral - Información de Usuario y Soporte */}
          <div className="space-y-8">
            {/* Información del Usuario */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-[#ff9900]" />
                Mi Información
              </h2>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-semibold text-gray-900">{user.email}</p>
                  </div>
                </div>

                {user.displayName && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Nombre</p>
                      <p className="text-sm font-semibold text-gray-900">{user.displayName}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Miembro desde</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('es-AR', {
                        month: 'long',
                        year: 'numeric',
                      }) : '-'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Soporte */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-[#ff9900] to-[#ff6600] rounded-2xl shadow-lg p-6 text-white"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Headphones className="h-5 w-5" />
                Soporte
              </h2>

              <p className="text-sm mb-6 opacity-90">
                ¿Necesitás ayuda? Nuestro equipo está disponible para asistirte.
              </p>

              <div className="space-y-3">
                <a
                  href="https://wa.me/+5491169004037"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
                >
                  <MessageCircle className="h-5 w-5" />
                  <div>
                    <p className="text-xs opacity-90">WhatsApp</p>
                    <p className="text-sm font-semibold">+54 9 11 6900-4037</p>
                  </div>
                  <ExternalLink className="h-4 w-4 ml-auto" />
                </a>

                <a
                  href="mailto:holawebdominios@gmail.com"
                  className="flex items-center gap-3 p-3 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
                >
                  <Mail className="h-5 w-5" />
                  <div>
                    <p className="text-xs opacity-90">Email</p>
                    <p className="text-sm font-semibold">holawebdominios@gmail.com</p>
                  </div>
                </a>
              </div>

              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-xs opacity-75 text-center">
                  Horario: Lunes a Viernes 9:00 - 18:00
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

