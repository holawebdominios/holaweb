"use client";

import { motion } from 'framer-motion';
import { integralCF } from '@/styles/fonts';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { 
  Zap, 
  Eye, 
  Bell, 
  Globe, 
  LayoutDashboard, 
  Headphones 
} from 'lucide-react';
import { benefits } from '@/config/content';

const iconMap: Record<string, any> = {
  Zap,
  Eye,
  Bell,
  Globe,
  LayoutDashboard,
  Headphones
};

export default function BenefitsSection() {
  return (
    <section id="beneficios" className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh opacity-30" />
      
      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className={cn([
            integralCF.className,
            "text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6"
          ])}>
            Beneficios del Servicio
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto">
            Gestión profesional de dominios con tecnología de punta y soporte especializado
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map((benefit, index) => {
            const Icon = iconMap[benefit.icon];
            return (
              <motion.div
                key={benefit.id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                whileHover={{ 
                  y: -10,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                className="group"
              >
                <div className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-[#ff9900]/30 h-full">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#ff9900]/0 to-[#ff6600]/0 group-hover:from-[#ff9900]/10 group-hover:to-[#ff6600]/5 transition-all duration-500 opacity-0 group-hover:opacity-100" />
                  
                  <div className="relative z-10">
                    <motion.div
                      className={`w-16 h-16 ${benefit.bgColor} rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden`}
                      whileHover={{ 
                        scale: 1.1,
                        rotate: [0, -5, 5, 0],
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className={`h-8 w-8 ${benefit.color} relative z-10`} />
                    </motion.div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#ff9900] transition-colors duration-300">
                      {benefit.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

