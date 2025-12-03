# 👋 Hola Empresa - Plataforma de Verificación y Gestión de Dominios

Plataforma profesional para verificación, adquisición y gestión de dominios argentinos (.ar, .com.ar, .net.ar, .org.ar).

---

## 🚀 Estado Actual

**Fase 1 - Parte Pública:** ✅ Completada

El proyecto está **funcionando** con verificación real mediante tecnología RDAP de NIC Argentina.

---

## 📁 Estructura del Proyecto

```
hola_web/
├── app/
│   ├── layout.tsx              # Layout principal con Navbar y Footer
│   ├── page.tsx                # Home (con verificador integrado)
│   ├── planes/                 # Información de planes
│   ├── checkout/               # Proceso de compra
│   │   ├── layout.tsx          # Layout sin navbar/footer
│   │   └── page.tsx            # Formulario de checkout
│   └── api/
│       └── domain/check/       # API de verificación con RDAP
├── components/
│   ├── layout/                 # Navbar, Footer
│   ├── home/sections/          # Secciones del home
│   ├── pricing/                # Componentes de planes
│   └── ui/                     # Componentes UI base
├── lib/
│   ├── rdap-client.ts          # Cliente RDAP NIC Argentina
│   ├── domain-api.ts           # Funciones de dominio
│   ├── validations.ts          # Validaciones con Zod
│   └── utils.ts                # Utilidades
├── types/                      # Tipos TypeScript
├── config/                     # Configuración y contenido
├── styles/                     # Estilos y fuentes
└── docs/                       # Documentación técnica
```

---

## 🛠️ Stack Tecnológico

- **Framework:** Next.js 14+ (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Animaciones:** Framer Motion + GSAP
- **UI Components:** Radix UI
- **Validación:** Zod
- **Tipografías:** Manrope (cuerpo) + Plus Jakarta Sans (títulos)
- **Deploy:** Vercel

---

## 🎯 Funcionalidades Implementadas

### **1. Verificación de Dominios (Home)** 🔍

**Ubicación:** `/` (Hero Section)

**Características:**
- ✅ Búsqueda inteligente en el Hero
- ✅ Detección automática de TLD
- ✅ Verificación real con RDAP de NIC Argentina
- ✅ Resultados instantáneos

**Cómo funciona:**
```
Usuario escribe: "ejemplo"
Sistema busca:   ejemplo.com.ar (por defecto)
```

```
Usuario escribe: "ejemplo.net.ar"
Sistema busca:   ejemplo.net.ar (solo ese)
```

**TLDs Soportados:**
- `.ar`
- `.com.ar`
- `.net.ar`
- `.org.ar`

---

### **2. Sistema de Checkout** 💳

**Ubicación:** `/checkout?domain=ejemplo.com.ar`

#### **Página de Checkout**
- ✅ Sin navbar/footer (experiencia enfocada)
- ✅ Header con "← Volver" y "🔒 Conexión Segura"
- ✅ Dominio seleccionado destacado

#### **Selección de Plazo**
```
○ 1 año  - $5,900
● 2 años - $10,600 (Ahorrás 10%)
○ 3 años - $14,760 (Ahorrás 17%)
```

**Características:**
- Radio buttons para selección
- Descuentos visuales por período largo
- Precio actualizado en tiempo real

#### **Formulario de Datos del Cliente**
```typescript
{
  name: string;        // Nombre Completo *
  email: string;       // Email *
  phone: string;       // Teléfono *
  company?: string;    // Empresa (opcional)
  cuit?: string;       // CUIT/CUIL (opcional)
}
```

**Validación:**
- ✅ Campos requeridos marcados con *
- ✅ Iconos en cada input
- ✅ Focus states con color de marca
- ✅ Validación en tiempo real

#### **Resumen del Pedido (Sidebar)**
```
┌─────────────────────────┐
│ Resumen del Pedido      │
├─────────────────────────┤
│ 🌐 ejemplo.com.ar       │
│    2 años               │
│    $10,600              │
├─────────────────────────┤
│ Subtotal:    $10,600    │
│ Descuento:   -$1,060    │
├─────────────────────────┤
│ Total:       $10,600    │
├─────────────────────────┤
│ [💳 Proceder al Pago]   │
├─────────────────────────┤
│ ✓ Pago 100% seguro      │
│ ✓ Activación inmediata  │
│ ✓ Soporte 24/7          │
└─────────────────────────┘
```

**Características:**
- Sticky sidebar (desktop)
- Resumen siempre visible
- Garantías destacadas
- Responsive (abajo en mobile)

#### **Estado Actual: Mockup**
```javascript
const handleSubmit = (e) => {
  e.preventDefault();
  alert('Mockup de checkout - En producción se integrará con Mercado Pago');
};
```

---

### **3. Información de Planes** 📊

**Ubicación:** `/planes`

**Planes Disponibles:**

#### **Plan Básico** - $2,500/mes
- Hasta 3 dominios
- Verificación mensual
- Alertas por email
- Dashboard básico
- Soporte por email

#### **Plan Profesional** ⭐ - $5,900/mes
- Hasta 15 dominios
- Verificación semanal
- Alertas por email + WhatsApp
- Dashboard avanzado
- Soporte prioritario 24/7
- Reportes mensuales

#### **Plan Empresarial** - $15,000/mes
- Dominios ilimitados
- Verificación diaria
- Alertas multicanal
- Dashboard empresarial
- Soporte dedicado
- API access completo
- Reportes personalizados
- Gestión de equipo

---

## 🔄 Flujo Completo del Usuario

### **Fase 1: Descubrimiento y Verificación** ✅ Implementado

```
1. Usuario llega a home (/)
   ↓
2. Ve Hero con buscador integrado
   ↓
3. Escribe dominio: "miempresa"
   ↓
4. Click "Buscar"
   ↓
5. Ve resultado: "✓ miempresa.com.ar - DISPONIBLE"
   ↓
6. Click "Adquirir Dominio"
```

---

### **Fase 2: Checkout y Compra** ✅ Mockup Listo

```
7. Redirige a /checkout?domain=miempresa.com.ar
   ↓
8. Selecciona período (1, 2 o 3 años)
   ↓
9. Completa formulario de datos
   ↓
10. Revisa resumen con total
    ↓
11. Click "Proceder al Pago"
    ↓
12. [PENDIENTE] Integración con Mercado Pago
```

---

### **Fase 3: Autenticación** ⏳ Pendiente

```
Login / Registro
├── Durante checkout: "¿Ya tenés cuenta? Iniciar sesión"
├── O: "Crear cuenta para continuar"
└── Flujo OAuth (Google, Email)
```

**Campos de registro:**
```typescript
{
  email: string;
  password: string;
  name: string;
  phone: string;
  acceptTerms: boolean;
}
```

---

### **Fase 4: Panel de Usuario** ⏳ Pendiente

**Ruta:** `/dashboard`

#### **Secciones:**

**1. Mis Dominios**
```
┌────────────────────────────────────┐
│ 🌐 miempresa.com.ar                │
│    Estado: Activo                  │
│    Vence: 15/05/2025               │
│    [Renovar] [Gestionar]           │
├────────────────────────────────────┤
│ 🌐 otrodominio.ar                  │
│    Estado: Por vencer (30 días)    │
│    Vence: 20/06/2025               │
│    [Renovar Ahora] [Gestionar]     │
└────────────────────────────────────┘
```

**Información por dominio:**
- Nombre completo
- Estado (Activo, Por vencer, Vencido)
- Fecha de registro
- Fecha de vencimiento
- Días restantes
- Plan asociado
- Acciones (Renovar, Gestionar, Transferir)

**2. Mis Compras**
```
┌────────────────────────────────────┐
│ #12345 - 15/12/2024                │
│ miempresa.com.ar - 2 años          │
│ $10,600 - Pagado                   │
│ [Ver Detalle] [Descargar Factura]  │
├────────────────────────────────────┤
│ #12344 - 10/12/2024                │
│ ejemplo.ar - 1 año                 │
│ $5,900 - Pagado                    │
│ [Ver Detalle] [Descargar Factura]  │
└────────────────────────────────────┘
```

**Información por compra:**
- Número de orden
- Fecha de compra
- Dominio(s) comprado(s)
- Período contratado
- Monto pagado
- Estado (Pagado, Pendiente, Fallido)
- Método de pago usado
- Factura descargable (PDF)

**3. Detalle de Compra**
```
Orden #12345
────────────────────────────
Fecha: 15/12/2024 10:30 AM
Estado: Pagado ✓

Dominio: miempresa.com.ar
Período: 2 años
Precio: $10,600
Descuento: $1,060 (10%)
────────────────────────────
Total Pagado: $10,600

Método de Pago:
💳 Mercado Pago - Tarjeta ****1234

Datos del Cliente:
👤 Juan Pérez
📧 juan@example.com
📱 +54 11 1234-5678

[Descargar Factura] [Soporte]
```

**4. Configuración de Alertas**
```
┌────────────────────────────────────┐
│ Alertas de Vencimiento             │
├────────────────────────────────────┤
│ ☑ Email (90, 60, 30 días antes)   │
│ ☑ WhatsApp (30, 7 días antes)     │
│ ☐ SMS (7 días antes)               │
└────────────────────────────────────┘
```

**5. Historial de Verificaciones**
```
┌────────────────────────────────────┐
│ ejemplo.com.ar - 15/12/2024 10:30  │
│ Estado: Disponible                 │
├────────────────────────────────────┤
│ google.com.ar - 15/12/2024 10:25   │
│ Estado: Registrado                 │
└────────────────────────────────────┘
```

---

## 💳 Sistema de Pagos (Pendiente)

### **Integración con Mercado Pago**

**Flujo:**
```
1. Usuario completa checkout
   ↓
2. Click "Proceder al Pago"
   ↓
3. Redirige a Mercado Pago
   ↓
4. Usuario completa pago
   ↓
5. Webhook confirma pago
   ↓
6. Sistema registra orden
   ↓
7. Email de confirmación
   ↓
8. Redirige a /dashboard con dominio activo
```

**Métodos de Pago:**
- 💳 Tarjeta de crédito/débito
- 💰 Mercado Pago
- 🏦 Transferencia bancaria
- 💵 Efectivo (RapiPago, PagoFácil)

**Estados de Pago:**
- `pending` - Pendiente de pago
- `approved` - Pagado y aprobado
- `in_process` - En proceso
- `rejected` - Rechazado
- `cancelled` - Cancelado

---

## 👤 Sistema de Usuarios (Pendiente)

### **Autenticación**

**Métodos:**
- 📧 Email + Contraseña
- 🔑 OAuth con Google
- 📱 WhatsApp (futuro)

**Páginas:**
- `/login` - Inicio de sesión
- `/register` - Registro nuevo usuario
- `/forgot-password` - Recuperar contraseña
- `/verify-email` - Verificar email

### **Dashboard de Usuario**

**Ruta:** `/dashboard`

**Secciones:**
```
/dashboard
├── /dashboard/dominios          # Mis Dominios
├── /dashboard/compras           # Historial de Compras
├── /dashboard/compras/[id]      # Detalle de Compra
├── /dashboard/alertas           # Configuración de Alertas
├── /dashboard/perfil            # Perfil y Datos
└── /dashboard/facturacion       # Datos de Facturación
```

**Sidebar del Dashboard:**
```
┌────────────────────┐
│ 👤 Juan Pérez      │
│    Plan: Pro       │
├────────────────────┤
│ 🌐 Mis Dominios    │
│ 💳 Mis Compras     │
│ 🔔 Alertas         │
│ ⚙️  Configuración  │
│ 🚪 Cerrar Sesión   │
└────────────────────┘
```

---

## 📊 Base de Datos (Pendiente)

### **Modelos Principales:**

#### **Users**
```typescript
{
  id: string;
  email: string;
  password: string; // hasheado
  name: string;
  phone?: string;
  company?: string;
  cuit?: string;
  plan: 'basic' | 'pro' | 'enterprise';
  createdAt: Date;
  emailVerified: boolean;
}
```

#### **Domains**
```typescript
{
  id: string;
  userId: string;
  domain: string;         // "ejemplo.com.ar"
  tld: string;            // ".com.ar"
  status: 'active' | 'expiring' | 'expired';
  registrationDate: Date;
  expirationDate: Date;
  autoRenew: boolean;
  alertsEnabled: boolean;
  createdAt: Date;
}
```

#### **Orders**
```typescript
{
  id: string;
  orderNumber: string;    // "ORD-12345"
  userId: string;
  domain: string;
  period: number;         // años
  amount: number;
  discount: number;
  total: number;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  paymentMethod: string;
  paymentId?: string;     // ID de Mercado Pago
  createdAt: Date;
  paidAt?: Date;
}
```

#### **Alerts**
```typescript
{
  id: string;
  domainId: string;
  userId: string;
  type: 'email' | 'whatsapp' | 'sms';
  daysBefore: number;     // 90, 60, 30, 7
  sent: boolean;
  sentAt?: Date;
}
```

---

## 🔔 Sistema de Alertas (Pendiente)

### **Tipos de Alertas:**

**1. Alertas de Vencimiento**
- 90 días antes → Email
- 60 días antes → Email
- 30 días antes → Email + WhatsApp
- 7 días antes → Email + WhatsApp + SMS

**2. Alertas de Cambios**
- Cambio de DNS
- Cambio de registrante
- Cambio de estado

**3. Alertas de Sistema**
- Pago procesado
- Pago fallido
- Dominio renovado
- Dominio activado

### **Canales:**
- 📧 Email (Resend, SendGrid)
- 💬 WhatsApp (Twilio)
- 📱 SMS (Twilio) - Plan Enterprise

---

## 🎨 Páginas del Sitio

### **✅ Implementadas:**

| Ruta | Descripción | Navbar | Footer |
|------|-------------|--------|--------|
| `/` | Home con verificador | ✅ | ✅ |
| `/planes` | Información de planes | ✅ | ✅ |
| `/checkout` | Proceso de compra | ❌ | ❌ |

### **⏳ Pendientes:**

| Ruta | Descripción | Prioridad |
|------|-------------|-----------|
| `/login` | Inicio de sesión | Alta |
| `/register` | Registro de usuario | Alta |
| `/dashboard` | Panel de usuario | Alta |
| `/dashboard/dominios` | Gestión de dominios | Alta |
| `/dashboard/compras` | Historial de compras | Media |
| `/faq` | Preguntas frecuentes | Media |
| `/contacto` | Formulario de contacto | Media |
| `/privacidad` | Política de privacidad | Baja |
| `/terminos` | Términos y condiciones | Baja |

---

## 🚀 Flujo de Conversión

### **Usuario Nuevo (Sin cuenta):**
```
Home → Buscar dominio → Disponible → Checkout → Crear cuenta → Pagar → Dashboard
```

### **Usuario Registrado:**
```
Home → Login → Buscar dominio → Disponible → Checkout → Pagar → Dashboard
```

### **Usuario con dominio registrado:**
```
Home → Buscar dominio → Registrado → "Gestionar" → Contacto/Dashboard
```

---

## 🔐 Seguridad

### **Implementado:**
- ✅ Validación de inputs con Zod
- ✅ Sanitización de dominios
- ✅ Timeout de requests (10s)
- ✅ HTTPS en producción (Vercel)

### **Pendiente:**
- ⏳ Rate limiting (10 búsquedas/min por IP)
- ⏳ Autenticación JWT
- ⏳ Encriptación de contraseñas (bcrypt)
- ⏳ Tokens de sesión
- ⏳ CSRF protection
- ⏳ Webhook verification (Mercado Pago)

---

## 📦 Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Abrir en navegador
http://localhost:3000

# Build para producción
npm run build
npm start
```

---

## 🌐 Deploy en Vercel

### **Pasos:**
1. Push a GitHub: `git push origin main`
2. Ve a https://vercel.com
3. Importa: `holawebdominios/holaweb`
4. Deploy automático

### **URL Generada:**
```
holaweb.vercel.app
```

### **Variables de Entorno (Producción):**
```bash
# Mercado Pago (futuro)
MERCADOPAGO_ACCESS_TOKEN=
MERCADOPAGO_PUBLIC_KEY=

# Base de Datos (futuro)
DATABASE_URL=

# Emails (futuro)
RESEND_API_KEY=

# WhatsApp (futuro)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
```

---

## 📈 Próximos Desarrollos

### **Sprint 1: Autenticación** (Estimado: 1 semana)
- [ ] Página de login
- [ ] Página de registro
- [ ] Verificación de email
- [ ] Recuperación de contraseña
- [ ] NextAuth.js configurado

### **Sprint 2: Dashboard** (Estimado: 2 semanas)
- [ ] Layout del dashboard
- [ ] Página de mis dominios
- [ ] Página de mis compras
- [ ] Configuración de alertas
- [ ] Perfil de usuario

### **Sprint 3: Integración de Pagos** (Estimado: 1 semana)
- [ ] SDK de Mercado Pago
- [ ] Webhook de confirmación
- [ ] Manejo de estados de pago
- [ ] Emails de confirmación
- [ ] Facturas automáticas

### **Sprint 4: Base de Datos** (Estimado: 1 semana)
- [ ] Prisma ORM configurado
- [ ] Migraciones de base de datos
- [ ] Modelos implementados
- [ ] Seed de datos iniciales

### **Sprint 5: Sistema de Alertas** (Estimado: 2 semanas)
- [ ] Cron jobs para verificar vencimientos
- [ ] Envío de emails
- [ ] Integración WhatsApp
- [ ] Dashboard de alertas
- [ ] Logs de notificaciones

---

## 🎓 Documentación Técnica

Para más detalles técnicos, consulta:

- **[docs/overview.md](./docs/overview.md)** - Visión general y arquitectura
- **[docs/public-architecture.md](./docs/public-architecture.md)** - Arquitectura de componentes
- **[docs/content-model.md](./docs/content-model.md)** - Tipos TypeScript y modelos
- **[docs/domain-check-flow.md](./docs/domain-check-flow.md)** - Flujo del verificador
- **[docs/RDAP_INTEGRATION.md](./docs/RDAP_INTEGRATION.md)** - Integración RDAP
- **[docs/BUSQUEDA_INTELIGENTE.md](./docs/BUSQUEDA_INTELIGENTE.md)** - Sistema de búsqueda
- **[IMPLEMENTADO.md](./IMPLEMENTADO.md)** - Estado de implementación

---

## 📝 Licencia

Proyecto privado - Todos los derechos reservados © 2024 Hola Empresa

---

## 👥 Equipo

**Hola Empresa**  
Email: holawebdominios@gmail.com  
GitHub: https://github.com/holawebdominios

---

## 🎯 Objetivo del Proyecto

Crear una plataforma profesional y confiable para que empresas y emprendedores puedan:
- Verificar disponibilidad de dominios argentinos
- Adquirir dominios de forma simple y rápida
- Gestionar todos sus dominios desde un solo lugar
- Recibir alertas automáticas de vencimientos
- No perder nunca un dominio por olvido

**Estado Actual:** Fase pública completa con verificación real y checkout mockup listo para integrar pagos.

**Próximo Hito:** Sistema de autenticación y dashboard de usuario.
