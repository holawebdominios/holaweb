import type { Metadata } from 'next';
import PlansPage from '@/components/pricing/PlansPage';

export const metadata: Metadata = {
  title: 'Planes y Precios | Hola Empresa',
  description: 'Elegí el plan perfecto para gestionar tus dominios. Planes desde $2,500/mes con monitoreo 24/7.',
};

export default function PlanesPageRoute() {
  return <PlansPage />;
}

