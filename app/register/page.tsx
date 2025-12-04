"use client";

import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { integralCF } from '@/styles/fonts';
import { cn } from '@/lib/utils';
import { Mail, Lock, User, Loader2, ArrowLeft, Gift } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo y volver */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Volver al inicio</span>
          </Link>
          
          <div className="mt-4 mb-6 flex justify-center">
            <Logo variant="default" size="md" />
          </div>
          
          <h1 className={cn([integralCF.className, "text-3xl font-bold text-gray-900 mb-2"])}>
            Crear Cuenta
          </h1>
          <p className="text-gray-600">
            {emailFromUrl ? 'Gestioná tu dominio recién comprado' : 'Comenzá a gestionar tus dominios hoy'}
          </p>
          
          {emailFromUrl && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-900 flex items-center gap-2"
            >
              <Gift className="h-4 w-4" />
              <span>Al crear tu cuenta, vincularemos automáticamente tu dominio comprado</span>
            </motion.div>
          )}
        </div>

        {/* Card de registro */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
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

          {/* Formulario de registro */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none transition"
                  placeholder="Juan Pérez"
                  disabled={isLoading || isGoogleLoading}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none transition"
                  placeholder="tu@email.com"
                  disabled={isLoading || isGoogleLoading}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none transition"
                  placeholder="Mínimo 6 caracteres"
                  disabled={isLoading || isGoogleLoading}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none transition"
                  placeholder="Repetí tu contraseña"
                  disabled={isLoading || isGoogleLoading}
                  required
                />
              </div>
            </div>

            <div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-[brand-yellow] focus:ring-brand-yellow"
                  required
                />
                <span className="text-sm text-gray-600">
                  Acepto los{' '}
                  <Link href="/terminos" className="text-[brand-yellow] hover:text-[brand-yellowDark] font-medium">
                    términos y condiciones
                  </Link>
                  {' '}y la{' '}
                  <Link href="/privacidad" className="text-[brand-yellow] hover:text-[brand-yellowDark] font-medium">
                    política de privacidad
                  </Link>
                </span>
              </label>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading || isGoogleLoading}
              className="w-full bg-gradient-to-r from-brand-yellow to-brand-yellowDark text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                'Crear Cuenta'
              )}
            </motion.button>
          </form>

          {/* Link a login */}
          <div className="mt-6 text-center text-sm text-gray-600">
            ¿Ya tenés cuenta?{' '}
            <Link href="/login" className="text-[brand-yellow] hover:text-[brand-yellowDark] font-semibold">
              Iniciá sesión
            </Link>
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

