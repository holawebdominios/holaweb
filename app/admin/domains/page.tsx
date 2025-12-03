'use client';

import { useEffect, useState } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { motion } from 'framer-motion';
import { 
  Globe,
  Search,
  Calendar,
  User,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Domain {
  id: string;
  domain: string;
  tld: string;
  status: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  registrationDate?: any;
  expirationDate?: any;
  autoRenew: boolean;
}

export default function AdminDomainsPage() {
  const { user } = useAdminAuth();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [filteredDomains, setFilteredDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadDomains();
  }, []);

  useEffect(() => {
    filterDomains();
  }, [search, statusFilter, domains]);

  const loadDomains = async () => {
    try {
      setLoading(true);
      const token = await user?.getIdToken();
      
      // Obtener todos los dominios
      const response = await fetch('/api/admin/domains', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDomains(data.domains || []);
        setFilteredDomains(data.domains || []);
      } else {
        throw new Error('Error al cargar dominios');
      }
    } catch (error) {
      console.error('Error cargando dominios:', error);
      toast.error('Error al cargar dominios');
    } finally {
      setLoading(false);
    }
  };

  const filterDomains = () => {
    let filtered = [...domains];

    // Filtrar por búsqueda
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(domain =>
        domain.domain?.toLowerCase().includes(searchLower) ||
        domain.userEmail?.toLowerCase().includes(searchLower)
      );
    }

    // Filtrar por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(domain => domain.status === statusFilter);
    }

    setFilteredDomains(filtered);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '-';
    try {
      if (timestamp.toDate) return timestamp.toDate().toLocaleDateString('es-AR');
      if (timestamp.seconds) return new Date(timestamp.seconds * 1000).toLocaleDateString('es-AR');
      return new Date(timestamp).toLocaleDateString('es-AR');
    } catch {
      return '-';
    }
  };

  const getStatusBadge = (status: string) => {
    const config: any = {
      active: { bg: 'bg-green-100', text: 'text-green-700', label: 'Activo', icon: CheckCircle2 },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pendiente', icon: Clock },
      expired: { bg: 'bg-red-100', text: 'text-red-700', label: 'Expirado', icon: XCircle },
      expiring: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Por Vencer', icon: AlertTriangle },
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

  const getStatusCount = (status: string) => {
    return domains.filter(d => d.status === status).length;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Globe className="h-8 w-8 text-[#ff9900]" />
          Dominios
        </h1>
        <p className="text-gray-600 mt-1">
          Total: {filteredDomains.length} dominios
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Search */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por dominio o email..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff9900] focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 overflow-x-auto">
            {[
              { value: 'all', label: 'Todos', count: domains.length },
              { value: 'active', label: 'Activos', count: getStatusCount('active') },
              { value: 'pending', label: 'Pendientes', count: getStatusCount('pending') },
              { value: 'expiring', label: 'Por Vencer', count: getStatusCount('expiring') },
              { value: 'expired', label: 'Expirados', count: getStatusCount('expired') },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
                  statusFilter === filter.value
                    ? 'bg-[#ff9900] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Domains Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#ff9900]" />
          </div>
        ) : filteredDomains.length === 0 ? (
          <div className="text-center py-12">
            <Globe className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No se encontraron dominios</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Dominio
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Registro
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Vencimiento
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Auto-renovar
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDomains.map((domain, index) => (
                  <motion.tr
                    key={domain.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Dominio */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-[#ff9900]" />
                        <div>
                          <p className="font-semibold text-gray-900">{domain.domain}</p>
                          <p className="text-xs text-gray-500">{domain.tld}</p>
                        </div>
                      </div>
                    </td>

                    {/* Usuario */}
                    <td className="px-6 py-4">
                      {domain.userEmail ? (
                        <Link
                          href={`/admin/users/${domain.userId}`}
                          className="text-sm text-[#ff9900] hover:text-[#ff8800] hover:underline"
                        >
                          {domain.userEmail}
                        </Link>
                      ) : (
                        <span className="text-sm text-gray-500">Sin usuario</span>
                      )}
                    </td>

                    {/* Registro */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        {formatDate(domain.registrationDate)}
                      </div>
                    </td>

                    {/* Vencimiento */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        {formatDate(domain.expirationDate)}
                      </div>
                    </td>

                    {/* Auto-renovar */}
                    <td className="px-6 py-4">
                      {domain.autoRenew ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-gray-400" />
                      )}
                    </td>

                    {/* Estado */}
                    <td className="px-6 py-4">
                      {getStatusBadge(domain.status)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

