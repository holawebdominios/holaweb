# DomainCheck - Plataforma de Verificación de Dominios

Plataforma profesional para verificación, gestión y seguimiento de dominios argentinos (.ar, .com.ar, .net.ar, .org.ar).

## 📋 Documentación

Toda la documentación del proyecto está en la carpeta `docs/`:

- **[Overview](./docs/overview.md)** - Descripción general del proyecto, stack tecnológico y roadmap
- **[Arquitectura Pública](./docs/public-architecture.md)** - Estructura de páginas, componentes y flujos de usuario
- **[Modelo de Contenido](./docs/content-model.md)** - Tipos TypeScript, configuración de contenido y datos
- **[Flujo de Verificación](./docs/domain-check-flow.md)** - Detalle completo del verificador de dominios y APIs
- **[Guía de Implementación](./docs/implementation-guide.md)** - Orden de desarrollo, checklist y próximos pasos

## 🚀 Estado Actual

**Fase Pública Implementada** ✅

El proyecto está **funcionando** con integración RDAP real de NIC Argentina para verificación de dominios .ar

## 📁 Estructura del Proyecto

```
hola_web/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Layout principal
│   ├── page.tsx             # Home
│   ├── verificar/           # Verificador de dominios
│   ├── planes/              # Planes y precios
│   ├── faq/                 # Preguntas frecuentes
│   ├── contacto/            # Contacto
│   └── api/                 # API Routes
│       └── domain/
│           └── check/
├── components/
│   ├── layout/              # Navbar, Footer
│   ├── home/                # Componentes del home
│   │   └── sections/
│   ├── domain-check/        # Verificador
│   ├── pricing/             # Planes
│   └── ui/                  # Componentes UI base
├── lib/
│   ├── utils.ts             # Utilidades
│   ├── domain-api.ts        # API de dominios
│   ├── rdap-client.ts       # Cliente RDAP
│   └── validations.ts       # Validaciones
├── types/
│   ├── domain.ts            # Tipos de dominio
│   ├── plan.ts              # Tipos de planes
│   ├── faq.ts               # Tipos de FAQ
│   └── content.ts           # Tipos de contenido
├── config/
│   ├── site.ts              # Config del sitio
│   ├── content.ts           # Contenido parametrizable
│   ├── plans.ts             # Definición de planes
│   └── faqs.ts              # FAQs
├── styles/
│   ├── globals.css          # Estilos globales
│   └── fonts.ts             # Fuentes
└── docs/                    # Documentación
```

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 14+ (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Animaciones**: Framer Motion + GSAP
- **UI Components**: Radix UI + shadcn/ui
- **Validación**: Zod
- **Deploy**: Vercel

## 🎯 Características Implementadas

### ✅ Páginas Funcionando
- ✅ Landing page moderna y profesional (/)
- ✅ Verificador de dominios con verificación real (/verificar)
- ✅ Información de planes y servicios (/planes)
- ✅ Checkout profesional con mockup (/checkout)
- ✅ Diseño responsive total
- ✅ Animaciones fluidas con GSAP

### ✅ Búsqueda Inteligente
- ✅ **Detección automática de TLD** - Escribe "ejemplo" o "ejemplo.com.ar"
- ✅ Sin selector de extensiones visible
- ✅ Búsqueda múltiple separada por comas
- ✅ Verificación real con RDAP de NIC Argentina

### ✅ Integraciones Activas
- ✅ Verificación real de dominios .ar, .com.ar, .net.ar, .org.ar
- ✅ API Route con validación Zod
- ✅ Parser de respuestas completo
- ✅ Manejo de errores y timeouts
- ✅ Toast notifications

### ⏳ Pendiente
- ⏳ FAQ interactivo
- ⏳ Formulario de contacto
- ⏳ Páginas legales
- ⏳ Sistema de caché
- ⏳ Rate limiting

## 📦 Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno (opcional)
cp env.example .env.local
# Editar .env.local con tus valores

# Ejecutar en desarrollo
npm run dev

# Abrir en navegador
# http://localhost:3000

# Build para producción
npm run build
npm start
```

### Probar el Verificador

1. Ve a http://localhost:3000/verificar
2. Ingresa un dominio (ej: "google", "mercadolibre")
3. Selecciona TLDs argentinos (.ar, .com.ar, .net.ar, .org.ar)
4. Haz clic en "Verificar Dominios"
5. ¡Verás información real desde RDAP de NIC Argentina!

## 🎨 Diseño

El diseño está basado en UMAVIAL con las siguientes características:

- **Navbar**: Efecto pill (redondeado y separado) → Full-width al scroll
- **Hero**: Parallax multicapa sofisticado
- **Animaciones**: GSAP para fluidez máxima
- **Cards**: Efectos 3D y hover magnético
- **Responsive**: Mobile-first, 2 columnas en mobile
- **Glassmorphism**: Efectos de vidrio en componentes clave

## 🔐 Seguridad

- Validación estricta de inputs
- Rate limiting en búsquedas
- Sanitización de datos
- API keys en variables de entorno
- CORS configurado

## 📊 Performance

- Lighthouse Score objetivo: > 90
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Optimización de imágenes con Next.js Image
- Code splitting automático

## 🌐 SEO

- Metadata optimizada por página
- Sitemap automático
- Robots.txt configurado
- Open Graph tags
- Schema.org markup

## 📝 Próximos Pasos

1. ~~Implementar componentes base~~ ✅
2. ~~Crear layout y navegación~~ ✅
3. ~~Desarrollar Home page~~ ✅
4. ~~Implementar verificador~~ ✅
5. ~~Integrar RDAP~~ ✅
6. Completar páginas complementarias (FAQ, Contacto)
7. Agregar sistema de caché
8. Implementar rate limiting
10. Optimizar y deployar a producción

## 🤝 Contribución

Este proyecto está en fase de desarrollo inicial. La documentación completa está disponible en la carpeta `docs/`.

## 📄 Licencia

Proyecto privado - Todos los derechos reservados

---

**Nota**: Este proyecto está basado en la estructura y diseño de UMAVIAL, adaptado para una plataforma de verificación de dominios.

