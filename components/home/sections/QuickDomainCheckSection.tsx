"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';
import { integralCF } from '@/styles/fonts';
import { cn } from '@/lib/utils';
import { Search, CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { DomainInfo } from '@/types/domain';

export default function QuickDomainCheckSection() {
  const [domain, setDomain] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<DomainInfo[]>([]);

  const handleCheck = async () => {
    if (!domain.trim()) {
      toast.error('Ingresá un nombre de dominio');
      return;
    }
    
    setIsChecking(true);
    setResults([]);
    
    try {
      const input = domain.trim().toLowerCase();
      const argentineTLDs = ['.ar', '.com.ar', '.net.ar', '.org.ar'];
      
      let domainBase = input;
      let tldsToCheck = argentineTLDs; // Por defecto TODOS los argentinos
      
      // Detectar si ya tiene TLD especificado
      for (const tld of argentineTLDs) {
        if (input.endsWith(tld)) {
          domainBase = input.slice(0, -tld.length);
          tldsToCheck = [tld]; // Solo el TLD especificado
          break;
        }
      }
      
      console.log('[Quick] Base:', domainBase, 'TLDs:', tldsToCheck);
      
      const response = await fetch('/api/domain/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domains: [domainBase],
          tlds: tldsToCheck,
          includeAlternatives: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al verificar dominio');
      }

      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        setResults(data.results);
      }
    } catch (error) {
      console.error('Error verificando dominio:', error);
      toast.error('Error al verificar el dominio. Intentá nuevamente.');
      setResults([]);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-[#f9fafb] via-white to-[#fff5e6] relative overflow-hidden">
      {/* Patrón decorativo de fondo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#ff9900] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#13314c] rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-4xl mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-[#ff9900]/10 to-[#F6A823]/10 rounded-full border border-[#ff9900]/20"
          >
            <span className="text-[#ff9900] font-semibold text-sm">
              🚀 Verificación Instantánea de Disponibilidad
            </span>
          </motion.div>
          
          <h2 className={cn([
            integralCF.className,
            "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          ])}>
            Encontrá tu Dominio Perfecto
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
            Verificá disponibilidad de dominios <span className="font-semibold text-[#ff9900]">.ar, .com.ar, .net.ar</span> y más en segundos
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-gray-100 hover:border-[#ff9900]/20 transition-colors duration-300"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
                placeholder="ejemplo o ejemplo.com.ar"
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#ff9900] focus:outline-none transition-colors text-lg"
                disabled={isChecking}
              />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCheck}
              disabled={isChecking || !domain.trim()}
              className="px-6 sm:px-8 py-4 bg-gradient-to-r from-[#ff9900] to-[#F6A823] text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-[#ff9900]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {isChecking ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Verificando...
                </>
              ) : (
                'Verificar'
              )}
            </motion.button>
          </div>

          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 space-y-3"
            >
              {results.map((domainResult) => (
                <div
                  key={domainResult.domain}
                  className={cn(
                    "p-4 rounded-xl border-2",
                    domainResult.available
                      ? "bg-green-50 border-green-200"
                      : "bg-gray-50 border-gray-200"
                  )}
                >
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      {domainResult.available ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-gray-600" />
                      )}
                      <div>
                        <p className="font-bold text-gray-900">{domainResult.domain}</p>
                        <p className={cn(
                          "text-sm font-medium",
                          domainResult.available ? "text-green-600" : "text-gray-600"
                        )}>
                          {domainResult.available ? "DISPONIBLE" : "REGISTRADO"}
                        </p>
                      </div>
                    </div>
                    
                    {domainResult.available && (
                      <Link href={`/checkout?domain=${encodeURIComponent(domainResult.domain)}`}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-gradient-to-r from-[#ff9900] to-[#F6A823] text-white font-semibold rounded-lg hover:shadow-lg transition-all text-sm flex items-center gap-2"
                        >
                          Adquirir
                          <ArrowRight className="h-4 w-4" />
                        </motion.button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
              
              <div className="pt-4 flex justify-center">
                <Link href="/#verificar">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-2 text-[#ff9900] font-semibold hover:text-[#F6A823] transition-colors text-sm flex items-center gap-2"
                  >
                    Ver verificador completo
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

