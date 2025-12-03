import { HeroContent, Benefit, HowItWorksStep } from '@/types/content';

export const homeHero: HeroContent = {
  title: "Verificá tu Dominio .COM.AR",
  subtitle: "en Segundos",
  description: "Verificación en tiempo real, recordatorios automáticos y gestión completa de tus dominios argentinos.",
  primaryCTA: {
    label: "Verificar Dominio",
    href: "/verificar",
  },
  secondaryCTA: {
    label: "Ver Planes",
    href: "/planes",
  },
  backgroundImage: "/images/hero-domains.jpg"
};

export const benefits: Benefit[] = [
  {
    id: "real-time",
    title: "Verificación en Tiempo Real",
    description: "Consultamos directamente RDAP de NIC Argentina para información actualizada al instante.",
    icon: "Zap",
    color: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  {
    id: "monitoring",
    title: "Monitoreo Continuo",
    description: "Seguimiento 24/7 de tus dominios con alertas automáticas de vencimiento y cambios.",
    icon: "Eye",
    color: "text-green-600",
    bgColor: "bg-green-100"
  },
  {
    id: "alerts",
    title: "Alertas Inteligentes",
    description: "Recordatorios por email y WhatsApp antes del vencimiento de tus dominios.",
    icon: "Bell",
    color: "text-amber-600",
    bgColor: "bg-amber-100"
  },
  {
    id: "multi-tld",
    title: "Múltiples TLDs",
    description: "Verificación de dominios .ar, .com.ar, .net.ar y .org.ar.",
    icon: "Globe",
    color: "text-purple-600",
    bgColor: "bg-purple-100"
  },
  {
    id: "dashboard",
    title: "Dashboard Intuitivo",
    description: "Panel de control simple y potente para gestionar todos tus dominios desde un solo lugar.",
    icon: "LayoutDashboard",
    color: "text-cyan-600",
    bgColor: "bg-cyan-100"
  },
  {
    id: "support",
    title: "Soporte Profesional",
    description: "Equipo especializado disponible para ayudarte con cualquier consulta sobre tus dominios.",
    icon: "Headphones",
    color: "text-orange-600",
    bgColor: "bg-orange-100"
  }
];

export const howItWorksSteps: HowItWorksStep[] = [
  {
    number: 1,
    title: "Buscás el Dominio",
    description: "Ingresás el nombre del dominio que querés verificar. Podés buscar múltiples dominios a la vez.",
    icon: "Search"
  },
  {
    number: 2,
    title: "Verificamos Disponibilidad",
    description: "Consultamos en tiempo real para obtener información actualizada al instante.",
    icon: "CheckCircle"
  },
  {
    number: 3,
    title: "Elegís tu Plan",
    description: "Seleccionás el plan que mejor se adapte a tus necesidades: básico, profesional o empresarial.",
    icon: "CreditCard"
  },
  {
    number: 4,
    title: "Nosotros Gestionamos",
    description: "Monitoreamos tus dominios 24/7 y te enviamos alertas automáticas antes de cada vencimiento.",
    icon: "Shield"
  }
];

