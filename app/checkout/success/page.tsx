"use client";

import { Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { integralCF } from '@/styles/fonts';
import { cn } from '@/lib/utils';
import { CheckCircle, Loader2, Download, Home, Mail } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { user } = useAuth();
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      
      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
      }
    } catch (error) {
      console.error('Error obteniendo orden:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-[#ff9900] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center">
          {/* Icono de éxito */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6"
          >
            <CheckCircle className="h-12 w-12 text-green-600" />
          </motion.div>

          <h1 className={cn([integralCF.className, "text-3xl sm:text-4xl font-bold text-gray-900 mb-4"])}>
            ¡Pago Exitoso!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Tu dominio ha sido registrado y activado correctamente
          </p>

          {order && (
            <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
              <h3 className="font-bold text-gray-900 mb-4">Detalles de tu Compra</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Dominio:</span>
                  <span className="font-semibold text-gray-900">{order.domain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Período:</span>
                  <span className="font-semibold text-gray-900">{order.period} año{order.period > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Pagado:</span>
                  <span className="font-semibold text-[#ff9900] text-lg">${order.total?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Número de Orden:</span>
                  <span className="font-mono text-gray-900">{order.orderNumber}</span>
                </div>
              </div>
            </div>
          )}

          {/* Información adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
            <div className="flex gap-3 text-left">
              <Mail className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">Confirmación enviada</p>
                <p>Te enviamos un email con todos los detalles de tu compra y las instrucciones para gestionar tu dominio.</p>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link href="/dashboard/dominios" className="flex-1">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-[#ff9900] to-[#ff6600] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  Ver Mis Dominios
                </motion.button>
              </Link>
            ) : (
              <>
                <Link 
                  href={`/register${order?.metadata?.customerEmail ? `?email=${encodeURIComponent(order.metadata.customerEmail)}` : ''}`} 
                  className="flex-1"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-[#ff9900] to-[#ff6600] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    Crear Cuenta para Gestionar
                  </motion.button>
                </Link>
                
                <div className="flex-1 bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-900">
                  💡 Creá una cuenta con el email <strong>{order?.metadata?.customerEmail}</strong> para gestionar tu dominio
                </div>
              </>
            )}
          </div>
          
          {!user && (
            <Link href="/" className="mt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:border-gray-400 transition-all flex items-center justify-center gap-2"
              >
                <Home className="h-5 w-5" />
                Volver al Inicio
              </motion.button>
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-[#ff9900] animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}

