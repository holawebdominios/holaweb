import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollProgress from '@/components/ui/ScrollProgress';
import WhatsAppFAB from '@/components/ui/WhatsAppFAB';
import BackToTop from '@/components/ui/BackToTop';
import { Toaster } from 'sonner';

const manrope = Manrope({ 
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: 'Hola Web - Verificación de Dominios .AR | Gestión Profesional',
  description: 'Verificá disponibilidad de dominios .ar, .com.ar, .net.ar y más. Gestión profesional con recordatorios automáticos y monitoreo 24/7.',
  keywords: ['dominios', 'verificación', 'RDAP', '.ar', '.com.ar', 'gestión de dominios'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={manrope.className}>
        <ScrollProgress />
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <WhatsAppFAB />
        <BackToTop />
        <Toaster />
      </body>
    </html>
  );
}

