"use client";

import { motion } from 'framer-motion';
import { integralCF } from '@/styles/fonts';
import { cn } from '@/lib/utils';
import { Check, Star } from 'lucide-react';
import Link from 'next/link';
import { plans } from '@/config/plans';

export default function PlansPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-[#13314c] to-[#1a4a6b] text-white">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn([
              integralCF.className,
              "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
            ])}
          >
            Elegí el Plan Perfecto
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-gray-200"
          >
            Gestión profesional de dominios con monitoreo 24/7 y alertas automáticas
          </motion.p>
        </div>
      </section>

      {/* Planes */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={cn(
                  "relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2",
                  plan.highlighted ? "border-[#ff9900]" : "border-gray-100"
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

                <p className="text-gray-600 text-sm mb-6 text-center">
                  {plan.description}
                </p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
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
        </div>
      </section>
    </div>
  );
}

