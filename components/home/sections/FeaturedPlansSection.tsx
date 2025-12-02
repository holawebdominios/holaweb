"use client";

import { motion } from 'framer-motion';
import { integralCF } from '@/styles/fonts';
import { cn } from '@/lib/utils';
import { Check, Star } from 'lucide-react';
import Link from 'next/link';
import { plans } from '@/config/plans';

export default function FeaturedPlansSection() {
  const featuredPlans = plans.filter(p => p.highlighted || plans.indexOf(p) < 3);

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh opacity-20" />
      
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
            Planes y Precios
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto">
            Elegí el plan perfecto para tus necesidades
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                y: -10,
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              className={cn(
                "relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2",
                plan.highlighted 
                  ? "border-[#ff9900]" 
                  : "border-gray-100"
              )}
            >
              {plan.badge && (
                <div className={cn(
                  "absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full text-white font-semibold text-sm shadow-lg flex items-center gap-2",
                  plan.badgeColor
                )}>
                  <Star className="h-4 w-4" />
                  {plan.badge}
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{plan.tagline}</p>
                
                <div className="mb-4">
                  <span className="text-4xl font-bold text-[#13314c]">
                    ${(plan.pricing.monthly / 1000).toFixed(1)}k
                  </span>
                  <span className="text-gray-600">/mes</span>
                </div>
                
                {plan.pricing.discount && (
                  <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    {plan.pricing.discount.label} anual
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.slice(0, 5).map((feature) => (
                  <li key={feature.id} className="flex items-start gap-3">
                    <Check className={cn(
                      "h-5 w-5 flex-shrink-0 mt-0.5",
                      feature.included ? "text-green-600" : "text-gray-300"
                    )} />
                    <span className={cn(
                      "text-sm",
                      feature.included ? "text-gray-700" : "text-gray-400"
                    )}>
                      {feature.label}
                    </span>
                  </li>
                ))}
              </ul>

              <Link href={plan.ctaAction || '/contacto'}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300",
                    plan.highlighted
                      ? "bg-gradient-to-r from-[#ff9900] to-[#ff6600] text-white shadow-lg hover:shadow-xl"
                      : "bg-[#13314c]/10 text-[#13314c] hover:bg-[#13314c]/20"
                  )}
                >
                  {plan.ctaLabel}
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link href="/planes">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-[#ff9900] font-semibold hover:text-[#ff6600] transition-colors"
            >
              Ver comparación completa de planes →
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

