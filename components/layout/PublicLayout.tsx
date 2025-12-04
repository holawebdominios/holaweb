'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollProgress from '@/components/ui/ScrollProgress';
import WhatsAppFAB from '@/components/ui/WhatsAppFAB';
import BackToTop from '@/components/ui/BackToTop';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // NO mostrar layout público en rutas admin y auth (login/register)
  const isAdminRoute = pathname?.startsWith('/admin');
  const isAuthRoute = pathname === '/login' || pathname === '/register';

  if (isAdminRoute || isAuthRoute) {
    // Rutas admin y auth: solo children (sin navbar/footer público)
    return <>{children}</>;
  }

  // Rutas públicas: con navbar/footer/fabs
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
      <WhatsAppFAB />
      <BackToTop />
    </>
  );
}

