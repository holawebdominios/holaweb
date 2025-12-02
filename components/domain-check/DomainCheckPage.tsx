"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { integralCF } from '@/styles/fonts';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import DomainSearchForm from './DomainSearchForm';
import SearchResults from './SearchResults';
import { DomainInfo } from '@/types/domain';

export default function DomainCheckPage() {
  const searchParams = useSearchParams();
  const domainFromUrl = searchParams.get('domain');
  
  const [results, setResults] = useState<DomainInfo[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (domains: string[], tlds: string[]) => {
    setIsSearching(true);
    
    try {
      // Llamar a la API real de verificación
      const response = await fetch('/api/domain/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domains: domains.map(d => d.trim()),
          tlds,
          includeAlternatives: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al verificar dominios');
      }

      const data = await response.json();
      
      if (data.results) {
        setResults(data.results);
      }
    } catch (error) {
      console.error('Error verificando dominios:', error);
      // Mostrar error al usuario
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Si viene un dominio desde la URL, búscarlo automáticamente
  useEffect(() => {
    if (domainFromUrl) {
      handleSearch([domainFromUrl], ['.com.ar', '.ar']);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domainFromUrl]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero del verificador */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-[#13314c] via-[#1a4a6b] to-[#13314c] text-white relative overflow-hidden">
        {/* Patrón decorativo de fondo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff9900] rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ff9900] rounded-full blur-3xl" />
        </div>
        
      
      </section>

      {/* Formulario de búsqueda */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <DomainSearchForm 
            onSearch={handleSearch} 
            isSearching={isSearching}
            initialDomain={domainFromUrl || ''}
          />
        </div>
      </section>

      {/* Resultados */}
      {(results.length > 0 || isSearching) && (
        <section className="pb-20">
          <div className="max-w-6xl mx-auto px-4 lg:px-8">
            <SearchResults results={results} isLoading={isSearching} />
          </div>
        </section>
      )}
    </div>
  );
}

