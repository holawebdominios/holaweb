import type { Metadata } from 'next';
import { Suspense } from 'react';
import DomainCheckPage from '@/components/domain-check/DomainCheckPage';

export const metadata: Metadata = {
  title: 'Verificar Dominio | DomainCheck',
  description: 'Verificá la disponibilidad de dominios .ar, .com.ar, .net.ar y más en tiempo real.',
};

export default function VerificarPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff9900]"></div>
      </div>
    }>
      <DomainCheckPage />
    </Suspense>
  );
}

