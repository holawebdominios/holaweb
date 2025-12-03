# 🛡️ PANEL DE ADMINISTRACIÓN - GUÍA COMPLETA

## 📋 RESUMEN

Panel de administración completo para **Hola Empresa** con:
- ✅ Dashboard con estadísticas en tiempo real
- ✅ Gestión de usuarios
- ✅ Gestión de órdenes
- ✅ Gestión de dominios
- ✅ Seguridad robusta con Firebase Auth + Custom Claims
- ✅ UI profesional y responsive

---

## 🚀 CONFIGURACIÓN INICIAL

### **Paso 1: Crear Usuario Admin en Firebase Console**

1. Abre [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Authentication** → **Users**
4. Click **"Add user"**
5. Completa:
   ```
   Email: admin@admin.com
   Password: [tu contraseña segura - GUÁRDALA]
   ```
6. Click **"Add user"**

---

### **Paso 2: Establecer Permisos de Admin**

Con el servidor corriendo (`npm run dev`), ejecuta en la **consola del navegador**:

```javascript
fetch('/api/admin/init', { method: 'POST' })
  .then(r => r.json())
  .then(data => {
    console.log(data);
    if (data.success) {
      alert('✅ Admin configurado! Ya puedes iniciar sesión');
    }
  });
```

Esto establece:
- ✅ Custom Claim: `{ admin: true }`
- ✅ Rol en Firestore: `role: "admin"`

---

### **Paso 3: Iniciar Sesión**

1. Ve a: `http://localhost:3000/admin/login`
2. Credenciales:
   ```
   Email: admin@admin.com
   Password: [la que elegiste en Paso 1]
   ```
3. Click **"Acceder al Panel"**
4. ✅ Acceso al dashboard

---

## 📊 SECCIONES DEL PANEL

### **1. Dashboard** (`/admin`)

**Métricas principales:**
- 👥 Usuarios Totales
- 🛒 Órdenes Totales (pagadas/pendientes/fallidas)
- 💰 Revenue Total
- 🌐 Dominios Activos (y por vencer)

**Órdenes recientes:**
- Últimas 5 órdenes
- Link rápido a detalle
- Estados visuales

---

### **2. Usuarios** (`/admin/users`)

**Lista de usuarios:**
- Tabla completa con todos los usuarios
- Columnas:
  - Usuario (nombre + email + empresa)
  - Plan/Rol
  - Fecha de registro
  - Actividad (órdenes + dominios)
  - Total gastado
  - Acciones

**Filtros:**
- 🔍 Búsqueda por email/nombre/empresa
- 📊 Ordenar por fecha/email/nombre
- ↕️ Orden ascendente/descendente

**Detalle de usuario** (`/admin/users/[uid]`)
- Info personal completa
- Stats (órdenes, dominios, total gastado)
- Lista de sus órdenes
- Lista de sus dominios
- Link a cada orden

---

### **3. Órdenes** (`/admin/orders`)

**Lista de órdenes:**
- Tabla completa con todas las órdenes
- Columnas:
  - Número de orden
  - Cliente (nombre + email)
  - Dominio
  - Período
  - Fecha (creación + pago)
  - Total
  - Estado
  - Acciones

**Filtros:**
- 🔍 Búsqueda por orden/dominio/email
- 📊 Filtro por estado (todas/pagadas/pendientes/fallidas)
- 📊 Ordenar por fecha/monto
- ↕️ Orden ascendente/descendente

**Detalle de orden** (`/admin/orders/[id]`)
- Info completa de la orden
- Datos del cliente
- Dominio asociado (si existe)
- Timeline de estados
- Desglose de precio
- Link al usuario

---

### **4. Dominios** (`/admin/domains`)

**Lista de dominios:**
- Tabla completa con todos los dominios
- Columnas:
  - Dominio + TLD
  - Usuario (con link)
  - Fecha de registro
  - Fecha de vencimiento
  - Auto-renovar
  - Estado

**Filtros:**
- 🔍 Búsqueda por dominio/email
- 📊 Filtro por estado (todos/activos/pendientes/por vencer/expirados)

---

### **5. Configuración** (`/admin/settings`)

**Información del sistema:**
- Estado de Firebase Auth
- Usuario admin configurado
- Colecciones activas
- Recordatorios de seguridad

---

## 🎨 DISEÑO Y UX

### **Características:**

✅ **Responsive Design:**
- Desktop: Sidebar fijo (256px) + contenido
- Mobile: Sidebar colapsable con overlay

✅ **Navegación:**
- Sidebar con 5 secciones
- Active indicator animado
- Breadcrumbs visuales

✅ **Tablas Profesionales:**
- Headers sticky
- Hover effects
- Columnas bien espaciadas
- Badges de estado coloridos

✅ **Loading States:**
- Spinners en carga inicial
- Estados vacíos informativos
- Mensajes de error claros

✅ **Animaciones:**
- Framer Motion en cards
- Transiciones suaves
- Hover effects profesionales

✅ **Color Scheme:**
- Primary: #ff9900 (naranja)
- Secondary: Gray scale
- Success: Green
- Warning: Yellow
- Error: Red

---

## 🔐 SEGURIDAD IMPLEMENTADA

### **Capas de Protección:**

1. **Middleware** (`middleware.ts`)
   - Primera barrera en `/admin/*`
   - Redirección si no autenticado

2. **Layout** (`app/admin/layout.tsx`)
   - Verificación de token
   - Verificación de rol admin
   - Loading states

3. **Context** (`AdminAuthContext`)
   - Estado global de admin
   - Verificación continua

4. **API Endpoints** (todos los `/api/admin/*`)
   - `requireAdmin(token)` en cada request
   - Verificación server-side obligatoria

### **Verificación de Admin:**

```typescript
// lib/admin-auth.ts
async function isAdmin(uid: string): boolean {
  // 1. Verificar custom claims (rápido)
  const user = await adminAuth.getUser(uid);
  if (user.customClaims?.admin === true) return true;

  // 2. Verificar Firestore (respaldo)
  const userDoc = await adminDb.collection('users').doc(uid).get();
  if (userDoc.data()?.role === 'admin') return true;

  return false;
}
```

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
app/
├── admin/
│   ├── layout.tsx              ✅ Layout con protección
│   ├── login/
│   │   └── page.tsx            ✅ Login admin
│   ├── page.tsx                ✅ Dashboard
│   ├── users/
│   │   ├── page.tsx            ✅ Lista de usuarios
│   │   └── [uid]/
│   │       └── page.tsx        ✅ Detalle de usuario
│   ├── orders/
│   │   ├── page.tsx            ✅ Lista de órdenes
│   │   └── [id]/
│   │       └── page.tsx        ✅ Detalle de orden
│   ├── domains/
│   │   └── page.tsx            ✅ Lista de dominios
│   └── settings/
│       └── page.tsx            ✅ Configuración
│
├── api/
│   └── admin/
│       ├── check-admin/
│       │   └── route.ts        ✅ Verificar si es admin
│       ├── init/
│       │   └── route.ts        ✅ Inicializar admin (eliminar en prod)
│       ├── stats/
│       │   └── route.ts        ✅ Stats del dashboard
│       ├── users/
│       │   ├── route.ts        ✅ Lista de usuarios
│       │   └── [uid]/
│       │       └── route.ts    ✅ Detalle de usuario
│       ├── orders/
│       │   ├── route.ts        ✅ Lista de órdenes
│       │   └── [id]/
│       │       └── route.ts    ✅ Detalle de orden
│       └── domains/
│           └── route.ts        ✅ Lista de dominios
│
components/
└── admin/
    ├── AdminNavbar.tsx         ✅ Navbar del panel
    └── AdminSidebar.tsx        ✅ Sidebar con navegación
│
contexts/
└── AdminAuthContext.tsx        ✅ Context de admin auth
│
lib/
└── admin-auth.ts               ✅ Utilidades de auth admin
│
types/
└── admin.ts                    ✅ Tipos del panel admin
│
middleware.ts                   ✅ Protección de rutas
```

---

## 🧪 TESTING

### **Test 1: Acceso al Panel**
```bash
1. Ve a /admin (sin login)
   → Redirige a /admin/login ✅

2. Login con usuario normal (pepin@gmail.com)
   → Muestra "Acceso denegado" ✅

3. Login con admin@admin.com
   → Acceso al dashboard ✅
```

### **Test 2: Navegación**
```bash
1. Dashboard → Stats visibles ✅
2. Usuarios → Lista de usuarios ✅
3. Click en usuario → Detalle completo ✅
4. Órdenes → Lista de órdenes ✅
5. Click en orden → Detalle completo ✅
6. Dominios → Lista de dominios ✅
7. Settings → Info del sistema ✅
```

### **Test 3: Filtros y Búsqueda**
```bash
1. Usuarios → Buscar "pepin" → Encuentra ✅
2. Órdenes → Filtrar "pagadas" → Muestra solo pagadas ✅
3. Dominios → Filtrar "activos" → Muestra solo activos ✅
```

---

## 📊 DATOS DE FIRESTORE

### **Colección: users**
```javascript
{
  uid: "abc123",
  email: "pepin@gmail.com",
  name: "Pepin",
  phone: "1195959595",
  company: "pepin",
  cuit: "6255556656",
  role: "user", // o "admin"
  plan: "basic", // o "pro", "enterprise"
  createdAt: Timestamp,
  updatedAt: Timestamp,
  emailVerified: true
}
```

### **Colección: orders**
```javascript
{
  id: "PZ1Kr2wBlNMs0oJ10Ayb",
  orderNumber: "ORD-1764780336750-761",
  userId: "aPbbyDueqRUYBX6Tq9oZBMDgptg2",
  domain: "pepin.com.ar",
  period: 12, // meses
  amount: 70800,
  discount: 0,
  total: 70800,
  status: "paid", // "pending", "failed", "cancelled"
  paymentMethod: "mercadopago",
  paymentId: "SIMULATED-1764780339146",
  createdAt: Timestamp,
  paidAt: Timestamp,
  metadata: {
    customerEmail: "pepin@gmail.com",
    customerName: "pepin",
    customerPhone: "1195959595",
    customerCompany: "pepin",
    customerCuit: "6255556656",
    preapprovalPlanId: "4d00df0a99b34973857c28b10012d1bd"
  }
}
```

### **Colección: domains**
```javascript
{
  id: "xyz789",
  userId: "aPbbyDueqRUYBX6Tq9oZBMDgptg2",
  domain: "pepin.com.ar",
  tld: ".com.ar",
  status: "active", // "pending", "expired", "expiring"
  registrationDate: Timestamp,
  expirationDate: Timestamp,
  autoRenew: false,
  alertsEnabled: true,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## 🎯 FLUJO COMPLETO

### **Como Admin:**

```
1. Ir a /admin/login
   ↓
2. Login con admin@admin.com
   ↓
3. Dashboard muestra:
   - 1 Usuario (pepin)
   - 1 Orden ($70,800)
   - 0 Dominios activos (pendiente activar)
   ↓
4. Click "Usuarios"
   - Ve a pepin@gmail.com
   - Puede ver su detalle
   ↓
5. Click "Órdenes"
   - Ve la orden de pepin.com.ar
   - Estado: Pagado ✅
   - Puede ver detalle completo
   ↓
6. Click "Dominios"
   - Lista vacía (hasta que se active el dominio)
```

---

## 🔧 ACTIVAR EL DOMINIO DE PEPIN

Para que aparezca en el dashboard de pepin Y en el panel admin:

```javascript
// Ejecutar en consola del navegador
fetch('/api/admin/activate-domain', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ orderId: 'PZ1Kr2wBlNMs0oJ10Ayb' })
})
.then(r => r.json())
.then(data => {
  console.log(data);
  if (data.success) {
    alert('✅ Dominio activado!');
    location.reload();
  }
});
```

Después de esto:
- ✅ Dashboard de pepin mostrará su dominio
- ✅ Panel admin mostrará 1 dominio activo
- ✅ Stats se actualizarán

---

## 📱 RESPONSIVE DESIGN

### **Desktop (>1024px):**
```
┌──────────────────────────────────────┐
│ [≡] Panel Admin    [Admin] [Logout] │ ← Navbar
├────────┬─────────────────────────────┤
│ ••     │ Dashboard                   │
│ Users  │ [Stats Cards Grid]          │
│ Orders │ [Recent Orders]             │
│ Domain │                             │
│ Settin │                             │
│        │                             │
└────────┴─────────────────────────────┘
```

### **Mobile (<1024px):**
```
┌──────────────────────────────────────┐
│ [≡] Panel Admin    [Admin] [Logout] │
├──────────────────────────────────────┤
│ Dashboard                            │
│ [Stats Cards Stack]                  │
│ [Recent Orders]                      │
└──────────────────────────────────────┘

[≡] Click → Sidebar slide-in
```

---

## 🎨 CARACTERÍSTICAS DE UI

### **Componentes Reutilizables:**

**Stats Card:**
```tsx
[Icon] Título
       Valor
       Subtexto
```

**Status Badge:**
- 🟢 Pagado (verde)
- 🟡 Pendiente (amarillo)
- 🔴 Fallido (rojo)
- ⚫ Cancelado (gris)

**Tablas:**
- Headers sticky
- Zebra striping on hover
- Responsive overflow
- Actions column

**Empty States:**
- Icono grande
- Mensaje descriptivo
- CTA si aplica

---

## 🔒 SEGURIDAD - CHECKLIST

### **Antes de Producción:**

- [ ] **Eliminar** `app/api/admin/init/route.ts`
- [ ] Verificar que `.env.local` NO esté en git
- [ ] Cambiar contraseña de admin@admin.com
- [ ] Verificar que custom claims estén activos
- [ ] Probar acceso no autorizado → 403
- [ ] Probar sin token → 401
- [ ] Verificar logs server-side

### **En Producción:**

- [ ] Solo admin@admin.com tiene acceso
- [ ] Todos los endpoints verifican token + rol
- [ ] No hay forma de auto-registrarse como admin
- [ ] Logs de acceso al panel (opcional)

---

## 💡 MEJORAS FUTURAS

### **Funcionalidades:**
- [ ] Export a CSV (usuarios, órdenes)
- [ ] Filtros por rango de fechas
- [ ] Paginación en tablas largas
- [ ] Búsqueda avanzada
- [ ] Bulk actions (desactivar múltiples usuarios)
- [ ] Dashboard con gráficos (Chart.js)
- [ ] Notificaciones push
- [ ] Logs de actividad admin
- [ ] Gestión de dominios por vencer
- [ ] Envío de emails desde el panel

### **UI/UX:**
- [ ] Dark mode
- [ ] Breadcrumbs en detalles
- [ ] Tooltips explicativos
- [ ] Skeleton loaders
- [ ] Infinite scroll
- [ ] Quick actions en hover

---

## 📚 ENDPOINTS API

### **Stats:**
```
GET /api/admin/stats
- Requiere: Bearer token de admin
- Devuelve: Stats completas + órdenes recientes
```

### **Usuarios:**
```
GET /api/admin/users?search=&sortBy=&sortOrder=
- Requiere: Bearer token de admin
- Devuelve: Lista de usuarios con counts

GET /api/admin/users/[uid]
- Requiere: Bearer token de admin
- Devuelve: Detalle completo + órdenes + dominios
```

### **Órdenes:**
```
GET /api/admin/orders?status=&search=&sortBy=&sortOrder=
- Requiere: Bearer token de admin
- Devuelve: Lista de órdenes con user info

GET /api/admin/orders/[id]
- Requiere: Bearer token de admin
- Devuelve: Detalle completo + user + domain
```

### **Dominios:**
```
GET /api/admin/domains
- Requiere: Bearer token de admin
- Devuelve: Lista de dominios con user info
```

---

## 🐛 TROUBLESHOOTING

### **No puedo acceder al panel**
**Solución:**
1. Verifica que el usuario admin@admin.com existe en Firebase Console
2. Ejecuta `/api/admin/init` nuevamente
3. Cierra sesión y vuelve a entrar
4. Revisa logs del servidor

### **"Acceso denegado"**
**Solución:**
1. Verifica custom claims en Firebase Console
2. Verifica documento en Firestore: `users/[uid]` tiene `role: "admin"`
3. El token tarda ~5 min en refrescar, cerrá sesión y volvé a entrar

### **Tablas vacías**
**Solución:**
1. Verifica que tengas datos en Firestore
2. Revisa logs del servidor para ver errores
3. Verifica permisos del service account de Firebase

---

## ✅ ESTADO DE IMPLEMENTACIÓN

| Componente | Estado |
|------------|--------|
| Auth System | ✅ 100% |
| Layout & Nav | ✅ 100% |
| Dashboard | ✅ 100% |
| Usuarios | ✅ 100% |
| Órdenes | ✅ 100% |
| Dominios | ✅ 100% |
| Settings | ✅ 100% |
| API Endpoints | ✅ 100% |
| Seguridad | ✅ 100% |

---

## 🎉 PANEL ADMIN COMPLETO

**El panel está 100% funcional y listo para usar.**

**Próximos pasos:**
1. Crear usuario admin@admin.com en Firebase Console
2. Ejecutar `/api/admin/init`
3. Login y explorar
4. Activar el dominio de pepin para ver datos completos

**¡Todo listo!** 🚀

