"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { gsap } from 'gsap';

interface WhatsAppFABProps {
  phoneNumber?: string;
  message?: string;
}

// Icono oficial de WhatsApp SVG
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.488"/>
  </svg>
);

export default function WhatsAppFAB({ 
  phoneNumber = "541134976239",
  message = "Hola! Me gustaría conocer más sobre sus servicios de movimiento de suelos."
}: WhatsAppFABProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // Ocultar en checkout
  if (pathname === '/checkout') {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animación del tooltip con GSAP
  useEffect(() => {
    if (!tooltipRef.current) return;

    if (showTooltip) {
      gsap.fromTo(tooltipRef.current,
        { 
          opacity: 0, 
          x: 20, 
          scale: 0.8,
        },
        { 
          opacity: 1, 
          x: 0, 
          scale: 1,
          duration: 0.3,
          ease: "back.out(1.7)",
          onStart: () => {
            if (tooltipRef.current) {
              tooltipRef.current.style.pointerEvents = 'auto';
            }
          }
        }
      );
    } else {
      gsap.to(tooltipRef.current, {
        opacity: 0,
        x: 20,
        scale: 0.8,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          if (tooltipRef.current) {
            tooltipRef.current.style.pointerEvents = 'none';
          }
        }
      });
    }
  }, [showTooltip]);

  const handleClick = () => {
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setShowTooltip(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 right-6 z-50"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {/* Tooltip animado con GSAP */}
          <div
            ref={tooltipRef}
            className="absolute right-20 top-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-4 min-w-[220px] border border-gray-100"
            style={{ opacity: 0, pointerEvents: 'none' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <WhatsAppIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">¿Necesitas ayuda?</p>
                <p className="text-xs text-gray-600">Chatea con nosotros</p>
              </div>
            </div>
            <button
              onClick={handleClick}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-2.5 px-4 rounded-lg text-sm hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg pointer-events-auto"
            >
              Abrir WhatsApp
            </button>
          </div>

          {/* Botón principal con icono oficial de WhatsApp */}
          <motion.button
            ref={buttonRef}
            onClick={handleClick}
            className="relative w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-2xl flex items-center justify-center text-white group overflow-hidden"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={{
              boxShadow: [
                "0 10px 30px rgba(34, 197, 94, 0.4)",
                "0 10px 40px rgba(34, 197, 94, 0.6)",
                "0 10px 30px rgba(34, 197, 94, 0.4)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            aria-label="Abrir WhatsApp"
          >
            {/* Efecto de pulso */}
            <motion.div
              className="absolute inset-0 bg-white/20 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            {/* Icono oficial de WhatsApp */}
            <WhatsAppIcon className="h-7 w-7 relative z-10" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

