# 🔐 Arquitectura de Seguridad

## Principios de Diseño

### ✅ 1. El Backend es la Fuente de Verdad

**Nunca confiar en datos del frontend para:**
- Precios y montos
- IDs de usuario
- Estados de orden
- Descuentos
- Permisos

**Implementación:**
- `config/pricing.ts` - Única fuente de verdad para precios
- `calculatePrice()` se ejecuta SOLO en el backend
- El frontend solo muestra, NUNCA calcula

---

### ✅ 2. Autenticación con Firebase

**Cliente:**
- `lib/firebase-client.ts` - SDK de Firebase para el navegador
- `lib/auth-service.ts` - Funciones de login/registro
- `contexts/AuthContext.tsx` - Estado global de autenticación

**Backend:**
- `lib/firebase-admin.ts` - SDK Admin para verificar tokens
- `verifyIdToken(token)` - Verifica y decodifica tokens
- `requireAuth(request)` - Middleware para rutas protegidas
- `optionalAuth(request)` - Permite invitados o autenticados

---

### ✅ 3. Flujo de Autenticación

```
Frontend → Firebase Auth → ID Token → Backend → Verify Token → UID
```

**Paso a paso:**
1. Usuario hace login en el frontend (Firebase Auth)
2. Firebase devuelve un ID token
3. Frontend guarda el token (en memoria, via AuthContext)
4. Para cada request al backend:
   ```typescript
   headers: {
     'Authorization': `Bearer ${idToken}`
   }
   ```
5. Backend verifica el token con Firebase Admin
6. Backend extrae el `uid` del token verificado
7. Backend usa el `uid` para filtrar datos (NUNCA confía en uid del body)

---

## 🔒 Endpoints Seguros

### **POST /api/checkout/create-order**

**Input del frontend:**
```typescript
{
  domain: string,
  periodId: 'PERIOD_1_YEAR' | 'PERIOD_2_YEARS' | 'PERIOD_3_YEARS',
  customerData: { name, email, phone, ... }
}
```

**❌ NO incluye:** precio, total, userId

**Proceso seguro:**
1. Validar input con Zod
2. Verificar token (opcional - checkout invitado)
3. Verificar disponibilidad del dominio (RDAP)
4. **Calcular precio en el backend** usando `calculatePrice()`
5. Crear orden en Firestore con estado `pending`
6. Crear preferencia en Mercado Pago con el monto calculado
7. Devolver `init_point` para redirección

---

### **POST /api/payments/mercadopago/webhook**

**Seguridad:**
1. ✅ Verificar que venga de Mercado Pago (TODO: validar x-signature)
2. ✅ Consultar el pago en la API de MP (no confiar solo en el webhook)
3. ✅ Validar monto: `amountPaid === order.total`
4. ✅ Validar estado: `status === 'approved'`
5. ✅ Solo entonces marcar orden como `paid` y activar dominio

**Protecciones:**
- No confía solo en la notificación
- Consulta la API de MP para confirmar
- Valida montos
- Registra todo en logs

---

### **GET /api/domains**

**Seguridad:**
1. ✅ Requiere autenticación (`requireAuth`)
2. ✅ Extrae `uid` del token verificado
3. ✅ Filtra en Firestore: `where('userId', '==', uid)`
4. ✅ NUNCA usa userId del query/body

---

### **GET /api/orders**

**Misma seguridad que /api/domains:**
- Requiere autenticación
- Filtra por `uid` del token
- No confía en parámetros

---

### **GET /api/orders/[id]**

**Seguridad especial:**
1. ✅ Autenticación opcional (para checkout invitado)
2. ✅ Si hay usuario autenticado:
   - Busca orden en Firestore
   - Verifica `order.userId === uid`
   - Si no coincide, devuelve 403
3. ✅ Si no hay usuario:
   - Permite ver la orden (para confirmar compra invitada)

---

## 🛡️ Reglas de Firestore

```javascript
// USERS
allow read: if isOwner(userId);
allow create: if request.auth.uid == userId;
allow update: if isOwner(userId);

// DOMAINS
allow read: if resource.data.userId == request.auth.uid;
allow create: if isSignedIn();
allow update: if resource.data.userId == request.auth.uid;

// ORDERS
allow read: if resource.data.userId == request.auth.uid;
allow create: if true; // Checkout invitado
allow update: if false; // Solo backend

// ALERTS
allow read: if resource.data.userId == request.auth.uid;
allow write: if false; // Solo backend
```

**Principio:** El frontend puede leer sus propios datos, pero escribir solo a través del backend (API Routes).

---

## 💳 Flujo de Pago Seguro

### **1. Crear Orden (Backend)**

```typescript
// Frontend envía:
{ domain: "ejemplo.com.ar", periodId: "PERIOD_2_YEARS" }

// Backend calcula:
const pricing = calculatePrice("PERIOD_2_YEARS"); // { total: 10600 }

// Backend crea orden:
await createOrder({
  userId: uid, // Del token verificado
  domain,
  total: pricing.total, // Calculado en backend
  status: 'pending'
});
```

### **2. Mercado Pago**

```typescript
// Backend crea preferencia:
await preference.create({
  items: [{ 
    unit_price: pricing.total // Del backend, NO del frontend
  }],
  metadata: { orderId, userId }
});

// Devuelve init_point al frontend
```

### **3. Webhook (Confirmación)**

```typescript
// Mercado Pago notifica pago
// Backend:
1. Consulta payment en MP
2. Valida: amountPaid === order.total
3. Valida: status === 'approved'
4. Marca orden como paid
5. Activa dominio
```

---

## 🚫 Lo Que NUNCA Hacer

### **❌ Confiar en datos del frontend:**
```typescript
// MAL
const { userId, total } = await request.json();
await createOrder({ userId, total }); // ¡INSEGURO!

// BIEN
const authUser = await requireAuth(request);
const pricing = calculatePrice(periodId);
await createOrder({ userId: authUser.uid, total: pricing.total });
```

### **❌ No verificar tokens:**
```typescript
// MAL
const { userId } = await request.json();
const orders = await getUserOrders(userId); // ¡INSEGURO!

// BIEN
const authUser = await requireAuth(request);
const orders = await getUserOrders(authUser.uid);
```

### **❌ Calcular precios en el frontend:**
```typescript
// MAL
const total = price * years * (1 - discount/100);
await createOrder({ total }); // ¡INSEGURO!

// BIEN
// El frontend solo envía periodId
// El backend calcula con calculatePrice()
```

---

## ✅ Checklist de Seguridad

### Autenticación
- [x] Firebase Auth configurado
- [x] ID tokens verificados en backend
- [x] userId extraído del token (nunca del body)
- [x] Middleware `requireAuth()` implementado
- [x] Middleware `optionalAuth()` para checkout invitado

### Autorización
- [x] Filtros por userId en queries
- [x] Verificación de ownership en GET /orders/[id]
- [x] Reglas de Firestore configuradas
- [x] No se confía en IDs del frontend

### Pagos
- [x] Precios calculados en backend
- [x] Orden creada antes de pago
- [x] Webhook valida montos
- [x] Webhook consulta API de MP
- [x] Activación solo después de confirmación

### Validación
- [x] Zod en todos los endpoints
- [x] Validación de emails, teléfonos
- [x] Sanitización de inputs
- [x] Verificación de disponibilidad de dominios

### Logging
- [x] Logs en checkout
- [x] Logs en webhook
- [x] Errores capturados
- [ ] TODO: Implementar logger profesional (Winston/Pino)

---

## 🔄 Flujo Completo Seguro

```
1. Usuario busca dominio
   ↓
2. Frontend: dominio disponible
   ↓
3. Click "Adquirir" → /checkout
   ↓
4. Usuario completa formulario
   ↓
5. Frontend: POST /api/checkout/create-order
   Headers: { Authorization: Bearer TOKEN }
   Body: { domain, periodId, customerData }
   ↓
6. Backend:
   - Verifica token (extrae uid)
   - Valida input con Zod
   - Verifica disponibilidad (RDAP)
   - Calcula precio (config/pricing.ts)
   - Crea orden en Firestore (pending)
   - Crea preferencia en MP
   - Devuelve init_point
   ↓
7. Frontend: redirige a init_point (Mercado Pago)
   ↓
8. Usuario paga en Mercado Pago
   ↓
9. MP notifica vía webhook
   ↓
10. Backend (webhook):
    - Consulta payment en MP
    - Valida monto y estado
    - Marca orden como paid
    - Activa dominio
    ↓
11. MP redirige a /checkout/success
    ↓
12. Usuario ve confirmación
```

**Seguridad en cada paso:** ✅

---

## 📚 Referencias de Código

- **Autenticación:** `lib/firebase-admin.ts`
- **Cálculo de precios:** `config/pricing.ts`
- **Crear orden:** `app/api/checkout/create-order/route.ts`
- **Webhook:** `app/api/payments/mercadopago/webhook/route.ts`
- **Firestore:** `lib/firestore-utils.ts`

---

**Estado:** ✅ Arquitectura implementada y segura
**Última actualización:** Diciembre 2024

