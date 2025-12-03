'use client';

import { useEffect, useState } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter,
  Eye,
  Mail,
  Calendar,
  ShoppingCart,
  Globe,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Pagination from '@/components/admin/Pagination';
import { useDebounce } from '@/hooks/useDebounce';

interface User {
  id: string;
  uid: string;
  email: string;
  name: string;
  phone?: string;
  company?: string;
  role?: string;
  plan?: string;
  createdAt: any;
  ordersCount: number;
  domainsCount: number;
  totalSpent: number;
}

export default function AdminUsersPage() {
  const { user } = useAdminAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'email' | 'name'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Debounce search para no hacer query en cada tecla
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    loadUsers();
  }, [sortBy, sortOrder, currentPage, pageSize, debouncedSearch]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const token = await user?.getIdToken();
      
      const params = new URLSearchParams({
        sortBy,
        sortOrder,
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
        search: debouncedSearch,
      });

      const response = await fetch(`/api/admin/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        setTotalItems(data.total || 0);
        setTotalPages(data.totalPages || 0);
      } else {
        throw new Error('Error al cargar usuarios');
      }
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset a primera página
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-8 w-8 text-[#0066CC]" />
            Usuarios
          </h1>
          <p className="text-gray-600 mt-1">
            Total: {totalItems} usuarios
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent outline-none text-sm"
          >
            <option value="createdAt">Ordenar por: Fecha</option>
            <option value="email">Ordenar por: Email</option>
            <option value="name">Ordenar por: Nombre</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            {sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por email, nombre o empresa..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#0066CC]" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {search ? 'No se encontraron usuarios con ese criterio' : 'No hay usuarios registrados'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Plan/Rol
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Registro
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actividad
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Total Gastado
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((userItem, index) => (
                  <motion.tr
                    key={userItem.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Usuario */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{userItem.name}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {userItem.email}
                        </p>
                        {userItem.company && (
                          <p className="text-xs text-gray-400 mt-1">{userItem.company}</p>
                        )}
                      </div>
                    </td>

                    {/* Plan/Rol */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {getRoleBadge(userItem.role)}
                        {getPlanBadge(userItem.plan)}
                      </div>
                    </td>

                    {/* Registro */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        {formatDate(userItem.createdAt)}
                      </div>
                    </td>

                    {/* Actividad */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <ShoppingCart className="h-4 w-4" />
                          <span>{userItem.ordersCount} órdenes</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Globe className="h-4 w-4" />
                          <span>{userItem.domainsCount} dominios</span>
                        </div>
                      </div>
                    </td>

                    {/* Total Gastado */}
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">
                        ${userItem.totalSpent.toLocaleString()}
                      </p>
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/users/${userItem.uid}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#0066CC] text-white rounded-lg hover:bg-[#ff8800] transition-colors text-sm font-medium"
                      >
                        <Eye className="h-4 w-4" />
                        Ver Detalle
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

