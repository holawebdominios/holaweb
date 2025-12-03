"use client";

import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { integralCF } from '@/styles/fonts';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getIdToken } from '@/lib/auth-service';
import { toast } from 'sonner';
import { 
  ArrowLeft, Check, Globe, Calendar, Shield, 
  CreditCard, Lock, AlertCircle, Mail, User, Phone, Building, Loader2
} from 'lucide-react';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const domain = searchParams.get('domain') || 'tudominio.com.ar';
  const { user } = useAuth();
  
  const [selectedPlan, setSelectedPlan] = useState<'PERIOD_1_MONTH' | 'PERIOD_1_YEAR' | 'PERIOD_2_YEARS'>('PERIOD_1_YEAR');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    cuit: '',
  });
  
  const isDevelopment = typeof window !== 'undefined' && 
                       window.location.hostname === 'localhost';

  const plans = {
    'PERIOD_1_MONTH': { period: '1 mes', price: 5900, discount: 0 },
    'PERIOD_1_YEAR': { period: '12 meses', price: 5900 * 12, discount: 0 },
    'PERIOD_2_YEARS': { period: '24 meses', price: 5900 * 24, discount: 0 },
  };

  const selectedPlanData = plans[selectedPlan];
  const total = selectedPlanData.price;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulario
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Completá todos los campos obligatorios');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Obtener token si el usuario está autenticado
      const token = await getIdToken();
      
      // Llamar al endpoint seguro para crear la orden
      const response = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          domain,
          periodId: selectedPlan,
          customerData: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            company: formData.company || undefined,
            cuit: formData.cuit || undefined,
          },
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al procesar la orden');
      }
      
      const data = await response.json();
      
      // Si está en modo demo, mostrar mensaje
      if (data.demo) {
        toast.error(data.message || 'Sistema de pagos no configurado');
        toast.info('El checkout está listo. Configura Firebase y Mercado Pago para habilitar pagos reales.');
        setIsProcessing(false);
        return;
      }
      
      if (data.success && data.orderId) {
        const orderId = data.orderId;
        
        // EN LOCALHOST: Simular pago automáticamente
        if (isDevelopment) {
          toast.success('🧪 Simulando pago...');
          
          // Simular el pago
          const simulateResponse = await fetch('/api/checkout/simulate-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderId }),
          });
          
          const simulateData = await simulateResponse.json();
          
          if (simulateData.success) {
            toast.success('¡Pago simulado exitosamente!');
            // Redirigir a success
            setTimeout(() => {
              window.location.href = `/checkout/success?orderId=${orderId}`;
            }, 1000);
          } else {
            throw new Error(simulateData.error || 'Error al simular pago');
          }
        } else {
          // EN PRODUCCIÓN: Redirigir a Mercado Pago
          if (data.mercadopago?.init_point) {
            toast.success('Redirigiendo a Mercado Pago...');
            window.location.href = data.mercadopago.init_point;
          } else {
            throw new Error('Error al crear preferencia de pago');
          }
        }
      } else {
        throw new Error('Error al crear orden');
      }
      
    } catch (error) {
      console.error('Error en checkout:', error);
      toast.error(error instanceof Error ? error.message : 'Error al procesar el pago');
      setIsProcessing(false);
    }
  };

  const handleSimulatePayment = async () => {
    if (!lastOrderId) {
      toast.error('Primero debes crear una orden');
      return;
    }
    
    setIsSimulating(true);
    
    try {
      const response = await fetch('/api/checkout/simulate-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: lastOrderId,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('¡Pago simulado exitosamente!');
        // Redirigir a success
        setTimeout(() => {
          window.location.href = `/checkout/success?orderId=${lastOrderId}`;
        }, 1000);
      } else {
        throw new Error(data.error || 'Error al simular pago');
      }
      
    } catch (error) {
      console.error('Error simulando pago:', error);
      toast.error(error instanceof Error ? error.message : 'Error al simular pago');
      setIsSimulating(false);
    }
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
                          <p className="text-sm text-gray-600">
                            ${(5900).toLocaleString()}/mes
                          </p>
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
              <div className="lg:hidden space-y-3">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isProcessing || isSimulating}
                  className="w-full bg-gradient-to-r from-[#ff9900] to-[#ff6600] text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-[#ff9900]/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5" />
                      {isDevelopment ? 'Proceder al Pago (Demo)' : 'Proceder al Pago'}
                    </>
                  )}
                </motion.button>
                
                {/* Info de modo desarrollo */}
                {isDevelopment && (
                  <div className="text-xs text-center text-purple-600 bg-purple-50 rounded-lg py-2 px-3">
                    🧪 Modo desarrollo: El pago se simulará automáticamente
                  </div>
                )}
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
                    <span>Total</span>
                    <span className="font-semibold">${total.toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {`$${(5900).toLocaleString()}/mes durante ${selectedPlanData.period}`}
                  </div>
                </div>

                <div className="flex justify-between items-center py-4">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-[#ff9900]">${total.toLocaleString()}</span>
                </div>
              </div>

              {/* Botón de Pago Desktop */}
              <div className="hidden lg:block mb-6 space-y-3">
                <motion.button
                  type="submit"
                  form="checkout-form"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={isProcessing || isSimulating}
                  className="w-full bg-gradient-to-r from-[#ff9900] to-[#ff6600] text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-[#ff9900]/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5" />
                      {isDevelopment ? 'Proceder al Pago (Demo)' : 'Proceder al Pago'}
                    </>
                  )}
                </motion.button>
                
                {/* Info de modo desarrollo */}
                {isDevelopment && (
                  <div className="text-xs text-center text-purple-600 bg-purple-50 rounded-lg py-2 px-3">
                    🧪 Modo desarrollo: El pago se simulará automáticamente
                  </div>
                )}
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



