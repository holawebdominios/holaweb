# 🛒 Flujo Completo de Compra y Registro

## 📊 Diagrama del Flujo

```
┌─────────────────────────────────────────────────────────┐
│                    INICIO                               │
│              Usuario en Home (/)                        │
└───────────────┬─────────────────────────────────────────┘
                │
                ▼
        ¿Usuario logueado?
                │
        ┌───────┴───────┐
        │               │
      SÍ               NO
        │               │
        ▼               ▼
   FLUJO A         FLUJO B
   (Logueado)     (Invitado)
```

---

## 🔐 FLUJO A: Usuario Logueado

```
1. Usuario YA logueado
   Email: juan@example.com
   UID: abc123
   ↓
2. Busca dominio: "miempresa"
   ↓
3. Ve: "✓ miempresa.com.ar - DISPONIBLE"
   ↓
4. Click "Adquirir Dominio"
   → /checkout?domain=miempresa.com.ar
   ↓
5. Formulario PRE-LLENADO:
   ✓ Nombre: Juan Pérez (de su perfil)
   ✓ Email: juan@example.com (de su cuenta)
   ✓ Teléfono: 1112345678 (de su perfil)
   ↓
6. Selecciona período:
   ● 12 meses - $70,800
   ↓
7. Click "Proceder al Pago"
   Headers: { Authorization: Bearer <token> }
   ↓
8. Backend:
   ✓ Verifica token → uid: abc123
   ✓ Verifica disponibilidad
   ✓ Crea orden en Firestore:
     - userId: abc123 ✅
     - domain: miempresa.com.ar
     - status: pending
   ✓ Devuelve URL de suscripción MP
   ↓
9. Redirige a Mercado Pago
   https://www.mercadopago.com.ar/subscriptions/...
   ↓
10. Usuario paga ($70,800)
    ↓
11. MP envía webhook
    ↓
12. Backend webhook:
    ✓ Marca orden como "paid"
    ✓ Activa dominio:
      - userId: abc123 ✅
      - domain: miempresa.com.ar
      - status: active
      - expirationDate: +12 meses
    ↓
13. MP redirige a:
    /checkout/success?orderId=xxx
    ↓
14. Página de éxito muestra:
    "✓ ¡Pago Exitoso!"
    [Ver Mis Dominios] → /dashboard
    ↓
15. En dashboard ve:
    🌐 miempresa.com.ar
    Estado: Activo ✅
    Suscripción: Activa
    Vence: 15/12/2025
```

**Resultado:** Dominio vinculado desde el inicio al userId.

---

## 👤 FLUJO B: Usuario NO Logueado (Checkout Invitado)

```
1. Usuario NO logueado (invitado)
   ↓
2. Busca dominio: "mitienda"
   ↓
3. Ve: "✓ mitienda.com.ar - DISPONIBLE"
   ↓
4. Click "Adquirir Dominio"
   → /checkout?domain=mitienda.com.ar
   ↓
5. Formulario VACÍO (completa manualmente):
   ✓ Nombre: María González
   ✓ Email: maria@example.com
   ✓ Teléfono: 1198765432
   ↓
6. Selecciona período:
   ● 12 meses - $70,800
   ↓
7. Click "Proceder al Pago"
   Headers: { } (sin token)
   ↓
8. Backend:
   ✓ No hay token → authUser = null
   ✓ Verifica disponibilidad
   ✓ Crea orden en Firestore:
     - userId: NO SE AGREGA ❌
     - domain: mitienda.com.ar
     - status: pending
     - metadata.customerEmail: maria@example.com ✅
   ✓ Devuelve URL de suscripción MP
   ↓
9. Redirige a Mercado Pago
   ↓
10. Usuario paga ($70,800)
    ↓
11. MP envía webhook
    ↓
12. Backend webhook:
    ✓ Marca orden como "paid"
    ✓ Activa dominio:
      - userId: NO HAY ❌
      - domain: mitienda.com.ar
      - status: active
      - expirationDate: +12 meses
    ↓
13. MP redirige a:
    /checkout/success?orderId=xxx
    ↓
14. Página de éxito muestra:
    "✓ ¡Pago Exitoso!"
    
    💡 Creá una cuenta con el email maria@example.com
       para gestionar tu dominio
    
    [Crear Cuenta para Gestionar] → /register?email=maria@example.com
    [Volver al Inicio]
    ↓
15. Usuario click "Crear Cuenta"
    → /register?email=maria@example.com
    ↓
16. Formulario PRE-LLENADO:
    ✓ Email: maria@example.com (read-only)
    ○ Nombre: [usuario completa]
    ○ Contraseña: [usuario completa]
    
    💡 "Al crear tu cuenta, vincularemos automáticamente
        tu dominio comprado"
    ↓
17. Usuario completa y click "Crear Cuenta"
    ↓
18. Backend (POST /api/auth/sync-user):
    ✓ Crea usuario en Firebase Auth
    ✓ Crea documento en Firestore (uid: xyz789)
    ✓ Busca órdenes con email: maria@example.com
    ✓ Busca dominios sin userId
    ✓ VINCULA TODO al nuevo userId: xyz789 ✅
    ↓
19. Toast: "¡Cuenta creada!"
    Toast: "Tus dominios han sido vinculados"
    ↓
20. Redirige a /dashboard
    ↓
21. Usuario ve:
    🌐 mitienda.com.ar
    Estado: Activo ✅
    Suscripción: Activa
    Vence: 15/12/2025
```

**Resultado:** Dominio se vincula automáticamente al crear cuenta con el mismo email.

---

## 🔗 Sistema de Vinculación

### **¿Cómo funciona?**

**Archivo:** `lib/domain-linking.ts`

**Función principal:** `linkPurchasedDomains(userId, email)`

**Proceso:**
1. Busca órdenes pagadas sin `userId` pero con `metadata.customerEmail = email`
2. Busca dominios activos sin `userId`
3. Vincula todo al `userId` del usuario que se acaba de registrar

**Código simplificado:**
```typescript
// En sync-user después de crear usuario
if (isNewUser && email) {
  const linkedCount = await linkPurchasedDomains(userId, email);
  // linkedCount = número de órdenes + dominios vinculados
}
```

---

## 📋 Comparación de Escenarios

| Aspecto | Usuario Logueado | Checkout Invitado |
|---------|------------------|-------------------|
| **Checkout** | Formulario pre-llenado | Formulario vacío |
| **Orden** | userId: ✅ | userId: ❌ |
| **Dominio creado** | userId: ✅ | userId: ❌ |
| **Después de pagar** | Va a dashboard | Invitado a registrarse |
| **Al crear cuenta** | N/A | Dominios se vinculan |

---

## 💡 Ventajas del Sistema

### **Para el Usuario:**
- ✅ Puede comprar SIN registrarse (menos fricción)
- ✅ Al registrarse, recupera sus compras
- ✅ Email es la clave de vinculación

### **Para el Negocio:**
- ✅ Menos abandonos (no forzar registro)
- ✅ Capturamos email en checkout
- ✅ Convertimos después con "Gestionar dominio"

---

## 🚨 Casos Especiales

### **¿Qué pasa si nunca crea cuenta?**
- La orden queda en Firestore con el email en metadata
- El dominio queda activo pero sin userId
- MP sigue cobrando la suscripción
- Se puede activar manualmente si contacta soporte

### **¿Puede crear cuenta con otro email?**
- Sí, pero no se vinculará automáticamente
- Deberá contactar soporte para vincular

### **¿Puede comprar varios dominios sin cuenta?**
- Sí, todos con el mismo email
- Al registrarse, se vinculan TODOS

---

## 📧 Emails Automáticos (TODO)

### **Después de Compra Invitada:**
```
Para: maria@example.com
Asunto: ✓ Dominio mitienda.com.ar activado

Tu dominio mitienda.com.ar ha sido registrado y activado.

Para gestionarlo, creá tu cuenta:
[Crear Cuenta Gratis]

O accedé con el mismo email que usaste en la compra.
```

### **Después de Registro (Con vinculación):**
```
Para: maria@example.com
Asunto: ¡Bienvenida! Tus dominios están listos

Tu cuenta ha sido creada exitosamente.

Dominios vinculados:
• mitienda.com.ar (Suscripción activa)

[Ir a Mi Dashboard]
```

---

## 🎯 Resumen del Flujo

### **Checkout Invitado → Registro → Vinculación Automática**

```
Compra SIN cuenta
     ↓
Email guardado en metadata
     ↓
Pago exitoso
     ↓
Dominio activado (sin userId)
     ↓
Invitado a crear cuenta
     ↓
Registro con MISMO email
     ↓
Sistema vincula automáticamente
     ↓
Dashboard con dominios
```

**Clave:** El **email es la conexión** entre la compra invitada y la cuenta futura.

---

## ✅ Estado de Implementación

- [x] Checkout sin login (invitado)
- [x] Guardado de email en metadata
- [x] Vinculación automática al registrarse
- [x] Pre-llenado de email en registro
- [x] Mensaje de vinculación en register
- [x] Toast de confirmación de vinculación
- [ ] Email de bienvenida (TODO)
- [ ] Email post-compra invitada (TODO)

---

**El sistema está completo y funcional. ¡Prueba el flujo completo!** 🚀

