"use client";

import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { integralCF } from '@/styles/fonts';
import { cn } from '@/lib/utils';
import { Mail, Lock, User, Loader2, ArrowLeft, ArrowRight, Gift } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInWithGoogle, registerWithEmail } from '@/lib/auth-service';
import { toast } from 'sonner';
import Logo from '@/components/ui/Logo';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get('email');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState(emailFromUrl || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast.error('Completá todos los campos');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    
    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    if (!acceptTerms) {
      toast.error('Debes aceptar los términos y condiciones');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await registerWithEmail(email, password, name);
      toast.success('¡Cuenta creada exitosamente!');
      
      // Si viene de una compra, mostrar mensaje especial
      if (emailFromUrl) {
        toast.success('Tus dominios comprados han sido vinculados a tu cuenta', { duration: 5000 });
      }
      
      router.push('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al registrar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    if (!acceptTerms) {
      toast.error('Debes aceptar los términos y condiciones');
      return;
    }
    
    setIsGoogleLoading(true);
    
    try {
      await signInWithGoogle();
      toast.success('¡Cuenta creada exitosamente!');
      router.push('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al registrar con Google');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue via-brand-blueDark to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        {/* Card principal */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header con fondo */}
          <div className="bg-gradient-to-r from-brand-yellow to-brand-yellowDark p-8 text-center">
            <div className="mb-4 flex justify-center">
              <Logo variant="white" size="lg" />
            </div>
            <h1 className={cn([integralCF.className, "text-4xl font-bold text-white mb-2 leading-tight"])}>
              Crear Cuenta
            </h1>
            <p className="text-white/90 text-base">
              {emailFromUrl ? 'Gestioná tu dominio recién comprado' : 'Comenzá a gestionar tus dominios hoy'}
            </p>
            
            {emailFromUrl && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-3 text-sm text-white flex items-center gap-2"
              >
                <Gift className="h-4 w-4 flex-shrink-0" />
                <span className="text-left">Al crear tu cuenta, vincularemos automáticamente tu dominio</span>
              </motion.div>
            )}
          </div>

          {/* Formulario */}
          <div className="p-8">
          {/* Botón de Google - Temporalmente oculto
          <button
            onClick={handleGoogleRegister}
            disabled={isGoogleLoading || isLoading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 border-2 border-gray-300 rounded-xl hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            {isGoogleLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-semibold text-gray-700">Registrate con Google</span>
              </>
            )}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">O con email</span>
            </div>
          </div>
          */}

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Nombre */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre Completo
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none transition-all"
                  placeholder="Juan Pérez"
                  disabled={isLoading || isGoogleLoading}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none transition-all"
                  placeholder="tu@email.com"
                  disabled={isLoading || isGoogleLoading}
                  required
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none transition-all"
                  placeholder="Mínimo 6 caracteres"
                  disabled={isLoading || isGoogleLoading}
                  required
                />
              </div>
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none transition-all"
                  placeholder="Repetí tu contraseña"
                  disabled={isLoading || isGoogleLoading}
                  required
                />
              </div>
            </div>

            {/* Términos y condiciones */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-brand-yellow focus:ring-brand-yellow transition flex-shrink-0"
                  required
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition">
                  Acepto los{' '}
                  <Link href="/terminos" className="text-brand-yellow hover:text-brand-yellowDark font-semibold transition-colors">
                    términos y condiciones
                  </Link>
                  {' '}y la{' '}
                  <Link href="/privacidad" className="text-brand-yellow hover:text-brand-yellowDark font-semibold transition-colors">
                    política de privacidad
                  </Link>
                </span>
              </label>
            </div>

            {/* Botón de registro */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={isLoading || isGoogleLoading}
              className="w-full bg-gradient-to-r from-brand-blue to-brand-blueDark text-white py-4 rounded-xl text-base font-bold hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Creando cuenta...</span>
                </>
              ) : (
                <>
                  <span>Crear Cuenta</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Separador */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">¿Ya tenés cuenta?</span>
            </div>
          </div>

          {/* Link a login */}
          <div className="text-center">
            <p className="text-gray-600 text-base mb-3">
              Ingresá con tu cuenta existente
            </p>
            <Link 
              href="/login" 
              className="inline-block w-full py-3.5 px-6 bg-gray-50 hover:bg-gray-100 text-brand-blue rounded-xl text-base font-bold transition-all border-2 border-gray-200 hover:border-brand-blue"
            >
              Iniciar Sesión
            </Link>
          </div>

          {/* Volver al inicio */}
          <div className="mt-6 text-center">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Volver al inicio</span>
            </Link>
          </div>
        </div>
      </div>
      </motion.div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-yellow" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}

