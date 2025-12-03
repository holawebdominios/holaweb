# Modelo de Contenido y Datos

## Tipos TypeScript - Parte Pública

### 1. Dominio (`types/domain.ts`)

```typescript
// Estado de disponibilidad del dominio
export type DomainStatus = 
  | 'available'      // Disponible para registrar
  | 'registered'     // Ya registrado
  | 'premium'        // Premium/reservado
  | 'restricted'     // Restringido
  | 'error'          // Error en consulta
  | 'checking';      // Consultando...

// TLDs soportados
export type TLD = 
  | '.ar'
  | '.com.ar'
  | '.net.ar'
  | '.org.ar'
  | '.com'
  | '.net'
  | '.org'
  | '.io';

// Información completa del dominio
export interface DomainInfo {
  domain: string;                    // Nombre completo (ej: "ejemplo.com.ar")
  name: string;                      // Solo el nombre (ej: "ejemplo")
  tld: TLD;                          // Extensión
  status: DomainStatus;              // Estado
  available: boolean;                // Disponible o no
  
  // Información WHOIS/RDAP (si está registrado)
  registrationDate?: string;         // Fecha de registro
  expirationDate?: string;           // Fecha de vencimiento
  registrant?: string;               // Registrante
  registrar?: string;                // Registrador
  nameservers?: string[];            // DNS
  
  // Metadata
  lastChecked: string;               // Última verificación
  source: 'rdap' | 'whois' | 'cache'; // Fuente de datos
  
  // UI
  isPremium?: boolean;               // Si es premium
  suggestedPrice?: number;           // Precio sugerido
  alternativeSuggestions?: string[]; // Sugerencias alternativas
}

// Request de búsqueda
export interface DomainSearchRequest {
  query: string;                     // Búsqueda del usuario
  tlds: TLD[];                       // TLDs a verificar
  includeAlternatives?: boolean;     // Incluir sugerencias
}

// Response de búsqueda
export interface DomainSearchResponse {
  results: DomainInfo[];             // Resultados
  suggestions: DomainInfo[];         // Sugerencias
  searchTime: number;                // Tiempo de búsqueda (ms)
  cached: boolean;                   // Si vino de caché
}
```

---

### 2. Planes (`types/plan.ts`)

```typescript
// Tipo de plan
export type PlanType = 'basic' | 'pro' | 'enterprise' | 'custom';

// Período de facturación
export type BillingPeriod = 'monthly' | 'annual' | 'biannual';

// Beneficio del plan
export interface PlanFeature {
  id: string;
  label: string;                     // Texto del beneficio
  included: boolean;                 // Si está incluido
  value?: string | number;           // Valor (ej: "10 dominios")
  tooltip?: string;                  // Explicación adicional
  highlighted?: boolean;             // Si se destaca
}

// Plan completo
export interface Plan {
  id: string;
  type: PlanType;
  name: string;                      // Nombre del plan
  tagline: string;                   // Descripción corta
  description: string;               // Descripción completa
  
  // Precios
  pricing: {
    monthly: number;
    annual: number;
    biannual?: number;
    currency: string;                // 'ARS', 'USD'
    discount?: {
      percentage: number;
      label: string;                 // "20% OFF"
    };
  };
  
  // Características
  features: PlanFeature[];
  
  // Límites
  limits: {
    domains: number | 'unlimited';   // Cantidad de dominios
    checks: number | 'unlimited';    // Verificaciones por mes
    alerts: boolean;                 // Alertas de vencimiento
    support: '24/7' | 'business-hours' | 'email';
  };
  
  // UI
  badge?: string;                    // "Popular", "Recomendado"
  badgeColor?: string;
  highlighted?: boolean;             // Si se destaca visualmente
  ctaLabel?: string;                 // Texto del botón
  ctaAction?: string;                // Acción del botón
}
```

---

### 3. Beneficios (`types/benefit.ts`)

```typescript
// Beneficio del servicio
export interface Benefit {
  id: string;
  title: string;                     // Título del beneficio
  description: string;               // Descripción
  icon: string;                      // Nombre del icono (lucide-react)
  color: string;                     // Color del icono
  bgColor: string;                   // Color de fondo
  link?: string;                     // Link opcional
}
```

---

### 4. FAQ (`types/faq.ts`)

```typescript
// Categoría de FAQ
export type FAQCategory = 
  | 'general'
  | 'dominios'
  | 'planes'
  | 'pagos'
  | 'tecnico'
  | 'legal';

// Pregunta frecuente
export interface FAQItem {
  id: string;
  category: FAQCategory;
  question: string;                  // Pregunta
  answer: string;                    // Respuesta (puede incluir HTML)
  keywords?: string[];               // Para búsqueda
  order?: number;                    // Orden de aparición
}

// Grupo de FAQs por categoría
export interface FAQGroup {
  category: FAQCategory;
  label: string;                     // Nombre de la categoría
  icon: string;                      // Icono
  items: FAQItem[];
}
```

---

### 5. Testimonio (`types/testimonial.ts`)

```typescript
// Testimonio de cliente
export interface Testimonial {
  id: string;
  name: string;                      // Nombre del cliente
  role?: string;                     // Cargo/empresa
  avatar?: string;                   // URL del avatar
  initials: string;                  // Iniciales (si no hay avatar)
  rating: 1 | 2 | 3 | 4 | 5;         // Calificación
  text: string;                      // Testimonio
  project?: string;                  // Proyecto relacionado
  date?: string;                     // Fecha del testimonio
  featured?: boolean;                // Si se destaca
}
```

---

### 6. Contenido del Sitio (`types/content.ts`)

```typescript
// Configuración del Hero
export interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  primaryCTA: {
    label: string;
    href: string;
    action?: () => void;
  };
  secondaryCTA: {
    label: string;
    href: string;
  };
  backgroundImage: string;
}

// Sección institucional
export interface InstitutionalContent {
  title: string;
  paragraphs: string[];
  image: string;
  stats?: {
    value: string;
    label: string;
    icon: string;
  }[];
}

// Paso del "Cómo funciona"
export interface HowItWorksStep {
  number: number;
  title: string;
  description: string;
  icon: string;
}

// Información de contacto
export interface ContactInfo {
  email: string;
  phone: string;
  whatsapp: string;
  address?: string;
  schedule?: {
    days: string;
    hours: string;
  };
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}
```

---

## Configuración de Contenido

### Archivo Central: `config/content.ts`

```typescript
import { HeroContent, InstitutionalContent, Benefit, HowItWorksStep } from '@/types/content';

// Hero del Home
export const homeHero: HeroContent = {
  title: "Verificá tu Dominio COM.AR en Segundos",
  subtitle: "Gestión Profesional de Dominios",
  description: "Verificación en tiempo real, recordatorios automáticos y gestión completa de tus dominios argentinos e internacionales.",
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

// Contenido institucional
export const institutionalContent: InstitutionalContent = {
  title: "Gestión Profesional de Dominios",
  paragraphs: [
    "Somos especialistas en verificación y gestión de dominios argentinos (.ar, .com.ar, .net.ar, .org.ar) e internacionales.",
    "Con tecnología de punta y conexión directa con RDAP de NIC Argentina, ofrecemos información actualizada en tiempo real.",
    "Nuestro servicio incluye monitoreo constante, alertas de vencimiento y gestión proactiva para que nunca pierdas tu dominio."
  ],
  image: "/images/institucional.jpg",
  stats: [
    { value: "1000+", label: "Dominios Verificados", icon: "Globe" },
    { value: "500+", label: "Clientes Satisfechos", icon: "Users" },
    { value: "24/7", label: "Monitoreo Activo", icon: "Clock" }
  ]
};

// Beneficios del servicio
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
    description: "Verificación de dominios .ar, .com.ar, .net.ar, .org.ar y más de 500 TLDs internacionales.",
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

// Cómo funciona (steps)
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
    description: "Consultamos en tiempo real RDAP de NIC Argentina y bases de datos internacionales.",
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
```

---

### Archivo de Planes: `config/plans.ts`

```typescript
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
```

---

### Archivo de FAQs: `config/faqs.ts`

```typescript
import { FAQGroup } from '@/types/faq';

export const faqGroups: FAQGroup[] = [
  {
    category: 'general',
    label: 'General',
    icon: 'HelpCircle',
    items: [
      {
        id: 'q1',
        category: 'general',
        question: '¿Qué es este servicio?',
        answer: 'Es una plataforma profesional para verificar disponibilidad de dominios argentinos e internacionales, con gestión y monitoreo continuo.',
        keywords: ['servicio', 'que es', 'plataforma']
      },
      {
        id: 'q2',
        category: 'general',
        question: '¿Cómo funciona la verificación?',
        answer: 'Consultamos directamente RDAP de NIC Argentina para dominios .ar y APIs especializadas para dominios internacionales, obteniendo información en tiempo real.',
        keywords: ['verificacion', 'como funciona', 'rdap']
      },
      {
        id: 'q3',
        category: 'general',
        question: '¿Es gratis verificar un dominio?',
        answer: 'Sí, la verificación básica es completamente gratuita. Los planes pagos incluyen monitoreo continuo, alertas y gestión profesional.',
        keywords: ['gratis', 'precio', 'costo']
      }
    ]
  },
  {
    category: 'dominios',
    label: 'Dominios',
    icon: 'Globe',
    items: [
      {
        id: 'd1',
        category: 'dominios',
        question: '¿Qué dominios puedo verificar?',
        answer: 'Dominios argentinos (.ar, .com.ar, .net.ar, .org.ar) y más de 500 extensiones internacionales (.com, .net, .io, etc.).',
        keywords: ['dominios', 'tld', 'extensiones']
      },
      {
        id: 'd2',
        category: 'dominios',
        question: '¿Puedo verificar múltiples dominios a la vez?',
        answer: 'Sí, podés ingresar varios dominios separados por comas y verificarlos simultáneamente.',
        keywords: ['multiples', 'varios', 'bulk']
      },
      {
        id: 'd3',
        category: 'dominios',
        question: '¿Qué información obtengo de un dominio registrado?',
        answer: 'Fecha de registro, fecha de vencimiento, registrante (si es público), registrador, nameservers y estado actual.',
        keywords: ['informacion', 'whois', 'datos']
      }
    ]
  },
  {
    category: 'planes',
    label: 'Planes y Precios',
    icon: 'CreditCard',
    items: [
      {
        id: 'p1',
        category: 'planes',
        question: '¿Cuál es la diferencia entre los planes?',
        answer: 'Los planes se diferencian por cantidad de dominios, frecuencia de verificación, tipos de alertas y nivel de soporte.',
        keywords: ['diferencia', 'planes', 'comparacion']
      },
      {
        id: 'p2',
        category: 'planes',
        question: '¿Puedo cambiar de plan después?',
        answer: 'Sí, podés actualizar o cambiar tu plan en cualquier momento desde tu dashboard.',
        keywords: ['cambiar', 'upgrade', 'downgrade']
      },
      {
        id: 'p3',
        category: 'planes',
        question: '¿Hay descuento por pago anual?',
        answer: 'Sí, el pago anual tiene un 17% de descuento comparado con el pago mensual.',
        keywords: ['descuento', 'anual', 'ahorro']
      }
    ]
  },
  {
    category: 'tecnico',
    label: 'Técnico',
    icon: 'Code',
    items: [
      {
        id: 't1',
        category: 'tecnico',
        question: '¿Qué es RDAP?',
        answer: 'RDAP (Registration Data Access Protocol) es el protocolo moderno que reemplaza a WHOIS, ofreciendo datos estructurados y estandarizados sobre dominios.',
        keywords: ['rdap', 'whois', 'protocolo']
      },
      {
        id: 't2',
        category: 'tecnico',
        question: '¿Tienen API disponible?',
        answer: 'Sí, los planes Profesional y Empresarial incluyen acceso a nuestra API REST para integrar verificaciones en tus sistemas.',
        keywords: ['api', 'integracion', 'rest']
      }
    ]
  }
];
```

---

### Archivo de Configuración del Sitio: `config/site.ts`

```typescript
export const siteConfig = {
  name: "DomainCheck",
  description: "Verificación y gestión profesional de dominios argentinos e internacionales",
  url: "https://domaincheck.com.ar",
  
  // Información de contacto
  contact: {
    email: "info@domaincheck.com.ar",
    phone: "+54 11 1234-5678",
    whatsapp: "5491112345678",
    address: "Buenos Aires, Argentina"
  },
  
  // Redes sociales
  social: {
    twitter: "https://twitter.com/domaincheck",
    linkedin: "https://linkedin.com/company/domaincheck",
    instagram: "https://instagram.com/domaincheck"
  },
  
  // Colores de marca
  colors: {
    primary: "#13314c",      // Azul oscuro
    secondary: "#ff9900",    // Naranja
    accent: "#ff6600",       // Naranja oscuro
    success: "#22c55e",      // Verde
    error: "#ef4444",        // Rojo
    warning: "#f59e0b"       // Amarillo
  },
  
  // TLDs soportados
  supportedTLDs: {
    argentina: ['.ar', '.com.ar', '.net.ar', '.org.ar'],
    international: ['.com', '.net', '.org', '.io', '.app', '.dev']
  },
  
  // Límites públicos
  publicLimits: {
    maxDomainsPerSearch: 10,
    searchCooldown: 2000, // ms entre búsquedas
    resultsPerPage: 20
  }
};
```

---

## Parametrización del Contenido

### Ventajas del Sistema
1. **Contenido centralizado**: Todo en archivos de configuración
2. **Type-safe**: TypeScript valida la estructura
3. **Fácil mantenimiento**: Cambios sin tocar componentes
4. **Multiidioma ready**: Preparado para i18n
5. **Testing**: Fácil de mockear

### Flujo de Uso

```typescript
// En un componente
import { homeHero } from '@/config/content';

export default function HeroSection() {
  return (
    <section>
      <h1>{homeHero.title}</h1>
      <p>{homeHero.description}</p>
      <Button href={homeHero.primaryCTA.href}>
        {homeHero.primaryCTA.label}
      </Button>
    </section>
  );
}
```

---

## Validaciones

### Validación de Dominio (`lib/validations.ts`)

```typescript
import { z } from 'zod';

// Schema de validación de dominio
export const domainSchema = z.object({
  name: z.string()
    .min(1, "El dominio no puede estar vacío")
    .max(63, "El dominio no puede tener más de 63 caracteres")
    .regex(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/i, "Formato de dominio inválido")
    .transform(val => val.toLowerCase()),
  tld: z.enum(['.ar', '.com.ar', '.net.ar', '.org.ar', '.com', '.net', '.org', '.io'])
});

// Schema de búsqueda múltiple
export const domainSearchSchema = z.object({
  domains: z.array(z.string()).min(1).max(10),
  tlds: z.array(z.string()).min(1),
  includeAlternatives: z.boolean().optional()
});

// Funciones de validación
export function isValidDomainName(name: string): boolean {
  return domainSchema.shape.name.safeParse(name).success;
}

export function sanitizeDomainInput(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0];
}
```

---

## Estados de UI

### Loading States

```typescript
export type LoadingState = 
  | 'idle'       // Sin acción
  | 'loading'    // Cargando
  | 'success'    // Éxito
  | 'error';     // Error

export interface UIState {
  loading: LoadingState;
  error?: string;
  message?: string;
}
```

### Form States

```typescript
export interface FormState {
  isSubmitting: boolean;
  isValid: boolean;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}
```

---

## Contenido Dinámico vs Estático

### Contenido Estático (Fase 1)
- Textos del Hero
- Beneficios
- Pasos de "Cómo funciona"
- FAQs
- Planes
- Información de contacto

**Ubicación**: Archivos en `config/`

### Contenido Dinámico (Futuro)
- Resultados de verificación de dominios
- Estadísticas en tiempo real
- Testimonios desde base de datos
- Blog posts
- Noticias

**Ubicación**: API Routes + Base de datos

---

## Ejemplo de Uso Completo

```typescript
// app/page.tsx
import { homeHero, benefits, howItWorksSteps } from '@/config/content';
import { plans } from '@/config/plans';

export default function HomePage() {
  return (
    <HomePageContent
      hero={homeHero}
      benefits={benefits}
      steps={howItWorksSteps}
      featuredPlans={plans.filter(p => p.highlighted)}
    />
  );
}
```

Este modelo permite cambiar todo el contenido sin tocar código de componentes.

