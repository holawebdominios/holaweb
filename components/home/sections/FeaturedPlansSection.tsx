"use client";

import { motion } from 'framer-motion';
import { integralCF } from '@/styles/fonts';
import { cn } from '@/lib/utils';
import { Star, Zap, Shield, Headphones } from 'lucide-react';

const plans = [
  {
    id: 'mensual',
    name: 'Mensual',
    price: 24999,
    originalPrice: null,
    discount: 0,
    highlighted: false,
    badge: null,
    features: ['Soporte prioritario', 'Registro a tu nombre', 'Renovación automática'],
  },
  {
    id: 'anual',
    name: 'Anual Lanzamiento',
    price: 14999,
    originalPrice: 24999,
    discount: 40,
    highlighted: true,
    badge: 'MÁS POPULAR',
    features: ['Soporte prioritario', 'Registro a tu nombre', 'Ahorrás 40%'],
  },
  {
    id: '24meses',
    name: 'Plan 24 Meses',
    price: 9999,
    originalPrice: 24999,
    discount: 60,
    highlighted: false,
    badge: 'MEJOR PRECIO',
    features: ['Soporte prioritario', 'Registro a tu nombre', 'Ahorrás 60%'],
  },
];

export default function FeaturedPlansSection() {
  return (
    <section id="planes" className="py-20 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white" />
      
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
            "text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-text-primary mb-4"
          ])}>
            Planes y Precios
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-text-secondary max-w-2xl mx-auto">
            Inversión simple y transparente para tu dominio .AR
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3 }
              }}
              className={cn(
                "relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300",
                plan.highlighted 
                  ? "border-3 border-brand-yellow ring-4 ring-brand-yellow/10" 
                  : "border border-gray-200"
              )}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-brand-yellow text-gray-900 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5" />
                  {plan.badge}
                </div>
              )}

              {/* Header */}
              <div className="text-center mb-6 pt-2">
                <h3 className="text-xl font-bold text-text-primary mb-3">
                  {plan.name}
                </h3>
                
                {/* Precio */}
                <div className="mb-3">
                  {plan.originalPrice && (
                    <div className="text-sm text-text-secondary line-through mb-1">
                      ${plan.originalPrice.toLocaleString()}
                    </div>
                  )}
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-brand-blue">
                      ${plan.price.toLocaleString()}
                    </span>
                    <span className="text-text-secondary text-sm">/mes</span>
                  </div>
                </div>
                
                {/* Descuento */}
                {plan.discount > 0 && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-bold">
                    <Star className="h-4 w-4" />
                    Ahorrás {plan.discount}%
                  </div>
                )}
              </div>

              {/* Beneficios Clave (sin lista) */}
              <div className="space-y-3 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-center gap-2 text-sm text-text-primary">
                  <Shield className="h-4 w-4 text-brand-blue" />
                  <span className="font-medium">Registro a tu nombre</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-text-primary">
                  <Headphones className="h-4 w-4 text-brand-blue" />
                  <span className="font-medium">Soporte incluido</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Nota al pie */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-gray-500">
            ✓ Sin costos ocultos • ✓ Renovación automática • ✓ Cancelá cuando quieras
          </p>
        </motion.div>
      </div>
    </section>
  );
}

