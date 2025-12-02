import { Plan } from '@/types/plan';

export const plans: Plan[] = [
  {
    id: "basic",
    type: "basic",
    name: "Básico",
    tagline: "Para emprendedores",
    description: "Ideal para quienes tienen 1-3 dominios y necesitan verificación básica.",
    pricing: {
      monthly: 2500,
      annual: 25000,
      currency: "ARS",
      discount: {
        percentage: 17,
        label: "17% OFF"
      }
    },
    features: [
      { id: "1", label: "Hasta 3 dominios", included: true, value: "3" },
      { id: "2", label: "Verificación mensual", included: true },
      { id: "3", label: "Alertas por email", included: true },
      { id: "4", label: "Dashboard básico", included: true },
      { id: "5", label: "Soporte por email", included: true },
      { id: "6", label: "Alertas por WhatsApp", included: false },
      { id: "7", label: "API access", included: false },
      { id: "8", label: "Soporte prioritario", included: false }
    ],
    limits: {
      domains: 3,
      checks: 30,
      alerts: true,
      support: "email"
    },
    ctaLabel: "Comenzar Ahora",
    ctaAction: "/contacto?plan=basic"
  },
  {
    id: "pro",
    type: "pro",
    name: "Profesional",
    tagline: "Para empresas",
    description: "Perfecto para empresas con múltiples dominios que necesitan gestión completa.",
    pricing: {
      monthly: 5900,
      annual: 59000,
      currency: "ARS",
      discount: {
        percentage: 17,
        label: "17% OFF"
      }
    },
    features: [
      { id: "1", label: "Hasta 15 dominios", included: true, value: "15", highlighted: true },
      { id: "2", label: "Verificación semanal", included: true },
      { id: "3", label: "Alertas por email", included: true },
      { id: "4", label: "Alertas por WhatsApp", included: true, highlighted: true },
      { id: "5", label: "Dashboard avanzado", included: true },
      { id: "6", label: "Soporte prioritario", included: true },
      { id: "7", label: "Reportes mensuales", included: true },
      { id: "8", label: "API access", included: false }
    ],
    limits: {
      domains: 15,
      checks: 'unlimited',
      alerts: true,
      support: "24/7"
    },
    badge: "Popular",
    badgeColor: "bg-[#ff9900]",
    highlighted: true,
    ctaLabel: "Elegir Plan Pro",
    ctaAction: "/contacto?plan=pro"
  },
  {
    id: "enterprise",
    type: "enterprise",
    name: "Empresarial",
    tagline: "Para organizaciones",
    description: "Solución completa para organizaciones con portfolio extenso de dominios.",
    pricing: {
      monthly: 15000,
      annual: 150000,
      currency: "ARS",
      discount: {
        percentage: 17,
        label: "17% OFF"
      }
    },
    features: [
      { id: "1", label: "Dominios ilimitados", included: true, value: "∞", highlighted: true },
      { id: "2", label: "Verificación diaria", included: true },
      { id: "3", label: "Alertas multicanal", included: true },
      { id: "4", label: "Dashboard empresarial", included: true },
      { id: "5", label: "Soporte dedicado", included: true, highlighted: true },
      { id: "6", label: "API access completo", included: true },
      { id: "7", label: "Reportes personalizados", included: true },
      { id: "8", label: "Gestión de equipo", included: true }
    ],
    limits: {
      domains: 'unlimited',
      checks: 'unlimited',
      alerts: true,
      support: "24/7"
    },
    badge: "Empresas",
    badgeColor: "bg-[#13314c]",
    ctaLabel: "Contactar Ventas",
    ctaAction: "/contacto?plan=enterprise"
  }
];

