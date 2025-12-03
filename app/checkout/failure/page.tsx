"use client";

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { integralCF } from '@/styles/fonts';
import { cn } from '@/lib/utils';
import { XCircle, Home, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function FailureContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center">
          {/* Icono de error */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6"
          >
            <XCircle className="h-12 w-12 text-red-600" />
          </motion.div>

          <h1 className={cn([integralCF.className, "text-3xl sm:text-4xl font-bold text-gray-900 mb-4"])}>
            Pago No Procesado
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Hubo un problema al procesar tu pago. No se realizó ningún cargo.
          </p>

          {/* Información adicional */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8">
            <div className="text-sm text-yellow-900">
              <p className="font-semibold mb-1">¿Qué pasó?</p>
              <p>El pago pudo haber sido rechazado por tu banco o cancelado. Podés intentar nuevamente con otro método de pago.</p>
            </div>
          </div>

          {orderId && (
            <p className="text-sm text-gray-500 mb-8">
              Orden: <span className="font-mono">{orderId}</span>
            </p>
          )}

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={orderId ? `/checkout?domain=...` : '/'} className="flex-1">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-[#0066CC] to-[#ff6600] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-5 w-5" />
                Intentar Nuevamente
              </motion.button>
            </Link>
            
            <Link href="/" className="flex-1">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:border-gray-400 transition-all flex items-center justify-center gap-2"
              >
                <Home className="h-5 w-5" />
                Volver al Inicio
              </motion.button>
            </Link>
          </div>

          {/* Contacto */}
          <div className="mt-8 text-sm text-gray-600">
            ¿Necesitás ayuda?{' '}
            <Link href="/contacto" className="text-[#0066CC] hover:text-[#ff6600] font-semibold">
              Contactanos
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function CheckoutFailurePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-[#0066CC] animate-spin" />
      </div>
    }>
      <FailureContent />
    </Suspense>
  );
}

