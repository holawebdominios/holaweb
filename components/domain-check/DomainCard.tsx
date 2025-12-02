"use client";

import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import { DomainInfo } from '@/types/domain';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface DomainCardProps {
  domain: DomainInfo;
}

export default function DomainCard({ domain }: DomainCardProps) {
  const isAvailable = domain.available;

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      className={cn(
        "bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2",
        isAvailable
          ? "border-green-200 hover:border-green-300"
          : "border-gray-200 hover:border-gray-300"
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Información principal */}
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0",
            isAvailable ? "bg-green-100" : "bg-gray-100"
          )}>
            {isAvailable ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : (
              <XCircle className="h-6 w-6 text-gray-600" />
            )}
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              {domain.domain}
            </h3>
            
            <p className={cn(
              "text-sm font-semibold",
              isAvailable ? "text-green-600" : "text-gray-600"
            )}>
              {isAvailable ? "DISPONIBLE" : "REGISTRADO"}
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-2">
          {isAvailable ? (
            <Link href={`/checkout?domain=${encodeURIComponent(domain.domain)}`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-gradient-to-r from-[#ff9900] to-[#ff6600] text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
              >
                Adquirir Dominio
              </motion.button>
            </Link>
          ) : (
            <Link href="/contacto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-[#13314c]/10 text-[#13314c] font-semibold rounded-lg hover:bg-[#13314c]/20 transition-all duration-300"
              >
                Gestionar
              </motion.button>
            </Link>
          )}
        </div>
      </div>

    </motion.div>
  );
}

