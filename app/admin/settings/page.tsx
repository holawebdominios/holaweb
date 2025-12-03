'use client';

import { motion } from 'framer-motion';
import { Settings, Shield, Database, Key, AlertTriangle } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="h-8 w-8 text-[#0066CC]" />
          Configuración
        </h1>
        <p className="text-gray-600 mt-1">
          Ajustes del sistema y configuración avanzada
        </p>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Seguridad */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#0066CC]" />
            Seguridad
          </h2>

          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-900 mb-1">
                    Firebase Auth Configurado
                  </p>
                  <p className="text-sm text-green-700">
                    Autenticación y autorización funcionando correctamente
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Key className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900 mb-1">
                    Usuario Admin
                  </p>
                  <p className="text-sm text-blue-700">
                    admin@admin.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Base de Datos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Database className="h-5 w-5 text-[#0066CC]" />
            Base de Datos
          </h2>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="font-semibold text-gray-900 mb-2">Colecciones Activas</p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• users</li>
                <li>• orders</li>
                <li>• domains</li>
                <li>• alerts</li>
              </ul>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="font-semibold text-gray-900 mb-2">Firestore</p>
              <p className="text-sm text-gray-600">
                Proyecto: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'No configurado'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Advertencias */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-orange-50 rounded-xl p-6 border border-orange-200"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-orange-600 mt-0.5" />
            <div>
              <h3 className="font-bold text-orange-900 mb-2">
                Recordatorios de Seguridad
              </h3>
              <ul className="space-y-2 text-sm text-orange-800">
                <li>
                  • <strong>Elimina el endpoint</strong> <code className="bg-orange-100 px-1 py-0.5 rounded">/api/admin/init</code> antes de ir a producción
                </li>
                <li>
                  • El acceso al panel admin está protegido por Firebase Custom Claims
                </li>
                <li>
                  • Todos los endpoints validan el token y rol de administrador server-side
                </li>
                <li>
                  • Mantené las credenciales de admin@admin.com en lugar seguro
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

