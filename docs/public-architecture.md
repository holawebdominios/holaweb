# Arquitectura de la Parte Pública

## Páginas del Sitio (App Router)

### 1. Home `/`
**Archivo**: `app/page.tsx`

**Propósito**: Landing page principal que presenta el servicio y convierte visitantes.

**Secciones**:
- Hero/Banner principal
- Presentación institucional
- Beneficios del servicio (cards)
- Verificador rápido (versión simplificada)
- Planes destacados
- Testimonios/Social proof
- CTA final
- Contacto

**Componentes principales**:
```typescript
<HomePageContent>
  <HeroSection />
  <InstitutionalSection />
  <BenefitsSection />
  <QuickDomainCheckSection />
  <FeaturedPlansSection />
  <TestimonialsSection />
  <CTASection />
  <ContactSection />
</HomePageContent>
```

---

### 2. Verificador `/verificar`
**Archivo**: `app/verificar/page.tsx`

**Propósito**: Página dedicada a la verificación completa de dominios.

**Funcionalidades**:
- Input principal para búsqueda
- Selector de TLD (.com.ar, .ar, .net.ar, .org.ar)
- Resultados detallados
- Comparación de múltiples dominios
- Sugerencias de dominios alternativos
- CTA para contratar gestión

**Componentes principales**:
```typescript
<DomainCheckPage>
  <DomainSearchForm />
  <TLDSelector />
  <SearchResults />
  <DomainSuggestions />
  <CTABanner />
</DomainCheckPage>
```

---

### 3. Planes `/planes`
**Archivo**: `app/planes/page.tsx`

**Propósito**: Presentación detallada de planes y servicios.

**Secciones**:
- Hero de planes
- Comparación de planes (tabla o cards)
- Beneficios por plan
- FAQ de planes
- CTA de contratación

**Componentes principales**:
```typescript
<PlansPage>
  <PlansHero />
  <PricingComparison />
  <PlanBenefits />
  <PlansFAQ />
  <ContactCTA />
</PlansPage>
```

---

### 4. Preguntas Frecuentes `/faq`
**Archivo**: `app/faq/page.tsx`

**Propósito**: Responder dudas comunes de usuarios.

**Estructura**:
- Buscador de preguntas
- Categorías de FAQ
- Acordeón de preguntas/respuestas
- CTA de contacto si no encuentra respuesta

**Componentes principales**:
```typescript
<FAQPage>
  <FAQHero />
  <FAQSearch />
  <FAQCategories />
  <FAQAccordion />
  <ContactCTA />
</FAQPage>
```

---

### 5. Contacto `/contacto`
**Archivo**: `app/contacto/page.tsx`

**Propósito**: Facilitar comunicación con el equipo.

**Elementos**:
- Información de contacto
- Formulario de contacto
- Mapa (opcional)
- Enlaces a redes sociales
- Horarios de atención

**Componentes principales**:
```typescript
<ContactPage>
  <ContactHero />
  <ContactInfo />
  <ContactForm />
  <SocialLinks />
</ContactPage>
```

---

### 6. Páginas Legales

#### Política de Privacidad `/privacidad`
**Archivo**: `app/privacidad/page.tsx`

#### Términos y Condiciones `/terminos`
**Archivo**: `app/terminos/page.tsx`

**Estructura común**:
```typescript
<LegalPage>
  <LegalHero title="..." />
  <LegalContent>
    {/* Contenido en Markdown o HTML */}
  </LegalContent>
</LegalPage>
```

---

## Componentes Globales

### Layout Principal
**Archivo**: `app/layout.tsx`

```typescript
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <ScrollProgress />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppFAB />
        <BackToTop />
      </body>
    </html>
  );
}
```

### Navbar
**Archivo**: `components/layout/Navbar.tsx`

**Características**:
- Glassmorphism con backdrop-blur
- Efecto pill cuando no está activo (bordes redondeados, separado)
- Transición a ancho completo al hacer scroll
- Indicador de sección activa
- Menú móvil con animación
- Responsive total

**Estados**:
- **Inicial**: Blanco, redondeado, separado de bordes
- **Scroll**: Azul oscuro, ancho completo, sin bordes

### Footer
**Archivo**: `components/layout/Footer.tsx`

**Secciones**:
- Logo y descripción breve
- Links de navegación
- Información de contacto
- Redes sociales
- Links legales (Privacidad, Términos)
- Copyright

---

## Componentes del Home

### 1. HeroSection
**Archivo**: `components/home/sections/HeroSection.tsx`

**Elementos**:
- Título principal con gradiente
- Subtítulo descriptivo
- 2 botones CTA (primario y secundario)
- Imagen de fondo con parallax multicapa
- Scroll indicator animado

**Props esperadas**:
```typescript
interface HeroSectionProps {
  title: string;
  subtitle: string;
  primaryCTA: { label: string; action: () => void };
  secondaryCTA: { label: string; href: string };
  backgroundImage: string;
}
```

### 2. InstitutionalSection
**Archivo**: `components/home/sections/InstitutionalSection.tsx`

**Contenido**:
- Título de sección
- Texto explicativo del servicio
- Imagen institucional
- Stats rápidos (opcional)

### 3. BenefitsSection
**Archivo**: `components/home/sections/BenefitsSection.tsx`

**Estructura**:
- Grid de 3-6 cards
- Cada card con:
  - Icono
  - Título
  - Descripción breve
  - Link opcional

**Beneficios sugeridos**:
1. Verificación en tiempo real
2. Gestión profesional
3. Recordatorios automáticos
4. Soporte 24/7
5. Múltiples TLDs
6. Dashboard intuitivo

### 4. QuickDomainCheckSection
**Archivo**: `components/home/sections/QuickDomainCheckSection.tsx`

**Funcionalidad**:
- Input de búsqueda rápida
- Botón de verificación
- Resultado inmediato (disponible/no disponible)
- Link a verificador completo

### 5. FeaturedPlansSection
**Archivo**: `components/home/sections/FeaturedPlansSection.tsx`

**Contenido**:
- Título de sección
- 2-3 planes destacados
- Comparación rápida
- CTA a página de planes completa

### 6. TestimonialsSection
**Archivo**: `components/home/sections/TestimonialsSection.tsx`

**Estructura**:
- Carousel de testimonios
- Cards con:
  - Rating (estrellas)
  - Texto del testimonio
  - Nombre del cliente
  - Empresa/proyecto

### 7. HowItWorksSection
**Archivo**: `components/home/sections/HowItWorksSection.tsx`

**Contenido**:
- Timeline o steps (3-5 pasos)
- Cada paso con:
  - Número/icono
  - Título
  - Descripción
  - Ilustración (opcional)

**Pasos sugeridos**:
1. Buscás el dominio
2. Verificás disponibilidad
3. Contratás el servicio
4. Gestionamos y te notificamos

### 8. CTASection
**Archivo**: `components/home/sections/CTASection.tsx`

**Propósito**: Conversión final antes del footer

**Elementos**:
- Título llamativo
- Descripción breve
- Botón principal (WhatsApp/Contacto)
- Garantías o beneficios rápidos

---

## Componentes del Verificador

### DomainSearchForm
**Archivo**: `components/domain-check/DomainSearchForm.tsx`

**Funcionalidad**:
- Input con validación en tiempo real
- Autocompletado de TLD
- Búsqueda múltiple (separada por comas)
- Historial de búsquedas recientes (localStorage)

**Estados**:
- Idle (esperando input)
- Validating (validando formato)
- Searching (consultando API)
- Results (mostrando resultados)
- Error (error en consulta)

### TLDSelector
**Archivo**: `components/domain-check/TLDSelector.tsx`

**Opciones**:
- Todos los TLDs
- Solo .ar
- Solo .com.ar
- Selector múltiple

### SearchResults
**Archivo**: `components/domain-check/SearchResults.tsx`

**Información por dominio**:
- Nombre completo del dominio
- Estado (Disponible/Registrado/Error)
- Fecha de registro (si está registrado)
- Fecha de vencimiento (si está registrado)
- Registrante (si es público)
- DNS/Nameservers
- Botones de acción:
  - Ver en NIC
  - Contratar gestión
  - Guardar (requiere login)

### DomainCard
**Archivo**: `components/domain-check/DomainCard.tsx`

**Variantes**:
- Available (verde, destacado)
- Registered (gris, información)
- Premium (dorado, especial)
- Error (rojo, mensaje de error)

### DomainSuggestions
**Archivo**: `components/domain-check/DomainSuggestions.tsx`

**Lógica**:
- Si el dominio está tomado, sugerir alternativas
- Variaciones: guiones, números, sinónimos
- Otros TLDs disponibles
- Dominios premium relacionados

---

## Componentes de Pricing

### PricingCard
**Archivo**: `components/pricing/PricingCard.tsx`

**Elementos**:
- Nombre del plan
- Precio (mensual/anual)
- Badge (Popular, Recomendado, etc.)
- Lista de beneficios
- Botón CTA
- Hover effects y animaciones

**Variantes**:
- Basic
- Pro
- Enterprise

### PricingComparison
**Archivo**: `components/pricing/PricingComparison.tsx`

**Formato**:
- Tabla comparativa
- Toggle mensual/anual
- Destacar diferencias clave
- Responsive (cards en mobile)

---

## Componentes UI Reutilizables

### Elementos Base
- `Button` - Botones con variantes
- `Input` - Inputs con validación
- `Card` - Cards con efectos
- `Badge` - Badges de estado
- `Accordion` - Acordeones para FAQ
- `Tabs` - Pestañas
- `Modal` - Modales
- `Toast` - Notificaciones

### Elementos de Navegación
- `ScrollProgress` - Barra de progreso
- `BackToTop` - Botón volver arriba
- `WhatsAppFAB` - Botón flotante WhatsApp

### Elementos Visuales
- `AnimatedCounter` - Contador animado
- `ParallaxImage` - Imagen con parallax
- `GradientText` - Texto con gradiente
- `LoadingSpinner` - Spinner de carga
- `Skeleton` - Skeleton loaders

---

## Flujo de Usuario (Parte Pública)

### Flujo Principal
```
1. Usuario llega al Home
   ↓
2. Lee sobre el servicio
   ↓
3. Prueba verificador rápido o va a /verificar
   ↓
4. Busca uno o varios dominios
   ↓
5. Ve resultados
   ↓
6. Opciones:
   a) Dominio disponible → CTA contratar
   b) Dominio registrado → Ver info + CTA gestión
   c) Error → Mensaje + reintentar
   ↓
7. Explora planes en /planes
   ↓
8. Revisa FAQ si tiene dudas
   ↓
9. Contacta vía WhatsApp/Formulario
```

### Flujo Secundario
```
1. Usuario busca en Google
   ↓
2. Llega directo a /verificar
   ↓
3. Busca dominio
   ↓
4. Si le interesa, explora Home y Planes
   ↓
5. Contacta o se registra (futuro)
```

---

## Responsive Breakpoints

```typescript
// Tailwind breakpoints utilizados
const breakpoints = {
  xs: '375px',   // Mobile pequeño
  sm: '640px',   // Mobile grande
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop pequeño
  xl: '1280px',  // Desktop
  '2xl': '1536px' // Desktop grande
};
```

### Estrategia Mobile-First
- Diseño base para mobile (375px)
- Progressive enhancement para tablets y desktop
- Touch-friendly (botones mínimo 44x44px)
- Menús y carousels optimizados para touch

---

## Animaciones y Transiciones

### Principios
- Animaciones sutiles y profesionales
- No más de 500ms para transiciones
- Respetar `prefers-reduced-motion`
- Hardware acceleration cuando sea posible

### Librería Principal: GSAP
**Por qué GSAP**:
- Mejor performance que CSS animations
- Control preciso de timing
- ScrollTrigger para animaciones on-scroll
- Soporte para animaciones complejas

### Casos de Uso
- **Framer Motion**: Hover states, micro-interacciones
- **GSAP**: Animaciones de entrada, parallax, contadores
- **CSS Transitions**: Estados simples (color, opacity)

---

## SEO y Metadata

### Metadata por Página

```typescript
// app/page.tsx
export const metadata = {
  title: 'Verificación de Dominios .AR | Gestión Profesional',
  description: 'Verificá disponibilidad de dominios .ar, .com.ar y más. Gestión profesional con recordatorios automáticos.',
  keywords: ['dominios', 'verificación', 'RDAP', '.ar', '.com.ar'],
  openGraph: {
    title: '...',
    description: '...',
    images: ['/og-image.jpg'],
  }
};
```

### Sitemap
- Generación automática con Next.js
- Incluir todas las páginas públicas
- Actualización dinámica (futuro con contenido dinámico)

### Robots.txt
```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /dashboard/ (futuro)
```

---

## Accesibilidad

### Requisitos
- Navegación por teclado completa
- ARIA labels en elementos interactivos
- Contraste mínimo WCAG AA (4.5:1)
- Focus states visibles
- Textos alternativos en imágenes
- Estructura semántica HTML5

### Testing
- Lighthouse Accessibility > 95
- Screen reader compatible
- Keyboard navigation fluida

---

## Performance

### Optimizaciones
- Image optimization con Next.js Image
- Lazy loading de componentes pesados
- Code splitting por ruta
- Prefetch de links importantes
- Caché de assets estáticos

### Métricas Objetivo
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **TTFB** (Time to First Byte): < 600ms

---

## Internacionalización (Futuro)

### Preparación
- Estructura de archivos lista para i18n
- Textos en archivos de configuración
- Formato de fechas/números parametrizable
- Soporte para español (actual) e inglés (futuro)

---

## Analytics y Tracking (Futuro)

### Eventos a Trackear
- Búsquedas de dominios
- Clicks en CTAs
- Navegación entre páginas
- Tiempo en sitio
- Conversiones (contactos)

### Herramientas Sugeridas
- Vercel Analytics
- Google Analytics 4
- Hotjar (heatmaps)

