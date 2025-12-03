# 🧪 Modo de Simulación de Pagos

## ¿Qué es?

El modo de simulación te permite probar **todo el flujo de compra** sin necesidad de ir a Mercado Pago ni usar tarjetas de prueba.

---

## 🎯 Cuándo Usar

✅ **Durante desarrollo local:**
- Probar el flujo completo
- Verificar que las órdenes se crean correctamente
- Verificar que los dominios se activan
- Probar la vinculación de dominios
- Testing rápido sin salir del sitio

❌ **NO disponible en producción:**
- El endpoint solo funciona en `localhost`
- En producción, solo funciona el flujo real con MP

---

## 📋 Cómo Funciona

### **Paso 1: Completa el Checkout**

```
1. Busca dominio disponible en home
2. Click "Adquirir Dominio"
3. Completa el formulario de checkout:
   ✓ Nombre: Tu Nombre
   ✓ Email: tu@email.com
   ✓ Teléfono: 1112345678
4. Selecciona período (1 mes, 12 meses o 24 meses)
```

---

### **Paso 2: Proceder al Pago**

```
5. Click "Proceder al Pago"
   ↓
6. Sistema crea la orden en Firestore
   ↓
7. Aparece botón morado: "🧪 Simular Pago (Demo)"
```

---

### **Paso 3: Simular el Pago**

```
8. Click "🧪 Simular Pago (Demo)"
   ↓
9. Backend simula el webhook de Mercado Pago:
   ✓ Marca orden como "paid"
   ✓ Activa el dominio
   ✓ Guarda paymentId simulado
   ↓
10. Toast: "¡Pago simulado exitosamente!"
    ↓
11. Redirige a /checkout/success
    ↓
12. ✓ ¡Compra completada!
```

---

## 🎨 UI del Modo Simulación

### **Checkout (Después de crear orden):**

```
┌────────────────────────────────────┐
│  [💳 Proceder al Pago]             │ ← Botón naranja (va a MP)
│                                    │
│  [🧪 Simular Pago (Demo)]          │ ← Botón morado (simulación)
│                                    │
│  ⚠️  Modo desarrollo: Podés simular│
│      el pago sin ir a Mercado Pago │
└────────────────────────────────────┘
```

---

## 🔄 Flujo Técnico

### **Simulación:**

```typescript
POST /api/checkout/simulate-payment
Body: { orderId: "xxx" }
↓
Backend:
1. Verifica que esté en localhost
2. Obtiene orden de Firestore
3. Marca como "paid"
4. Activa dominio (si hay userId)
5. Devuelve éxito
↓
Frontend:
Redirige a /checkout/success
```

### **Comparación: Real vs Simulado**

| Aspecto | Flujo Real | Flujo Simulado |
|---------|------------|----------------|
| **Redirección** | A Mercado Pago | No sale del sitio |
| **Pago** | Tarjeta real/test | Instantáneo |
| **Webhook** | MP lo envía | Se ejecuta directamente |
| **Tiempo** | 30-60 segundos | 1 segundo |
| **Orden en Firestore** | ✅ | ✅ |
| **Dominio activado** | ✅ | ✅ |
| **Solo en localhost** | ❌ Funciona siempre | ✅ |

---

## 🧪 Testing de Flujos

### **Test 1: Compra Sin Cuenta (Invitado)**

```bash
1. NO iniciar sesión
2. Buscar dominio: "test1"
3. Adquirir
4. Email: invitado@test.com
5. Proceder al pago → Simular
6. ✓ Orden creada sin userId
7. ✓ Dominio activado sin userId
8. Success page: "Crear Cuenta para Gestionar"
```

### **Test 2: Vinculación de Dominios**

```bash
1. Hacer Test 1
2. Click "Crear Cuenta"
3. Registrarse con: invitado@test.com
4. ✓ Sistema vincula automáticamente
5. Toast: "Tus dominios han sido vinculados"
6. Dashboard: Ve test1.com.ar activo
```

### **Test 3: Compra Con Cuenta**

```bash
1. Login con cuenta existente
2. Buscar dominio: "test2"
3. Adquirir
4. Proceder al pago → Simular
5. ✓ Orden creada con userId
6. ✓ Dominio activado con userId
7. Success: "Ver Mis Dominios"
8. Dashboard: Ve test2.com.ar activo
```

---

## 🔒 Seguridad

### **Protecciones:**

✅ **Solo localhost:**
```typescript
const isDevelopment = 
  process.env.NODE_ENV === 'development' || 
  request.headers.get('host')?.includes('localhost');

if (!isDevelopment) {
  return 403; // Forbidden
}
```

✅ **Validación:**
- Verifica que la orden exista
- Verifica que no esté ya pagada
- Valida el orderId con Zod

✅ **En producción:**
- El botón NO aparece
- El endpoint devuelve 403
- No hay forma de abusar

---

## 📊 Verificación en Firebase

**Después de simular un pago:**

### **Firestore → orders:**
```javascript
{
  orderId: "abc123",
  domain: "test1.com.ar",
  status: "paid", ✅
  paymentId: "SIMULATED-1734567890123",
  paidAt: Timestamp(...),
  total: 70800
}
```

### **Firestore → domains:**
```javascript
{
  domain: "test1.com.ar",
  status: "active", ✅
  userId: "xyz789", // Si hay usuario
  expirationDate: Timestamp(+12 meses),
  registrationDate: Timestamp(now)
}
```

---

## 💡 Tips

### **Probar Checkout Invitado:**
1. Abrir ventana de incógnito
2. Hacer compra sin login
3. Simular pago
4. Verificar en Firestore (sin userId)

### **Probar Vinculación:**
1. Hacer compra invitada con email específico
2. Crear cuenta con ese mismo email
3. Verificar que aparezca en dashboard

### **Probar Múltiples Compras:**
1. Hacer 3 compras con mismo email (sin cuenta)
2. Simular pago de las 3
3. Crear cuenta con ese email
4. Verificar que las 3 se vinculen

---

## 🚀 Comandos Útiles

### **Ver logs en tiempo real:**
```bash
# En otra terminal:
npm run dev
# Ver los logs de [Simulate Payment]
```

### **Limpiar Firestore (reset):**
```
Firebase Console → Firestore Database
→ Seleccionar colección
→ Eliminar documentos
```

---

## ⚠️ Importante

**El botón de simulación:**
- ✅ Solo aparece en `localhost`
- ✅ Solo después de crear una orden
- ✅ Simula TODO el proceso (webhook incluido)
- ❌ NO en producción (por seguridad)

**Usa esto para:**
- Desarrollo rápido
- Testing de flujos
- Demos sin tarjeta

**En producción:**
- Usa tarjetas de prueba de MP
- O pagos reales

---

## 📝 Checklist de Prueba

- [ ] Compra simulada sin cuenta
- [ ] Orden se crea en Firestore
- [ ] Dominio se activa
- [ ] Redirige a success
- [ ] Crear cuenta con mismo email
- [ ] Dominio se vincula automáticamente
- [ ] Aparece en dashboard
- [ ] Compra con cuenta logueada
- [ ] Dominio tiene userId desde el inicio

---

**¡Ahora puedes probar todo el sistema sin salir de localhost!** 🎉

