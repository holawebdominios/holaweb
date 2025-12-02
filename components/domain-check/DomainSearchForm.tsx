"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DomainSearchFormProps {
  onSearch: (domains: string[], tlds: string[]) => void;
  isSearching: boolean;
  initialDomain?: string;
}

const argentineTLDs = ['.ar', '.com.ar', '.net.ar', '.org.ar'];

// Función para detectar si un dominio ya tiene TLD
function hasTLD(domain: string): boolean {
  return argentineTLDs.some(tld => domain.endsWith(tld));
}

// Función para extraer dominio base y TLD
function parseDomainInput(input: string): { base: string; tld?: string } {
  const cleaned = input.trim().toLowerCase();
  
  for (const tld of argentineTLDs) {
    if (cleaned.endsWith(tld)) {
      return {
        base: cleaned.slice(0, -tld.length),
        tld: tld
      };
    }
  }
  
  return { base: cleaned };
}

export default function DomainSearchForm({ onSearch, isSearching, initialDomain }: DomainSearchFormProps) {
  const [input, setInput] = useState(initialDomain || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSearching) return;
    
    const domainInput = input.trim();
    const parsed = parseDomainInput(domainInput);
    
    let tldsToSearch: string[];
    
    if (parsed.tld) {
      // Si ya tiene TLD, buscar solo ese
      tldsToSearch = [parsed.tld];
    } else {
      // Si no tiene TLD, buscar en todos los argentinos
      tldsToSearch = argentineTLDs;
    }
    
    onSearch([parsed.base], tldsToSearch);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Input principal */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="ejemplo o ejemplo.com.ar"
            className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:border-[#ff9900] focus:outline-none transition-colors text-lg"
            disabled={isSearching}
          />
          {input && (
            <button
              type="button"
              onClick={() => setInput('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Botón de búsqueda */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!input.trim() || isSearching}
          className="w-full py-4 bg-gradient-to-r from-[#ff9900] to-[#ff6600] text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-[#ff9900]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSearching ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Verificando...
            </>
          ) : (
            <>
              <Search className="h-5 w-5" />
              Verificar Dominio
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}

