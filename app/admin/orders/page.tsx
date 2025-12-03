'use client';

import { useEffect, useState } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { motion } from 'framer-motion';
import { 
  ShoppingCart,
  Search,
  Eye,
  Calendar,
  User,
  Globe,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  Filter
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Pagination from '@/components/admin/Pagination';
import { useDebounce } from '@/hooks/useDebounce';

interface Order {
  id: string;
  orderNumber: string;
  domain: string;
  period: number;
  total: number;
  status: string;
  createdAt: any;
  paidAt?: any;
  userEmail?: string;
  userName?: string;
}

export default function AdminOrdersPage() {
  const { user } = useAdminAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'createdAt' | 'total'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [allOrdersCount, setAllOrdersCount] = useState({ paid: 0, pending: 0, failed: 0, all: 0 });

  // Debounce search
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    loadOrders();
  }, [statusFilter, sortBy, sortOrder, currentPage, pageSize, debouncedSearch]);

  useEffect(() => {
    // Reset page cuando cambian filtros
    setCurrentPage(1);
  }, [statusFilter, debouncedSearch]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const token = await user?.getIdToken();
      
      const params = new URLSearchParams({
        status: statusFilter,
        sortBy,
        sortOrder,
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
        search: debouncedSearch,
      });

      const response = await fetch(`/api/admin/orders?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
        setTotalItems(data.total || 0);
        setTotalPages(data.totalPages || 0);
        
        // Actualizar contadores para los filtros
        if (data.statusCounts) {
          setAllOrdersCount(data.statusCounts);
        }
      } else {
        throw new Error('Error al cargar órdenes');
      }
    } catch (error) {
      console.error('Error cargando órdenes:', error);
      toast.error('Error al cargar órdenes');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
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
      paid: { bg: 'bg-green-100', text: 'text-green-700', label: 'Pagado', icon: CheckCircle2 },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pendiente', icon: Clock },
      failed: { bg: 'bg-red-100', text: 'text-red-700', label: 'Fallido', icon: XCircle },
      cancelled: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Cancelado', icon: XCircle },
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingCart className="h-8 w-8 text-[#ff9900]" />
            Órdenes
          </h1>
          <p className="text-gray-600 mt-1">
            {statusFilter === 'all' ? `Total: ${totalItems} órdenes` : `Mostrando ${totalItems} de ${allOrdersCount.all || totalItems} órdenes`}
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff9900] focus:border-transparent outline-none text-sm"
          >
            <option value="createdAt">Ordenar por: Fecha</option>
            <option value="total">Ordenar por: Monto</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            {sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
          </button>
        </div>
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
              placeholder="Buscar por número de orden, dominio o email..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff9900] focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 overflow-x-auto">
            {[
              { value: 'all', label: 'Todas', count: allOrdersCount.all || totalItems },
              { value: 'paid', label: 'Pagadas', count: allOrdersCount.paid || 0 },
              { value: 'pending', label: 'Pendientes', count: allOrdersCount.pending || 0 },
              { value: 'failed', label: 'Fallidas', count: allOrdersCount.failed || 0 },
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

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#ff9900]" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {search || statusFilter !== 'all' ? 'No se encontraron órdenes con ese criterio' : 'No hay órdenes registradas'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Orden
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Dominio
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Período
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Orden */}
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">#{order.orderNumber}</p>
                      <p className="text-xs text-gray-500 mt-1">{order.id.slice(0, 8)}...</p>
                    </td>

                    {/* Cliente */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.userName || '-'}</p>
                        <p className="text-xs text-gray-500">{order.userEmail || '-'}</p>
                      </div>
                    </td>

                    {/* Dominio */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{order.domain}</span>
                      </div>
                    </td>

                    {/* Período */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{order.period} meses</span>
                    </td>

                    {/* Fecha */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {formatDate(order.createdAt)}
                      </div>
                      {order.paidAt && (
                        <p className="text-xs text-green-600 mt-1">
                          Pagado: {formatDate(order.paidAt)}
                        </p>
                      )}
                    </td>

                    {/* Total */}
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">
                        ${order.total.toLocaleString()}
                      </p>
                    </td>

                    {/* Estado */}
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#ff9900] text-white rounded-lg hover:bg-[#ff8800] transition-colors text-sm font-medium"
                      >
                        <Eye className="h-4 w-4" />
                        Ver
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={totalItems}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

