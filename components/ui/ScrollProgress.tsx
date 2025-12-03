"use client";

import { motion, useScroll, useSpring } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function ScrollProgress() {
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Ocultar en checkout
  if (pathname === '/checkout') {
    return null;
  }

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFCC4D] via-[#ff6600] to-[#FFCC4D] z-[100] origin-left"
      style={{ scaleX }}
    />
  );
}


