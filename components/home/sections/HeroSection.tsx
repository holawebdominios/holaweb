"use client";

import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { integralCF } from '@/styles/fonts';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Loader2, CheckCircle, XCircle, ArrowRight, AlertCircle } from 'lucide-react';
import { gsap } from 'gsap';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function HeroSection() {
  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [domain, setDomain] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<{ available: boolean; domain: string } | null>(null);

  const handleQuickCheck = async () => {
    if (!domain.trim()) {
      toast.error('Ingresá un nombre de dominio');
      return;
    }
    
    setIsChecking(true);
    setResult(null);
    
    try {
      const input = domain.trim().toLowerCase();
      console.log('[Hero] Verificando dominio:', input);
      
      // Detectar si ya tiene TLD especificado
      const argentineTLDs = ['.ar', '.com.ar', '.net.ar', '.org.ar'];
      let domainBase = input;
      let tldsToCheck = ['.com.ar']; // Por defecto solo .com.ar en el hero
      
      // Verificar si el input ya incluye un TLD argentino
      for (const tld of argentineTLDs) {
        if (input.endsWith(tld)) {
          domainBase = input.slice(0, -tld.length);
          tldsToCheck = [tld]; // Buscar solo el TLD especificado
          break;
        }
      }
      
      console.log('[Hero] Base:', domainBase, 'TLDs:', tldsToCheck);
      
      // Llamar a la API real de verificación
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
        const errorData = await response.json();
        console.error('[Hero] Error de API:', errorData);
        throw new Error(errorData.message || 'Error al verificar dominio');
      }

      const data = await response.json();
      console.log('[Hero] Respuesta de API:', data);
      
      if (data.results && data.results.length > 0) {
        const domainResult = data.results[0];
        console.log('[Hero] Resultado:', domainResult);
        
        setResult({
          available: domainResult.available,
          domain: domainResult.domain,
        });
        
        if (domainResult.status === 'error') {
          toast.error('Error al verificar el dominio. Intentá nuevamente.');
        }
      } else {
        throw new Error('No se recibieron resultados');
      }
    } catch (error) {
      console.error('[Hero] Error verificando dominio:', error);
      toast.error('Error al verificar el dominio. Intentá nuevamente.');
      setResult(null);
    } finally {
      setIsChecking(false);
    }
  };

  const handleFullCheck = () => {
    // Scroll suave al inicio para buscar otro dominio
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setResult(null);
    setDomain('');
  };

  // Animaciones de entrada con GSAP
  useEffect(() => {
    if (!contentRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-title-line1", {
        opacity: 0,
        y: 30,
        duration: 0.8,
      })
      .from(".hero-title-line2", {
        opacity: 0,
        scale: 0.8,
        duration: 0.8,
      }, "-=0.4")
      .from(".hero-description", {
        opacity: 0,
        y: 20,
        duration: 0.8,
      }, "-=0.4")
      .from(".hero-search", {
        opacity: 0,
        y: 20,
        duration: 0.8,
      }, "-=0.4");
    }, contentRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="inicio"
      className="relative h-[70vh] min-h-[500px] sm:min-h-[550px] md:h-[75vh] overflow-hidden"
    >
      {/* Imagen de fondo */}
      <div className="absolute inset-0">
        <Image
          src="/banner.webp"
          alt="Verificación de Dominios"
          fill
          className="object-cover object-center"
          priority
          quality={90}
          sizes="100vw"
        />
      </div>
      
      {/* Overlay con gradiente de marca */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/80 via-brand-blue/70 to-brand-blueDark/90" />
      
      {/* Acento naranja sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-brand-orange/10" />
      
      {/* Contenido Hero */}
      <div 
        ref={contentRef}
        className="relative z-10 h-full flex items-center justify-center"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 text-center text-white">
          <div className="hero-content">
            {/* Título principal con efecto de texto animado y parallax sutil */}
            <h1 
              className={cn([
                integralCF.className,
                "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight hero-title"
              ])}
              style={{
                textShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
              }}
            >
              <span className="block bg-gradient-to-r from-white via-white to-gray-100 bg-clip-text text-transparent hero-title-line1">
                Verificá tu Dominio COM.AR
              </span>
              <span className="block mt-2 bg-gradient-to-r from-brand-yellow via-brand-yellowDark to-brand-yellow bg-clip-text text-transparent hero-title-line2">
                en Segundos
              </span>
            </h1>
            
            {/* Descripción */}
            <p 
              className="text-sm sm:text-base md:text-lg text-gray-200 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2 hero-description"
              style={{
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
              }}
            >
              Verificación instantánea y gestión completa de tus dominios argentinos.
            </p>
            
            {/* Buscador integrado */}
            <div className="max-w-2xl mx-auto px-2 hero-search">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/20">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                    <input
                      type="text"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleQuickCheck()}
                      placeholder="ejemplo o ejemplo.com.ar"
                      className="w-full pl-12 pr-4 py-4 bg-white/90 text-gray-900 border-0 rounded-xl focus:ring-2 focus:ring-brand-yellow outline-none transition-all text-base sm:text-lg font-medium placeholder:text-gray-400"
                      disabled={isChecking}
                    />
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleQuickCheck}
                    disabled={isChecking || !domain.trim()}
                    className="px-6 sm:px-8 py-4 bg-brand-yellow hover:bg-brand-yellowDark text-gray-900 font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:shadow-brand-yellow/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    {isChecking ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="hidden sm:inline">Verificando...</span>
                      </>
                    ) : (
                      <>
                        <Search className="h-5 w-5" />
                        <span>Buscar</span>
                      </>
                    )}
                  </motion.button>
                </div>

                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "mt-4 p-4 rounded-xl border-2 backdrop-blur-sm",
                      result.available
                        ? "bg-green-500/20 border-green-400/50"
                        : "bg-white/20 border-white/30"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {result.available ? (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      ) : (
                        <XCircle className="h-5 w-5 text-white" />
                      )}
                      <span className="font-bold text-white">
                        {result.domain}
                      </span>
                    </div>
                    
                    <p className="text-white/90 text-sm mb-3">
                      {result.available
                        ? "¡Disponible! Podés registrarlo."
                        : "Ya está registrado."}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      {result.available ? (
                        <>
                          <Link href={`/checkout?domain=${encodeURIComponent(result.domain)}`} className="flex-1">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="w-full bg-brand-blue hover:bg-brand-blueDark text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2"
                            >
                              Adquirir Dominio
                              <ArrowRight className="h-4 w-4" />
                            </motion.button>
                          </Link>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleFullCheck}
                            className="text-white bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors text-sm"
                          >
                            Ver más
                          </motion.button>
                        </>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleFullCheck}
                          className="text-brand-blue bg-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm flex items-center gap-2"
                        >
                          Ver más dominios
                          <ArrowRight className="h-4 w-4" />
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

