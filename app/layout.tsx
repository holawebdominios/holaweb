import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import PublicLayout from '@/components/layout/PublicLayout';

const manrope = Manrope({ 
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: 'Hola Empresa - Verificación de Dominios .AR | El 0800 de siempre, pero ahora con Hola',
  description: 'Verificá disponibilidad de dominios .ar, .com.ar, .net.ar y más. El 0800 de siempre, pero ahora con Hola. Gestión profesional con recordatorios automáticos y monitoreo 24/7.',
  keywords: ['dominios', 'verificación', 'RDAP', '.ar', '.com.ar', 'gestión de dominios', 'hola empresa'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={manrope.className}>
        <AuthProvider>
          <PublicLayout>
            {children}
          </PublicLayout>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

