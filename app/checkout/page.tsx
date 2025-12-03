"use client";

import { use, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { integralCF } from '@/styles/fonts';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, Check, Globe, Calendar, Shield, 
  CreditCard, Lock, AlertCircle, Mail, User, Phone, Building
} from 'lucide-react';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const domain = searchParams.get('domain') || 'tudominio.com.ar';
  
  const [selectedPlan, setSelectedPlan] = useState<'1year' | '2years' | '3years'>('1year');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    cuit: '',
    address: '',
  });

  const plans = {
    '1year': { period: '1 año', price: 5900, discount: 0 },
    '2years': { period: '2 años', price: 10600, discount: 10 },
    '3years': { period: '3 años', price: 14760, discount: 17 },
  };

  const selectedPlanData = plans[selectedPlan];
  const subtotal = selectedPlanData.price;
  const total = subtotal;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Mockup de checkout - En producción se integrará con Mercado Pago');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-semibold">Volver</span>
            </Link>
            
            <div className="flex items-center gap-2 text-green-600">
              <Lock className="h-4 w-4" />
              <span className="text-sm font-medium">Conexión Segura</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className={cn([integralCF.className, "text-3xl sm:text-4xl font-bold text-gray-900 mb-4"])}>
            Completá tu Compra
          </h1>
          <p className="text-lg text-gray-600">
            Estás a un paso de adquirir tu dominio
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Columna Izquierda - Formulario */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dominio Seleccionado */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-12 w-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <Check className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-green-700 font-medium">Dominio Disponible</p>
                    <h3 className="text-2xl font-bold text-gray-900">{domain}</h3>
                  </div>
                </div>
              </motion.div>

              {/* Selección de Período */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white border border-gray-200 rounded-2xl p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[#ff9900]" />
                  Seleccioná el Período
                </h3>
                
                <div className="space-y-3">
                  {Object.entries(plans).map(([key, plan]) => (
                    <label
                      key={key}
                      className={cn(
                        "flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all",
                        selectedPlan === key
                          ? "border-[#ff9900] bg-[#ff9900]/5"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="plan"
                          value={key}
                          checked={selectedPlan === key}
                          onChange={(e) => setSelectedPlan(e.target.value as any)}
                          className="h-4 w-4 text-[#ff9900]"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{plan.period}</p>
                          {plan.discount > 0 && (
                            <p className="text-sm text-green-600 font-medium">
                              Ahorrás {plan.discount}%
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="text-xl font-bold text-gray-900">
                        ${plan.price.toLocaleString()}
                      </p>
                    </label>
                  ))}
                </div>
              </motion.div>

              {/* Datos del Cliente */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white border border-gray-200 rounded-2xl p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-[#ff9900]" />
                  Tus Datos
                </h3>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Completo *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff9900] focus:border-transparent outline-none transition"
                        placeholder="Juan Pérez"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff9900] focus:border-transparent outline-none transition"
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff9900] focus:border-transparent outline-none transition"
                        placeholder="+54 11 1234-5678"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Empresa (opcional)
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff9900] focus:border-transparent outline-none transition"
                        placeholder="Mi Empresa SA"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CUIT/CUIL (opcional)
                    </label>
                    <input
                      type="text"
                      value={formData.cuit}
                      onChange={(e) => setFormData({...formData, cuit: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff9900] focus:border-transparent outline-none transition"
                      placeholder="20-12345678-9"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Botón de Pago Mobile */}
              <div className="lg:hidden">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-[#ff9900] to-[#ff6600] text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-[#ff9900]/50 transition-all flex items-center justify-center gap-2"
                >
                  <CreditCard className="h-5 w-5" />
                  Proceder al Pago
                </motion.button>
              </div>
            </form>
          </div>

          {/* Columna Derecha - Resumen */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-24"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-6">Resumen del Pedido</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                  <Globe className="h-5 w-5 text-[#ff9900] mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{domain}</p>
                    <p className="text-sm text-gray-600">{selectedPlanData.period}</p>
                  </div>
                  <p className="font-bold text-gray-900">${selectedPlanData.price.toLocaleString()}</p>
                </div>

                <div className="space-y-3 py-4 border-b border-gray-100">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">${subtotal.toLocaleString()}</span>
                  </div>
                  {selectedPlanData.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuento ({selectedPlanData.discount}%)</span>
                      <span className="font-semibold">-${(subtotal * selectedPlanData.discount / 100).toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center py-4">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-[#ff9900]">${total.toLocaleString()}</span>
                </div>
              </div>

              {/* Botón de Pago Desktop */}
              <div className="hidden lg:block mb-6">
                <motion.button
                  type="submit"
                  form="checkout-form"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-[#ff9900] to-[#ff6600] text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-[#ff9900]/50 transition-all flex items-center justify-center gap-2"
                >
                  <CreditCard className="h-5 w-5" />
                  Proceder al Pago
                </motion.button>
              </div>

              {/* Garantías */}
              <div className="space-y-3 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>Pago 100% seguro</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Activación inmediata</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>Soporte 24/7</span>
                </div>
              </div>

              {/* Nota informativa */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-900">
                    Tu dominio será registrado y activado inmediatamente después del pago.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}



