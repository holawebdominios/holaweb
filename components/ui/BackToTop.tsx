"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  // Ocultar en checkout
  if (pathname === '/checkout') {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={scrollToTop}
          className="fixed bottom-28 right-6 z-50 w-14 h-14 bg-gradient-to-br from-[#13314c] to-[#1a4a6b] rounded-full shadow-2xl flex items-center justify-center text-white group overflow-hidden"
          whileHover={{ scale: 1.1, y: -5 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Volver arriba"
        >
          {/* Efecto de brillo en hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-[#ff9900] to-[#ff6600] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
          
          {/* Efecto de pulso */}
          <motion.div
            className="absolute inset-0 bg-white/20 rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          <ArrowUp className="h-6 w-6 relative z-10" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

